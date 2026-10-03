/* ═══════════════════════════════════════════════════════════
   MALIK — single property page renderer (?id=)
   gallery + lightbox · reviews · tags · wishlist · book widget
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var MALIK = window.MALIK, BOOK = window.MALIK_BOOK, UI = window.MALIK_UI;
    var mount = document.querySelector('[data-property-page]');
    if (!mount || !MALIK) return;

    var id = new URLSearchParams(location.search).get('id');
    var p = MALIK.getProperty(id);
    document.title = p.name + ' — Malik Private Residences';

    /* Same category first, then the highest-rated homes */
    var others = MALIK.PROPERTIES.filter(function (x) { return x.id !== p.id; })
      .sort(function (a, b) {
        return ((b.category === p.category) - (a.category === p.category)) || (b.rating - a.rating);
      })
      .slice(0, 3);

    /* Deterministic, non-repeating guest reviews for this residence */
    function hashStr(s) {
      var h = 0;
      for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
      return h;
    }
    function pickReviews(prop) {
      var pool = MALIK.REVIEW_POOL, out = [], n = 3, start = hashStr(prop.id) % pool.length;
      for (var k = 0; k < pool.length && out.length < n; k++) {
        out.push(pool[(start + k * 3) % pool.length]);
      }
      return out;
    }
    var reviews = pickReviews(p);

    function spec(value, label) {
      return '<div class="pspec"><b>' + value + '</b><span>' + label + '</span></div>';
    }
    function starRow(n) {
      var s = '';
      for (var i = 0; i < (n || 5); i++) s += UI ? UI.starSvg() : '';
      return s;
    }

    var tagsHtml = (p.tags || []).map(function (t) { return '<span>' + t + '</span>'; }).join('');

    mount.innerHTML =
      /* Hero / gallery */
      '<section class="section prop-hero-wrap">' +
        '<div class="wrap">' +
          '<nav class="crumbs"><a href="index.html">Home</a><i>/</i><a href="residences.html">Residences</a><i>/</i><span>' + p.name + '</span></nav>' +
          '<div class="prop-gallery">' +
            '<button class="pg-main" data-gi="0" aria-label="Open photo viewer"><img src="' + p.card + '" alt="' + p.name + '"></button>' +
            '<button class="pg-thumb is-active" data-gi="0"><img src="' + p.card + '" alt=""></button>' +
            '<button class="pg-thumb" data-gi="1"><img src="' + p.gallery[1] + '" alt="" loading="lazy"></button>' +
            '<button class="pg-thumb" data-gi="2"><img src="' + p.gallery[2] + '" alt="" loading="lazy"></button>' +
            '<span class="pg-badge">' + p.badge + '</span>' +
            '<span class="pg-zoom"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="5"/><path d="m11.8 11.8 3.4 3.4M8 5.8v4.4M5.8 8h4.4" stroke-linecap="round"/></svg>View photos</span>' +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section prop-body-wrap" style="padding-top:0">' +
        '<div class="wrap prop-layout">' +
          '<div class="prop-main">' +
            '<p class="section-label"><span class="sl-num">Malik Residence</span> ' + p.tagline + '</p>' +
            '<div class="prop-title-row">' +
              '<h1 class="prop-title">' + p.name + '</h1>' +
              '<button type="button" class="prop-wish" data-wish="' + p.id + '">' +
                (UI ? UI.heartSvg() : '') + '<span>Save home</span>' +
              '</button>' +
            '</div>' +
            '<p class="prop-area"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>' + p.area + '</p>' +
            '<div class="prop-rate-row">' +
              '<span class="res-rate">' + (UI ? UI.starSvg() : '') + '<b>' + p.rating.toFixed(2) + '</b></span>' +
              '<a href="#propReviews">' + p.reviews + ' verified guest reviews</a>' +
            '</div>' +
            '<div class="res-tags prop-tags">' + tagsHtml + '</div>' +
            '<div class="prop-specs">' +
              spec(p.beds, 'Bedrooms') + spec(p.baths, 'Bathrooms') + spec(p.guests, 'Sleeps') + spec(p.sqm, 'Square metres') +
            '</div>' +
            '<div class="prop-prose">' + p.description.map(function (t) { return '<p>' + t + '</p>'; }).join('') + '</div>' +

            '<h2 class="prop-sub">Included in your stay</h2>' +
            '<ul class="prop-features">' +
              p.features.map(function (f) {
                return '<li><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 10.5 4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>' + f + '</li>';
              }).join('') +
            '</ul>' +

            '<h2 class="prop-sub">Good to know</h2>' +
            '<ul class="prop-rules">' +
              '<li><b>Check-in / out</b><span>From 3:00 PM · by 11:00 AM — flexible hours on request</span></li>' +
              '<li><b>Children</b><span>Welcomed of all ages, with a dedicated family host</span></li>' +
              '<li><b>Events</b><span>Private celebrations permitted with prior notice</span></li>' +
              '<li><b>Security</b><span>Discreet 24-hour estate security &amp; private entrance</span></li>' +
            '</ul>' +
          '</div>' +

          '<aside class="prop-side">' +
            '<div class="book-card" data-property="' + p.id + '">' +
              '<div class="bc-price">From <b>$' + p.price.toLocaleString('en-US') + '</b><span>per night · min ' + p.minNights + ' nights</span></div>' +
              '<div class="bc-cal" data-cal></div>' +
              '<div class="bc-guests">' +
                '<label for="bcGuests">Guests</label>' +
                '<div class="stepper">' +
                  '<button type="button" data-step="-1" aria-label="Fewer guests">−</button>' +
                  '<select id="bcGuests" data-guests>' +
                    (function () { var o = ''; for (var i = 1; i <= p.guests; i++) o += '<option value="' + i + '">' + i + '</option>'; return o; })() +
                  '</select>' +
                  '<button type="button" data-step="1" aria-label="More guests">+</button>' +
                '</div>' +
              '</div>' +
              '<p class="bc-minnote" data-bk-minnote>Choose your check-in and check-out dates</p>' +
              '<div class="bc-quote" data-quote></div>' +
              '<button class="btn btn-pill btn-gold btn-lg bc-cta" data-continue><span>Reserve — Continue</span>' +
                '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8h10M9.5 4.5 13 8l-3.5 3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</button>' +
              '<p class="bc-or">or speak with a residency advisor</p>' +
              '<a class="bc-call" href="tel:+10000000000">+1 (000) 000-0000</a>' +
              '<ul class="bc-trust-list">' +
                '<li><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 10.5 4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>Free cancellation up to 72 hours</li>' +
                '<li><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 10.5 4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>Host confirmed within the hour</li>' +
                '<li><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4"><path d="m4 10.5 4 4 8-9" stroke-linecap="round" stroke-linejoin="round"/></svg>Total price shown before you pay</li>' +
              '</ul>' +
            '</div>' +
          '</aside>' +
        '</div>' +
      '</section>' +

      /* Guest reviews */
      '<section class="section prop-reviews" id="propReviews">' +
        '<div class="wrap">' +
          '<div class="section-head"><div>' +
            '<p class="section-label"><span class="sl-num">Guests</span> Verified stays</p>' +
            '<h2 class="section-title">Rated <em class="gold-serif">' + p.rating.toFixed(2) + '</em> by our hosts</h2>' +
          '</div><p class="section-head-note">Every review is from a verified Malik stay at ' + p.name + ' — ' + p.reviews + ' and counting.</p></div>' +
          '<div class="prv-grid">' +
            reviews.map(function (r) {
              return '<article class="prv-card panel">' +
                '<div class="prv-stars">' + starRow(5) + '<span class="prv-score">' + p.rating.toFixed(2) + '</span></div>' +
                '<p>“' + r.t + '”</p>' +
                '<div class="prv-who"><b>' + r.n + '</b><small>' + r.l + ' · Verified stay</small></div>' +
              '</article>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>' +

      '<section class="section section-dark prop-similar" style="padding-top:clamp(70px,9vw,120px)">' +
        '<div class="wrap">' +
          '<div class="section-head"><div>' +
            '<p class="section-label light"><span class="sl-num">More</span> The Collection</p>' +
            '<h2 class="section-title light">You may also<br><em class="gold-serif">love</em></h2>' +
          '</div><a href="residences.html" class="btn btn-pill btn-ghost magnetic"><span>View all residences</span></a></div>' +
          '<div class="similar-grid">' +
            others.map(function (o) {
              return '<a class="sim-card tilt" href="property.html?id=' + encodeURIComponent(o.id) + '">' +
                '<span class="sim-media"><img src="' + o.card + '" alt="' + o.name + '" loading="lazy"></span>' +
                '<span class="sim-body"><b>' + o.name + '</b><small>' + o.beds + ' beds · sleeps ' + o.guests + '</small><em>$' + o.price.toLocaleString('en-US') + ' /night</em></span>' +
              '</a>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</section>';

    /* Images: thumbnails swap the main image; full de-duped set feeds the lightbox */
    var displayImgs = [p.card, p.gallery[1], p.gallery[2]];
    var lightboxImgs = [p.card].concat(p.gallery).filter(function (v, i, a) { return a.indexOf(v) === i; });
    var mainImg = mount.querySelector('.pg-main img');
    var current = 0;
    mount.querySelectorAll('.pg-thumb').forEach(function (t) {
      t.addEventListener('click', function () {
        current = Number(t.getAttribute('data-gi'));
        /* route through the image pipeline (tile check + shimmer) if present */
        if (typeof mainImg.__mlkLoad === 'function') mainImg.__mlkLoad(displayImgs[current]);
        else mainImg.src = displayImgs[current];
        mount.querySelectorAll('.pg-thumb').forEach(function (x) { x.classList.toggle('is-active', x === t); });
      });
    });

    /* ---------- Lightbox ---------- */
    var lb = null, lbImg = null, lbCounter = null, lbIndex = 0;
    function buildLightbox() {
      lb = document.createElement('div');
      lb.className = 'lb';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.setAttribute('aria-label', 'Residence photos');
      lb.innerHTML =
        '<button type="button" class="lb-close" aria-label="Close photos">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
        '</button>' +
        '<button type="button" class="lb-nav lb-prev" aria-label="Previous photo">' +
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12.5 4.5 7 10l5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<img class="lb-img" alt="">' +
        '<button type="button" class="lb-nav lb-next" aria-label="Next photo">' +
          '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7.5 4.5 13 10l-5.5 5.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</button>' +
        '<span class="lb-counter"></span>';
      document.body.appendChild(lb);
      lbImg = lb.querySelector('.lb-img');
      lbCounter = lb.querySelector('.lb-counter');
    }
    function showLb(i) {
      lbIndex = (i + lightboxImgs.length) % lightboxImgs.length;
      lbImg.src = lightboxImgs[lbIndex];
      lbImg.alt = p.name + ' — photo ' + (lbIndex + 1);
      lbCounter.textContent = (lbIndex + 1) + ' / ' + lightboxImgs.length;
    }
    function openLb(i) {
      if (!lb) buildLightbox();
      showLb(i);
      lb.classList.add('is-open');
      document.body.classList.add('is-locked');
    }
    function closeLb() {
      if (!lb) return;
      lb.classList.remove('is-open');
      document.body.classList.remove('is-locked');
    }
    mount.querySelector('.pg-main').addEventListener('click', function () {
      /* canonical slot (the pipeline may have cache-busted the live src) */
      var idx = lightboxImgs.indexOf(displayImgs[current]);
      openLb(idx === -1 ? 0 : idx);
    });
    document.addEventListener('click', function (e) {
      if (!lb || !lb.classList.contains('is-open')) return;
      if (e.target === lb) closeLb();
      else if (e.target.closest('.lb-close')) closeLb();
      else if (e.target.closest('.lb-prev')) showLb(lbIndex - 1);
      else if (e.target.closest('.lb-next')) showLb(lbIndex + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (!lb || !lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLb();
      else if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
      else if (e.key === 'ArrowRight') showLb(lbIndex + 1);
    });

    /* Stepper */
    var card = mount.querySelector('.book-card');
    var select = card.querySelector('[data-guests]');
    card.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        var next = Number(select.value) + Number(b.getAttribute('data-step'));
        select.value = Math.max(1, Math.min(p.guests, next));
        select.dispatchEvent(new Event('change'));
      });
    });

    /* Wishlist initial state for the injected button */
    if (UI && UI.refreshWishes) UI.refreshWishes();

    BOOK.init();
    BOOK.initPropertyWidget(card);
  });
})();
