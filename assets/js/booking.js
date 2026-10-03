/* ═══════════════════════════════════════════════════════════
   MALIK — short-stay booking engine
   Shared by booking.html (full flow) and property.html (widget)
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var MALIK = window.MALIK;
  var STORE_KEY = 'malik-booking';
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  /* ---------------- State ---------------- */
  var state = {
    propertyId: null,
    checkIn: null,   // 'yyyy-mm-dd'
    checkOut: null,
    guests: 2
  };

  function save() {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function load() {
    try {
      var raw = sessionStorage.getItem(STORE_KEY);
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.propertyId) state = s;
      }
    } catch (e) {}
    var p = new URLSearchParams(location.search);
    if (p.get('property')) state.propertyId = p.get('property');
    if (p.get('in')) state.checkIn = p.get('in');
    if (p.get('out')) state.checkOut = p.get('out');
    if (p.get('guests')) state.guests = Math.max(1, parseInt(p.get('guests'), 10) || 2);
    // Invalid stored dates (past) are reset on calendar render
    var known = MALIK.PROPERTIES.some(function (x) { return x.id === state.propertyId; });
    if (!known) state.propertyId = MALIK.PROPERTIES[0].id;
  }

  /* ---------------- Date helpers ---------------- */
  function parse(s) {
    if (!s) return null;
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }
  function fmt(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function human(s) {
    var d = parse(s);
    return d ? String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()].slice(0, 3) : '';
  }
  function longHuman(s) {
    var d = parse(s);
    return d ? MONTHS[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear() : '';
  }
  function nights() {
    var a = parse(state.checkIn), b = parse(state.checkOut);
    return a && b ? Math.round((b - a) / 86400000) : 0;
  }
  function stripTime(d) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }

  function quote() {
    var prop = MALIK.getProperty(state.propertyId);
    var n = nights();
    var rent = n * prop.price;
    var cleaning = n ? MALIK.SERVICE.cleaning : 0;
    var service = Math.round(rent * MALIK.SERVICE.serviceRate);
    var tax = Math.round(rent * MALIK.SERVICE.taxRate);
    return { nights: n, rate: prop.price, rent: rent, cleaning: cleaning, service: service, tax: tax, total: rent + cleaning + service + tax };
  }
  function money(v) {
    return MALIK.SERVICE.currency + v.toLocaleString('en-US');
  }

  /* ---------------- Range calendar ---------------- */
  function Calendar(mountEl, opts) {
    opts = opts || {};
    this.el = mountEl;
    this.monthsToShow = opts.months || 2;
    this.onChange = opts.onChange || function () {};
    var now = stripTime(new Date());
    this.cursor = new Date(now.getFullYear(), now.getMonth(), 1);
    this.hover = null;
    this.today = now;
    this._render();
    this._bind();
  }

  Calendar.prototype._render = function () {
    var self = this;
    var monthsHtml = '';
    for (var k = 0; k < this.monthsToShow; k++) {
      var d = new Date(this.cursor.getFullYear(), this.cursor.getMonth() + k, 1);
      var canPrev = this.cursor > new Date(this.today.getFullYear(), this.today.getMonth(), 1);
      monthsHtml +=
        '<div class="bk-month">' +
          '<div class="bk-mhead">' +
            '<span>' + MONTHS[d.getMonth()] + ' <em>' + d.getFullYear() + '</em></span>' +
            '<span class="bk-mnav">' +
              (k === 0 ? '<button type="button" class="bk-prev' + (canPrev ? '' : ' is-off') + '" aria-label="Previous month"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 4 6 10l6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '') +
              (k === self.monthsToShow - 1 ? '<button type="button" class="bk-next" aria-label="Next month"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m8 4 6 6-6 6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' : '') +
            '</span>' +
          '</div>' +
          '<div class="bk-dow">' + DOW.map(function (x) { return '<span>' + x + '</span>'; }).join('') + '</div>' +
          '<div class="bk-grid">' + self._weeks(d) + '</div>' +
        '</div>';
    }
    this.el.innerHTML =
      '<div class="bk-legend"><span class="lg in">Check-in / out</span><span class="lg between">Your stay</span></div>' +
      '<div class="bk-months months-' + this.monthsToShow + '">' + monthsHtml + '</div>';
  };

  Calendar.prototype._weeks = function (monthDate) {
    var first = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    var offset = (first.getDay() + 6) % 7; // Monday-first
    var daysIn = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    var html = '';
    for (var blank = 0; blank < offset; blank++) html += '<span class="bk-day is-empty"></span>';
    for (var day = 1; day <= daysIn; day++) {
      var d = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
      var key = fmt(d);
      var cls = 'bk-day';
      if (d < this.today) cls += ' is-disabled';
      if (key === state.checkIn) cls += ' is-bound is-in';
      if (key === state.checkOut) cls += ' is-bound is-out';
      if (this._between(key)) cls += ' is-between';
      if (this._hoverBetween(key)) cls += ' is-hover-range';
      if (key === fmt(this.today)) cls += ' is-today';
      html += '<button type="button" class="' + cls + '" data-date="' + key + '"' + (d < this.today ? ' disabled' : '') + '>' + day + '</button>';
    }
    return html;
  };

  Calendar.prototype._between = function (key) {
    if (!state.checkIn || !state.checkOut) return false;
    return key > state.checkIn && key < state.checkOut;
  };
  Calendar.prototype._hoverBetween = function (key) {
    if (!state.checkIn || state.checkOut || !this.hover || this.hover <= state.checkIn) return false;
    return key > state.checkIn && key < this.hover;
  };
  Calendar.prototype._hoverBound = function () {
    return (!state.checkOut && state.checkIn && this.hover && this.hover > state.checkIn) ? this.hover : null;
  };

  Calendar.prototype._bind = function () {
    var self = this;
    this.el.addEventListener('click', function (e) {
      var prev = e.target.closest('.bk-prev');
      var next = e.target.closest('.bk-next');
      var dayBtn = e.target.closest('.bk-day[data-date]');
      if (prev && !prev.classList.contains('is-off')) {
        self.cursor = new Date(self.cursor.getFullYear(), self.cursor.getMonth() - 1, 1);
        self._render();
      } else if (next) {
        self.cursor = new Date(self.cursor.getFullYear(), self.cursor.getMonth() + 1, 1);
        self._render();
      } else if (dayBtn) {
        self._pick(dayBtn.getAttribute('data-date'));
      }
    });
    this.el.addEventListener('mouseover', function (e) {
      var dayBtn = e.target.closest('.bk-day[data-date]');
      if (!dayBtn) return;
      self.hover = dayBtn.getAttribute('data-date');
      self._refreshRangeVisuals();
    });
    this.el.addEventListener('mouseleave', function () { self.hover = null; self._refreshRangeVisuals(); });
  };

  Calendar.prototype._pick = function (key) {
    var prop = MALIK.getProperty(state.propertyId);
    if (!state.checkIn || (state.checkIn && state.checkOut)) {
      state.checkIn = key;
      state.checkOut = null;
    } else if (key <= state.checkIn) {
      state.checkIn = key;
      state.checkOut = null;
    } else {
      var a = parse(state.checkIn), b = parse(key);
      var gap = Math.round((b - a) / 86400000);
      if (gap < prop.minNights) {
        // restart selection from the new date, with a gentle hint
        state.checkIn = key; state.checkOut = null;
        flashMin(prop.minNights);
      } else {
        state.checkOut = key;
      }
    }
    save();
    this._render();
    this.onChange();
  };

  Calendar.prototype._refreshRangeVisuals = function () {
    var hoverEnd = this._hoverBound();
    this.el.querySelectorAll('.bk-day[data-date]').forEach(function (btn) {
      var key = btn.getAttribute('data-date');
      btn.classList.toggle('is-between', key > state.checkIn && key < (state.checkOut || hoverEnd || '') && !(!state.checkOut && !hoverEnd));
      if (!state.checkOut) {
        btn.classList.toggle('is-hover-end', key === hoverEnd);
      } else {
        btn.classList.toggle('is-hover-end', false);
      }
      if (state.checkIn) btn.classList.toggle('is-in', key === state.checkIn);
      if (state.checkOut) btn.classList.toggle('is-out', key === state.checkOut);
    });
  };

  function flashMin(n) {
    var note = document.querySelector('[data-bk-minnote]');
    if (!note) return;
    note.textContent = 'Minimum stay ' + n + ' nights';
    note.classList.add('is-flash');
    setTimeout(function () { note.classList.remove('is-flash'); }, 1600);
  }

  /* ---------------- Shared renderers ---------------- */
  function renderSummary(el) {
    if (!el) return;
    var prop = MALIK.getProperty(state.propertyId);
    var q = quote();
    el.innerHTML =
      '<div class="bk-sum-prop">' +
        '<img src="' + prop.card + '" alt="' + prop.name + '" loading="lazy">' +
        '<div><strong>' + prop.name + '</strong><small>' + prop.area + '</small></div>' +
      '</div>' +
      '<div class="bk-sum-dates">' +
        '<div><span>Check-in</span><b>' + (state.checkIn ? longHuman(state.checkIn) : 'Select date') + '</b></div>' +
        '<div class="bk-sum-arrow"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 10h12M11 5.5 15 10l-4 4.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<div><span>Check-out</span><b>' + (state.checkOut ? longHuman(state.checkOut) : 'Select date') + '</b></div>' +
      '</div>' +
      '<div class="bk-sum-line"><span>' + (q.nights || '—') + ' night' + (q.nights === 1 ? '' : 's') + ' × ' + money(q.rate) + '</span><b>' + (q.nights ? money(q.rent) : '—') + '</b></div>' +
      '<div class="bk-sum-line"><span>Housekeeping &amp; preparation</span><b>' + (q.nights ? money(q.cleaning) : '—') + '</b></div>' +
      '<div class="bk-sum-line"><span>Service &amp; concierge (12%)</span><b>' + (q.nights ? money(q.service) : '—') + '</b></div>' +
      '<div class="bk-sum-line"><span>Taxes (5%)</span><b>' + (q.nights ? money(q.tax) : '—') + '</b></div>' +
      '<div class="bk-sum-total"><span>Estimated total</span><b>' + (q.nights ? money(q.total) : '—') + '</b></div>' +
      '<p class="bk-sum-fine">Free cancellation up to 30 days before arrival. Charged in USD.</p>';
  }

  function renderDateBadges(inEl, outEl) {
    if (inEl) inEl.textContent = state.checkIn ? human(state.checkIn) : 'Add date';
    if (outEl) outEl.textContent = state.checkOut ? human(state.checkOut) : 'Add date';
  }

  /* ---------------- Property page mini widget ---------------- */
  function initPropertyWidget(cardEl) {
    if (!cardEl || !MALIK) return;
    var id = cardEl.getAttribute('data-property');
    state.propertyId = id || state.propertyId || MALIK.PROPERTIES[0].id;
    if (parse(state.checkIn) && parse(state.checkIn) < stripTime(new Date())) { state.checkIn = null; state.checkOut = null; }
    save();

    var calEl = cardEl.querySelector('[data-cal]');
    var summaryEl = cardEl.querySelector('[data-quote]');
    var guestsEl = cardEl.querySelector('[data-guests]');
    var guestsLabel = cardEl.querySelector('[data-guests-label]');
    var cta = cardEl.querySelector('[data-continue]');
    var prop = MALIK.getProperty(state.propertyId);

    if (guestsEl) guestsEl.value = Math.min(state.guests, prop.guests);
    function syncGuestsLabel() {
      if (guestsLabel && guestsEl) guestsLabel.textContent = guestsEl.value + ' guest' + (Number(guestsEl.value) === 1 ? '' : 's');
    }
    syncGuestsLabel();

    new Calendar(calEl, { months: 1, onChange: update });
    if (guestsEl) guestsEl.addEventListener('change', function () {
      state.guests = Number(guestsEl.value);
      syncGuestsLabel();
      save();
      update();
    });
    if (cta) cta.addEventListener('click', function () {
      if (!state.checkIn || !state.checkOut) {
        cardEl.classList.add('needs-dates');
        setTimeout(function () { cardEl.classList.remove('needs-dates'); }, 1400);
        return;
      }
      save();
      location.href = 'booking.html?property=' + encodeURIComponent(state.propertyId);
    });

    function update() { renderSummary(summaryEl); }
    update();
  }

  /* ---------------- Full booking page flow ---------------- */
  function initBookingPage(root) {
    if (!root || !MALIK) return;
    load();
    if (parse(state.checkIn) && parse(state.checkIn) < stripTime(new Date())) { state.checkIn = null; state.checkOut = null; save(); }

    var picker = root.querySelector('[data-picker]');
    var calEl = root.querySelector('[data-cal]');
    var summaryEl = root.querySelector('[data-summary]');
    var guestsEl = root.querySelector('[data-guests]');
    var steps = root.querySelectorAll('[data-step]');
    var dots = root.querySelectorAll('[data-stepdot]');
    var continueBtn = root.querySelector('[data-continue]');
    var backBtn = root.querySelector('[data-back]');
    var confirmBtn = root.querySelector('[data-confirm]');
    var form = root.querySelector('[data-guest-form]');
    var step = 1;

    function renderPicker() {
      picker.innerHTML = MALIK.PROPERTIES.map(function (p) {
        return '<button type="button" class="pick-card' + (p.id === state.propertyId ? ' is-sel' : '') + '" data-pick="' + p.id + '">' +
          '<span class="pick-img"><img src="' + p.card + '" alt="' + p.name + '" loading="lazy"></span>' +
          '<span class="pick-body"><b>' + p.name + '</b><small>' + p.area + '</small>' +
          '<small class="pick-spec">' + p.beds + ' beds · Sleeps ' + p.guests + '</small></span>' +
          '<span class="pick-price">' + money(p.price) + '<i>/night</i></span>' +
        '</button>';
      }).join('');
    }

    function setStep(n) {
      step = n;
      steps.forEach(function (s) { s.classList.toggle('is-active', Number(s.getAttribute('data-step')) === n); });
      dots.forEach(function (d) { d.classList.toggle('is-done', Number(d.getAttribute('data-stepdot')) < n); d.classList.toggle('is-active', Number(d.getAttribute('data-stepdot')) === n); });
      root.classList.toggle('is-confirm', n === 3);
      window.scrollTo({ top: root.offsetTop - 90, behavior: 'smooth' });
    }

    function refresh() {
      renderSummary(summaryEl);
      if (guestsEl) {
        var prop = MALIK.getProperty(state.propertyId);
        guestsEl.max = prop.guests;
        if (Number(guestsEl.value) > prop.guests) guestsEl.value = prop.guests;
        state.guests = Number(guestsEl.value);
      }
      continueBtn.disabled = !(state.checkIn && state.checkOut);
      save();
    }

    renderPicker();
    new Calendar(calEl, { months: 2, onChange: refresh });
    if (guestsEl) guestsEl.value = state.guests;
    refresh();

    picker.addEventListener('click', function (e) {
      var card = e.target.closest('[data-pick]');
      if (!card) return;
      state.propertyId = card.getAttribute('data-pick');
      renderPicker();
      refresh();
    });
    if (guestsEl) guestsEl.addEventListener('change', refresh);

    continueBtn.addEventListener('click', function () {
      if (!state.checkIn || !state.checkOut) return;
      renderReview();
      setStep(2);
    });
    backBtn.addEventListener('click', function () { setStep(1); });

    function renderReview() {
      var prop = MALIK.getProperty(state.propertyId);
      var q = quote();
      var box = root.querySelector('[data-review]');
      box.innerHTML =
        '<div class="rv-prop"><img src="' + prop.card + '" alt=""><div><strong>' + prop.name + '</strong><span>' + prop.area + ' · Sleeps ' + prop.guests + '</span></div></div>' +
        '<div class="rv-grid">' +
          '<div><span>Check-in</span><b>' + longHuman(state.checkIn) + '</b><small>From 3:00 PM</small></div>' +
          '<div><span>Check-out</span><b>' + longHuman(state.checkOut) + '</b><small>By 11:00 AM</small></div>' +
          '<div><span>Guests</span><b>' + state.guests + '</b><small></small></div>' +
          '<div><span>Nights</span><b>' + q.nights + '</b><small></small></div>' +
        '</div>' +
        '<div class="rv-total"><span>Estimated total</span><b>' + money(q.total) + '</b></div>';
    }

    confirmBtn.addEventListener('click', function () {
      if (!form.reportValidity || !form.reportValidity()) { if (form.checkValidity) form.checkValidity(); return; }
      var fd = new FormData(form);
      var prop = MALIK.getProperty(state.propertyId);
      var q = quote();
      var code = 'MLK-' + Math.random().toString(36).slice(2, 7).toUpperCase();
      var name = String(fd.get('name') || '').trim();
      root.querySelector('[data-confirm-body]').innerHTML =
        '<div class="cf-seal"><svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="30" cy="30" r="27"/><path d="m18 30.5 8 8 16-17" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '<h3>Your residence is held, ' + name.split(' ')[0] + '.</h3>' +
        '<p>A Malik host has begun preparing <b>' + prop.name + '</b> for ' + longHuman(state.checkIn) + '. A confirmation with arrival details is on its way to <b>' + String(fd.get('email')) + '</b>.</p>' +
        '<div class="cf-code">Reservation <b>' + code + '</b></div>' +
        '<div class="cf-summary">' +
          '<span>' + q.nights + ' night' + (q.nights === 1 ? '' : 's') + ' · ' + state.guests + ' guest' + (state.guests === 1 ? '' : 's') + '</span>' +
          '<b>' + money(q.total) + '</b>' +
        '</div>' +
        '<a class="btn btn-outline" href="residences.html"><span>Browse another residence</span></a>';
      setStep(3);
    });
  }

  window.MALIK_BOOK = {
    init: load,
    state: state,
    save: save,
    Calendar: Calendar,
    quote: quote,
    money: money,
    human: human,
    initPropertyWidget: initPropertyWidget,
    initBookingPage: initBookingPage
  };
})();
