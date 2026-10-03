/* ═══════════════════════════════════════════════════════════
   MALIK — collection browser (search · sort · filters · map
   · saved homes · quick view) + nightly-rates table
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var MALIK = window.MALIK, UI = window.MALIK_UI;

    /* ---------- Nightly rates table (pricing page) ---------- */
    var ratesBody = document.querySelector('[data-rates-body]');
    if (ratesBody && MALIK) {
      ratesBody.innerHTML = MALIK.PROPERTIES.map(function (p) {
        return '<tr>' +
          '<td data-th="Residence" class="rt-name"><a href="property.html?id=' + encodeURIComponent(p.id) + '">' + p.name + '</a><small>' + p.area + '</small></td>' +
          '<td data-th="Beds">' + p.beds + '</td>' +
          '<td data-th="Sleeps">' + p.guests + '</td>' +
          '<td data-th="Min. stay">' + p.minNights + ' nights</td>' +
          '<td data-th="From / night" class="rt-price">$' + p.price.toLocaleString('en-US') + '</td>' +
          '<td data-th="" class="rt-action"><a href="booking.html?property=' + encodeURIComponent(p.id) + '">Book <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 7h8M8 4l3 3-3 3" stroke-linecap="round" stroke-linejoin="round"/></svg></a></td>' +
        '</tr>';
      }).join('');
    }

    /* ---------- Collection browser ---------- */
    var grid = document.querySelector('[data-res-grid]');
    if (!grid || !MALIK || !UI) return;

    var state = {
      q: '',
      sort: 'featured',
      guests: 0,
      category: 'all',
      savedOnly: /[?&]saved=1/.test(location.search),
      view: 'grid'
    };

    var filters = document.querySelector('[data-res-filters]');
    var searchEl = document.querySelector('[data-br-search]');
    var sortEl = document.querySelector('[data-br-sort]');
    var guestsEl = document.querySelector('[data-br-guests]');
    var countEl = document.querySelector('[data-res-count]');
    var emptyEl = document.querySelector('[data-res-empty]');
    var savedChip = document.querySelector('[data-filter-saved]');
    var viewBtns = document.querySelectorAll('[data-view]');
    var mapEl = document.querySelector('[data-map]');
    var qv = document.querySelector('[data-quickview]');

    /* Saved chip count + label */
    function refreshSavedChip() {
      if (!savedChip) return;
      var n = UI.wishlist.read().length;
      savedChip.querySelector('[data-saved-num]').textContent = n;
      savedChip.classList.toggle('is-on', n > 0);
    }

    function matches(p) {
      if (state.savedOnly && !UI.wishlist.has(p.id)) return false;
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.guests && p.guests < state.guests) return false;
      if (state.q) {
        var hay = (p.name + ' ' + p.area + ' ' + p.badge + ' ' + (p.tags || []).join(' ') + ' ' + p.blurb).toLowerCase();
        if (hay.indexOf(state.q) === -1) return false;
      }
      return true;
    }

    var SORTERS = {
      featured: function (a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating; },
      rating: function (a, b) { return b.rating - a.rating; },
      priceAsc: function (a, b) { return a.price - b.price; },
      priceDesc: function (a, b) { return b.price - a.price; },
      beds: function (a, b) { return b.beds - a.beds; },
      size: function (a, b) { return b.sqm - a.sqm; }
    };

    function list() {
      return MALIK.PROPERTIES.filter(matches).sort(SORTERS[state.sort] || SORTERS.featured);
    }

    function draw() {
      var items = list();
      grid.innerHTML = items.map(UI.cardHtml).join('');
      if (countEl) {
        countEl.textContent = state.savedOnly
          ? (items.length + (items.length === 1 ? ' saved residence' : ' saved residences'))
          : (items.length + (items.length === 1 ? ' residence' : ' residences'));
      }
      if (emptyEl) emptyEl.hidden = items.length > 0;
      grid.hidden = items.length === 0 || state.view === 'map';
      UI.observeReveals(grid);
      UI.refreshWishes();
      UI.bindTilt(grid);
      drawMap(items);
      refreshSavedChip();
    }

    /* ---------- Stylised peninsula map ---------- */
    function drawMap(items) {
      if (!mapEl) return;
      var shown = {};
      items.forEach(function (p) { shown[p.id] = true; });
      mapEl.querySelectorAll('[data-mp]').forEach(function (pin) {
        pin.classList.toggle('is-dim', !shown[pin.getAttribute('data-mp')]);
      });
      mapEl.querySelector('[data-map-count]').textContent = items.length;
    }

    function syncHotspots() {
      grid.addEventListener('mouseover', function (e) {
        var card = e.target.closest('.res-card');
        if (!card || !mapEl) return;
        var id = card.getAttribute('data-property-id');
        mapEl.querySelectorAll('[data-mp]').forEach(function (p) {
          p.classList.toggle('is-hot', p.getAttribute('data-mp') === id);
        });
      });
      grid.addEventListener('mouseleave', function () {
        if (mapEl) mapEl.querySelectorAll('[data-mp]').forEach(function (p) { p.classList.remove('is-hot'); });
      });
      if (!mapEl) return;
      mapEl.addEventListener('mouseover', function (e) {
        var pin = e.target.closest('[data-mp]');
        if (!pin) return;
        var id = pin.getAttribute('data-mp');
        grid.querySelectorAll('.res-card').forEach(function (c) {
          c.classList.toggle('is-hot', c.getAttribute('data-property-id') === id);
        });
        pin.classList.add('is-hot');
      });
      mapEl.addEventListener('mouseleave', function () {
        mapEl.querySelectorAll('[data-mp]').forEach(function (p) { p.classList.remove('is-hot'); });
        grid.querySelectorAll('.res-card').forEach(function (c) { c.classList.remove('is-hot'); });
      });
    }

    function buildMap() {
      if (!mapEl) return;
      var pinWrap = mapEl.querySelector('[data-map-pins]');
      pinWrap.innerHTML = MALIK.PROPERTIES.map(function (p) {
        /* Tooltip direction keeps cards inside the chart edges */
        var dir = p.map.x < 22 ? 'mp--e' : (p.map.x > 74 ? 'mp--w' : 'mp--n');
        return '<a class="map-pin ' + dir + '" data-mp="' + p.id + '" href="property.html?id=' + encodeURIComponent(p.id) + '" ' +
          'style="left:' + p.map.x + '%;top:' + p.map.y + '%" aria-label="' + p.name + '">' +
          '<span class="mp-dot"></span>' +
          '<span class="mp-card"><b>' + p.name + '</b><small>' + p.beds + ' bd · sleeps ' + p.guests + ' · from $' + p.price.toLocaleString('en-US') + '</small></span>' +
        '</a>';
      }).join('');
      drawMap(MALIK.PROPERTIES);
    }

    function setView(v) {
      state.view = v;
      viewBtns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-view') === v); });
      if (mapEl) mapEl.hidden = v !== 'map';
      grid.hidden = v === 'map' || list().length === 0;
      if (emptyEl) emptyEl.hidden = v === 'map' ? true : list().length > 0;
    }

    /* ---------- Quick view modal ---------- */
    function qvHtml(p) {
      var tags = (p.tags || []).map(function (t) { return '<span>' + t + '</span>'; }).join('');
      return '<div class="qv-media"><img src="' + p.card + '" alt="' + p.name + '">' +
          '<span class="res-badge">' + p.badge + '</span>' +
          '<button class="res-wish qv-wish" data-wish="' + p.id + '" aria-label="Save this residence">' + UI.heartSvg() + '</button></div>' +
        '<div class="qv-info">' +
          '<span class="res-tag">' + UI.CATEGORY_LABELS[p.category] + ' — ' + p.area + '</span>' +
          '<div class="qv-title-row"><h3>' + p.name + '</h3>' +
            '<span class="res-rate">' + UI.starSvg() + '<b>' + p.rating.toFixed(2) + '</b><i>' + p.reviews + ' reviews</i></span></div>' +
          '<p class="qv-blurb">' + p.blurb + '</p>' +
          '<div class="qv-specs">' +
            '<span><b>' + p.beds + '</b> Beds</span><span><b>' + p.baths + '</b> Baths</span>' +
            '<span><b>' + p.guests + '</b> Sleeps</span><span><b>' + p.sqm + '</b> m²</span>' +
            '<span><b>' + p.minNights + '</b> min nights</span>' +
          '</div>' +
          '<div class="res-tags">' + tags + '</div>' +
          '<div class="qv-foot">' +
            '<span class="res-price">From <b>$' + p.price.toLocaleString('en-US') + '</b><i>/night</i></span>' +
            '<span class="qv-actions">' +
              '<a class="btn btn-pill btn-dark" href="property.html?id=' + encodeURIComponent(p.id) + '"><span>Full residence</span></a>' +
              '<a class="btn btn-pill btn-gold" href="booking.html?property=' + encodeURIComponent(p.id) + '"><span>Book now</span>' +
                '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9.5 4.5 13 8l-3.5 3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
            '</span>' +
          '</div>' +
        '</div>';
    }

    function openQuick(id) {
      var p = MALIK.findProperty(id);
      if (!p || !qv) return;
      qv.querySelector('[data-qv-body]').innerHTML = qvHtml(p);
      qv.classList.add('is-open');
      qv.setAttribute('aria-hidden', 'false');
      document.body.classList.add('is-locked');
      UI.refreshWishes();
    }
    UI.openQuick = openQuick;

    function closeQuick() {
      if (!qv) return;
      qv.classList.remove('is-open');
      qv.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
    }
    if (qv) {
      qv.addEventListener('click', function (e) { if (e.target === qv || e.target.closest('[data-qv-close]')) closeQuick(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeQuick(); });
    }

    /* ---------- Events ---------- */
    if (filters) {
      filters.addEventListener('click', function (e) {
        var chip = e.target.closest('[data-filter]');
        if (!chip) return;
        var f = chip.getAttribute('data-filter');
        state.category = f;
        filters.querySelectorAll('[data-filter]').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
        state.savedOnly = false;
        savedChip && savedChip.classList.remove('is-active');
        draw();
      });
    }
    if (savedChip) {
      savedChip.addEventListener('click', function () {
        state.savedOnly = !state.savedOnly;
        savedChip.classList.toggle('is-active', state.savedOnly);
        filters && filters.querySelectorAll('[data-filter]').forEach(function (c) { c.classList.remove('is-active'); });
        if (state.savedOnly && state.view === 'map') setView('grid');
        draw();
      });
    }
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        state.q = searchEl.value.trim().toLowerCase();
        draw();
      });
    }
    if (sortEl) {
      sortEl.addEventListener('change', function () { state.sort = sortEl.value; draw(); });
    }
    if (guestsEl) {
      guestsEl.addEventListener('change', function () { state.guests = Number(guestsEl.value) || 0; draw(); });
    }
    viewBtns.forEach(function (b) {
      b.addEventListener('click', function () { setView(b.getAttribute('data-view')); });
    });

    /* Wishlist changes while saved-only view is open keep the list honest */
    document.addEventListener('malik:removed', function (e) {
      if (state.savedOnly) draw();
      refreshSavedChip();
    });
    document.addEventListener('malik:wishlist', refreshSavedChip);

    /* ---------- Init ---------- */
    buildMap();
    syncHotspots();   /* delegated — bind once */
    if (state.savedOnly && savedChip) savedChip.classList.add('is-active');
    draw();
    setView('grid');
  });
})();
