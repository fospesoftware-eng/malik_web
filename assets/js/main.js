/* ═══════════════════════════════════════════════════════════
   MALIK — interactions
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  /* ═══════════════════════════════════════════════════════════
     IMAGE PIPELINE — shimmer · auto-retry for generation tiles ·
     async decode · hero priority · lazy below the fold
     ═══════════════════════════════════════════════════════════ */
  function enhanceImg(img) {
    if (img.__mlkImg || !img) return;
    img.__mlkImg = true;
    img.decoding = 'async';
    img.classList.add('mlk-img');

    const isHostImg = /trae-api-cn\.mchost\.guru/.test(img.getAttribute('src') || '');
    const isHero = !!img.closest('.hero, .page-hero, .pg-main');
    if (isHero) {
      img.setAttribute('fetchpriority', 'high');
      img.loading = 'eager';
    } else if (!img.getAttribute('loading')) {
      img.loading = 'lazy';
    }

    const ready = () => { img.classList.add('is-ready'); img.classList.remove('img-loading'); };
    const pending = () => { img.classList.add('img-loading'); img.classList.remove('is-ready'); };

    if (!isHostImg) {
      if (img.complete && img.naturalWidth > 0) ready();
      else { pending(); img.addEventListener('load', ready, { once: true }); }
      return;
    }

    /* While a prompt is still being generated the API answers with a
       fixed 1832×1832 "image is generating — refresh in 5 minutes" tile
       (real photos come back at ≤1368px on the long side, so the tile's
       dimensions — or its exact 176,626-byte body when Resource Timing
       is exposed — identify it reliably). Candidates are fetched with a
       detached probe image and only revealed once verified, so the tile
       can never flash on screen; the visible tile holds a transparent
       veil over the gold shimmer while polling for up to ~8 minutes and
       slow-polling thereafter — photos self-heal with no refresh. */
    const VEIL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const TILE_BYTES = 176626;
    const DELAYS = [1500, 4000, 8000, 15000, 25000, 40000, 60000, 90000, 120000, 160000];
    const SLOW_POLL = 150000;
    const ATTEMPT_WAIT = 45000; /* cold requests are sometimes held open by the gateway */
    let tries = 0, epoch = 0;
    let origSrc = img.src;

    pending();
    img.removeAttribute('src');
    img.src = VEIL;

    /* Other scripts (e.g. gallery thumbnails) can point the pipeline at
       a new canonical URL and let the same verify-then-reveal flow run. */
    img.__mlkLoad = function (next) {
      if (!next || next === origSrc) return;
      origSrc = next;
      tries = 0;
      epoch++;
      img.__mlkDone = false;
      pending();
      img.src = VEIL;
      attempt();
    };

    const isGeneratingTile = (probe, url) => {
      const w = probe.naturalWidth, h = probe.naturalHeight;
      if (w && h && Math.max(w, h) >= 1600) return true;
      try {
        const es = performance.getEntriesByType('resource');
        for (let i = es.length - 1; i >= 0; i--) {
          if (es[i].name === url) return es[i].encodedBodySize === TILE_BYTES;
        }
      } catch (e) {}
      return false;
    };

    const reveal = (url) => {
      if (img.__mlkDone) return;
      const revealEpoch = epoch;
      const paint = () => {
        if (img.__mlkDone || revealEpoch !== epoch) return;
        img.__mlkDone = true;
        ready();
      };
      img.addEventListener('load', () => { if (img.decode) img.decode().then(paint, paint); else paint(); }, { once: true });
      img.addEventListener('error', () => { if (revealEpoch === epoch) schedule(); }, { once: true });
      img.src = url; /* warm from the probe's browser-cache fetch */
    };

    function schedule() {
      if (img.__mlkDone) return;
      pending();
      if (img.src !== VEIL) img.src = VEIL;
      const delay = tries < DELAYS.length ? DELAYS[tries] : SLOW_POLL;
      setTimeout(attempt, delay);
    }

    function attempt() {
      if (img.__mlkDone) return;
      if (document.hidden) {
        document.addEventListener('visibilitychange', attempt, { once: true });
        return;
      }
      tries++;
      const myEpoch = ++epoch;
      /* The server keys generations by prompt and ignores unknown query
         params, so a cache-bust both bypasses a cached tile and picks up
         the finished generation. Alternate with identical-URL requests. */
      const bust = tries === 1 || tries % 2 === 0;
      const url = bust
        ? origSrc + (origSrc.indexOf('?') > -1 ? '&' : '?') + '_r=' + tries + String(Date.now()).slice(-4)
        : origSrc;

      const probe = new Image();
      probe.decoding = 'async';
      if (isHero) probe.fetchPriority = 'high';
      let settled = false;
      const done = (ok) => {
        if (settled || myEpoch !== epoch || img.__mlkDone) return;
        if (ok && !isGeneratingTile(probe, url)) reveal(url);
        else schedule();
      };
      const t = setTimeout(() => done(false), ATTEMPT_WAIT);
      probe.onload = () => {
        clearTimeout(t);
        if (probe.decode) probe.decode().then(() => done(true), () => done(true));
        else done(true);
      };
      probe.onerror = () => { clearTimeout(t); done(false); };
      probe.src = url;
    }

    /* Heroes fetch straight away; everything else waits until it nears
       the viewport, preserving lazy-load bandwidth on long pages. */
    if (isHero || !('IntersectionObserver' in window)) {
      attempt();
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { io.disconnect(); attempt(); }
        });
      }, { rootMargin: '420px 0px' });
      io.observe(img);
    }
  }

  Array.prototype.forEach.call(document.images, enhanceImg);
  if ('MutationObserver' in window && document.body) {
    const imgObs = new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'IMG') enhanceImg(n);
        if (n.querySelectorAll) n.querySelectorAll('img').forEach(enhanceImg);
      }));
    });
    imgObs.observe(document.body, { childList: true, subtree: true });
  }

  /* ---------- Theme toggle ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  themeBtn && themeBtn.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('malik-theme', next); } catch (e) {}
  });

  /* ---------- Header on scroll ---------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => header && header.classList.toggle('scrolled', window.scrollY > 40);
  onScrollHeader();

  /* ---------- Mobile menu ---------- */
  const menu = document.getElementById('mobileMenu');
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.getElementById('menuClose');
  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('is-locked', open);
  };
  menuOpen && menuOpen.addEventListener('click', () => setMenu(true));
  menuClose && menuClose.addEventListener('click', () => setMenu(false));
  menu && menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- Hero parallax + spotlight ---------- */
  const hero = document.getElementById('hero');
  const heroBg = document.getElementById('heroBg');
  const spotlight = document.getElementById('heroSpotlight');
  const layers = hero ? hero.querySelectorAll('[data-depth]') : [];
  let mx = 0, my = 0, ticking = false;

  if (hero && !prefersReduced && !isTouch) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width - 0.5;
      my = (e.clientY - r.top) / r.height - 0.5;
      if (spotlight) {
        spotlight.style.setProperty('--mx', ((mx + 0.5) * 100) + '%');
        spotlight.style.setProperty('--my', ((my + 0.5) * 100) + '%');
      }
      if (!ticking) {
        requestAnimationFrame(applyParallax);
        ticking = true;
      }
    });
  }

  function applyParallax() {
    ticking = false;
    layers.forEach(el => {
      const d = parseFloat(el.dataset.depth) || 0;
      el.style.transform = 'translate3d(' + (mx * -d) + 'px,' + (my * -d) + 'px,0)';
    });
  }

  const heroParallaxScroll = () => {
    onScrollHeader();
    if (!hero) return;
    const y = window.scrollY;
    const h = hero.offsetHeight;
    if (y < h + 200) {
      const p = Math.min(y / h, 1);
      if (heroBg && !isTouch) heroBg.style.transform = 'translate3d(0,' + (p * 70) + 'px,0) scale(1.05)';
      const word = hero.querySelector('.hero-word');
      if (word) {
        word.style.transform = 'translate3d(0,' + (p * 90) + 'px,0)';
        word.style.opacity = String(1 - p * 1.05);
      }
      const eyebrow = hero.querySelector('.hero-eyebrow');
      if (eyebrow) eyebrow.style.opacity = String(1 - p * 1.6);
    }
  };
  window.addEventListener('scroll', heroParallaxScroll, { passive: true });
  heroParallaxScroll();

  /* ---------- Feature residence cycler ---------- */
  const fmImgs = document.querySelectorAll('.fm-img');
  const fmThumbs = document.querySelectorAll('.ft-thumb');
  const fmCurrent = document.getElementById('fmCurrent');
  let fmIndex = 0;
  function setFeature(i) {
    fmIndex = (i + fmImgs.length) % fmImgs.length;
    fmImgs.forEach((img, k) => img.classList.toggle('is-active', k === fmIndex));
    fmThumbs.forEach((t, k) => t.classList.toggle('is-active', k === fmIndex));
    if (fmCurrent) fmCurrent.textContent = '0' + (fmIndex + 1);
  }
  fmThumbs.forEach(t => t.addEventListener('click', () => setFeature(parseInt(t.dataset.fmTarget, 10))));
  const fmNext = document.getElementById('featureNext');
  fmNext && fmNext.addEventListener('click', () => setFeature(fmIndex + 1));

  /* ---------- Amenities ---------- */
  const amenItems = document.querySelectorAll('.amen-item');
  const asImgs = document.querySelectorAll('.as-img');
  const asNum = document.getElementById('asNum');
  const asTitle = document.getElementById('asTitle');
  const asDesc = document.getElementById('asDesc');
  const amenStage = document.querySelector('.amen-stage');
  let amenTimer = null;

  function setAmenity(i, userTriggered) {
    amenItems.forEach((it, k) => it.classList.toggle('is-active', k === i));
    asImgs.forEach((img, k) => img.classList.toggle('is-active', k === i));
    const item = amenItems[i];
    if (item) {
      if (asNum) asNum.textContent = ('0' + (i + 1)).slice(-2);
      const title = item.querySelector('.ai-title');
      const body = item.querySelector('.ai-body p');
      if (title && asTitle) asTitle.innerHTML = title.innerHTML;
      if (body && asDesc) asDesc.textContent = body.textContent;
    }
    if (userTriggered) restartAmenAuto();
  }
  amenItems.forEach((it, i) => {
    it.querySelector('.ai-head').addEventListener('click', () => setAmenity(i, true));
  });
  function restartAmenAuto() {
    if (prefersReduced) return;
    clearInterval(amenTimer);
    amenTimer = setInterval(() => {
      const active = [...amenItems].findIndex(it => it.classList.contains('is-active'));
      setAmenity((active + 1) % amenItems.length, false);
    }, 4600);
  }
  if (amenStage && !isTouch) {
    amenStage.addEventListener('mouseenter', () => clearInterval(amenTimer));
    amenStage.addEventListener('mouseleave', restartAmenAuto);
  }
  if (amenItems.length) restartAmenAuto();

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.count');
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1600;
    const start = performance.now();
    function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(c => cObs.observe(c));
  } else {
    counters.forEach(c => c.textContent = c.dataset.count);
  }

  /* ---------- Magnetic buttons ---------- */
  if (!prefersReduced && !isTouch) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const strength = 0.32;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = 'translate(' + (x * strength) + 'px,' + (y * strength) + 'px)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform .6s cubic-bezier(.22,.61,.22,1)';
        el.style.transform = 'translate(0,0)';
        setTimeout(() => { el.style.transition = ''; }, 600);
      });
    });

    /* ---------- 3D tilt on collection cards ---------- */
    document.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(900px) rotateY(' + ((px - 0.5) * 6) + 'deg) rotateX(' + ((0.5 - py) * 6) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .7s cubic-bezier(.22,.61,.22,1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 700);
      });
    });
  }

  /* ---------- Newsletter ---------- */
  const newsForm = document.getElementById('newsForm');
  const newsNote = document.getElementById('newsNote');
  newsForm && newsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (newsNote) {
      newsNote.textContent = 'Welcome to The Malik List.';
    }
    newsForm.reset();
  });

  /* ═══════════════════════════════════════════════════════════
     PREMIUM UI KIT — wishlist · cards · cursor · back-to-top
     ═══════════════════════════════════════════════════════════ */
  const MALIK = window.MALIK;

  const CATEGORY_LABELS = {
    cliff: 'Cliffside', coast: 'Beachfront', sky: 'Sky Residences',
    garden: 'Garden Estates', lake: 'Lakeside'
  };

  /* ---------- Wishlist (saved homes, persisted) ---------- */
  const wishlist = {
    key: 'malik-wishlist',
    read() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch (e) { return []; } },
    write(ids) { try { localStorage.setItem(this.key, JSON.stringify(ids)); } catch (e) {} },
    has(id) { return this.read().indexOf(id) > -1; },
    toggle(id) {
      let ids = this.read();
      const on = ids.indexOf(id) > -1;
      ids = on ? ids.filter(x => x !== id) : ids.concat(id);
      this.write(ids);
      document.dispatchEvent(new CustomEvent('malik:wishlist', { detail: { id, on: !on, ids } }));
      return !on;
    }
  };

  function heartSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3c-4.8-3.5-8.4-6.4-8.4-10.2A4.6 4.6 0 0 1 12 7.1a4.6 4.6 0 0 1 8.4 3c0 3.8-3.6 6.7-8.4 10.2Z"/></svg>';
  }

  function starSvg() {
    return '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.6l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L10 14.3l-5.1 2.7 1.1-5.6L1.8 7.5l5.7-.7z"/></svg>';
  }

  function refreshWishes(changedId, on) {
    document.querySelectorAll('[data-wish]').forEach(btn => {
      const id = btn.getAttribute('data-wish');
      const saved = changedId ? (id === changedId ? on : btn.classList.contains('is-saved')) : wishlist.has(id);
      btn.classList.toggle('is-saved', saved);
      btn.setAttribute('aria-pressed', String(saved));
      const label = saved ? 'Remove from saved homes' : 'Save this residence';
      btn.setAttribute('aria-label', label);
    });
    const badge = document.querySelector('.hw-badge');
    const count = wishlist.read().length;
    if (badge) { badge.textContent = count; badge.classList.toggle('is-on', count > 0); }
    const hw = document.querySelector('.header-wish');
    if (hw) hw.classList.toggle('has-saved', count > 0);
  }
  document.addEventListener('malik:wishlist', e => refreshWishes(e.detail.id, e.detail.on));

  /* Global delegated heart toggle (works for nodes rendered later) */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-wish]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const id = btn.getAttribute('data-wish');
    if (!MALIK || !MALIK.findProperty(id)) return;
    const on = wishlist.toggle(id);
    btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.32)' }, { transform: 'scale(1)' }],
      { duration: 420, easing: 'cubic-bezier(.16,.84,.24,1)' });
    if (!on) document.dispatchEvent(new CustomEvent('malik:removed', { detail: { id } }));
  });

  /* ---------- Premium residence card ---------- */
  function cardHtml(p) {
    const tags = (p.tags || []).slice(0, 3).map(t => '<span>' + t + '</span>').join('');
    return '<article class="res-card tilt reveal" data-property-id="' + p.id + '">' +
      '<div class="res-card-media">' +
        '<a class="rcm-link" href="property.html?id=' + encodeURIComponent(p.id) + '" aria-label="' + p.name + '">' +
          '<img src="' + p.card + '" alt="' + p.name + '" loading="lazy">' +
          '<span class="res-veil"></span>' +
        '</a>' +
        '<span class="res-badge">' + p.badge + '</span>' +
        '<button class="res-wish" data-wish="' + p.id + '" aria-label="Save this residence">' + heartSvg() + '</button>' +
        '<button class="res-quick" data-quick="' + p.id + '"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 12.5v3.5h3.5L14.7 6.8 11.2 3.3 2 12.5Z" stroke-linejoin="round"/><path d="m9.5 5 3.5 3.5" /></svg>Quick view</button>' +
      '</div>' +
      '<div class="res-card-body">' +
        '<div class="res-title-row">' +
          '<span class="res-tag">' + (CATEGORY_LABELS[p.category] || 'Residence') + '</span>' +
          '<span class="res-rate">' + starSvg() + '<b>' + p.rating.toFixed(2) + '</b><i>(' + p.reviews + ')</i></span>' +
        '</div>' +
        '<h3><a href="property.html?id=' + encodeURIComponent(p.id) + '">' + p.name + '</a></h3>' +
        '<p>' + p.blurb + '</p>' +
        '<div class="res-tags">' + tags + '</div>' +
        '<div class="res-specs">' +
          '<span><b>' + p.beds + '</b> Beds</span><i></i>' +
          '<span><b>' + p.baths + '</b> Baths</span><i></i>' +
          '<span><b>' + p.guests + '</b> Guests</span><i></i>' +
          '<span><b>' + p.sqm + '</b> m²</span>' +
        '</div>' +
        '<div class="res-foot">' +
          '<span class="res-price">From <b>$' + p.price.toLocaleString('en-US') + '</b><i>/night</i></span>' +
          '<a class="res-cta" href="property.html?id=' + encodeURIComponent(p.id) + '">View residence <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8h10M9.5 4.5 13 8l-3.5 3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></a>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* Observe freshly injected reveal nodes */
  function observeReveals(scope) {
    const els = (scope || document).querySelectorAll('.reveal:not(.in)');
    if ('IntersectionObserver' in window && !prefersReduced) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
      els.forEach(el => io.observe(el));
    } else els.forEach(el => el.classList.add('in'));
  }

  /* Quick-view hook — residences.js registers the opener */
  const UI = window.MALIK_UI = {
    wishlist, heartSvg, starSvg, cardHtml, observeReveals,
    refreshWishes, bindTilt,
    CATEGORY_LABELS, openQuick: null
  };

  document.addEventListener('click', e => {
    const q = e.target.closest('[data-quick]');
    if (!q) return;
    e.preventDefault();
    const id = q.getAttribute('data-quick');
    if (typeof UI.openQuick === 'function') UI.openQuick(id);
    else location.href = 'property.html?id=' + encodeURIComponent(id);
  });

  /* ---------- Header wishlist heart (injected on every page) ---------- */
  const headerActions = document.querySelector('.header-actions');
  if (headerActions) {
    const a = document.createElement('a');
    a.className = 'header-wish';
    a.href = 'residences.html?saved=1';
    a.setAttribute('aria-label', 'Saved residences');
    a.innerHTML = heartSvg() + '<span class="hw-badge" aria-hidden="true">0</span>';
    const toggle = document.getElementById('themeToggle');
    headerActions.insertBefore(a, toggle);
    refreshWishes();
  }

  /* ---------- Homepage featured residences ---------- */
  const featuredGrid = document.querySelector('[data-featured-grid]');
  if (featuredGrid && MALIK) {
    const picks = MALIK.PROPERTIES.filter(p => p.featured).slice(0, 3);
    featuredGrid.innerHTML = picks.map(cardHtml).join('');
    observeReveals(featuredGrid);
    refreshWishes();
    bindTilt(featuredGrid);
  }
  function bindTilt(scope) {
    if (prefersReduced || isTouch) return;
    scope.querySelectorAll('.tilt').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(900px) rotateY(' + ((px - .5) * 5) + 'deg) rotateX(' + ((.5 - py) * 5) + 'deg) translateY(-4px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .7s cubic-bezier(.22,.61,.22,1)';
        card.style.transform = '';
        setTimeout(() => { card.style.transition = ''; }, 700);
      });
    });
  }

  /* ---------- Custom cursor (fine pointers only) ---------- */
  if (!isTouch && !prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    document.documentElement.classList.add('cursor-on');
    const dot = document.createElement('div'); dot.id = 'cursorDot';
    const ring = document.createElement('div'); ring.id = 'cursorRing';
    document.body.appendChild(dot); document.body.appendChild(ring);
    let rx = -100, ry = -100, tx = -100, ty = -100, raf = null;
    window.addEventListener('mousemove', e => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
      if (!raf) raf = requestAnimationFrame(ringLoop);
    }, { passive: true });
    function ringLoop() {
      rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
      ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
      if (Math.abs(tx - rx) > 0.12 || Math.abs(ty - ry) > 0.12) raf = requestAnimationFrame(ringLoop);
      else raf = null;
    }
    document.addEventListener('mouseover', e => {
      ring.classList.toggle('is-hover', !!e.target.closest('a,button,input,select,textarea,label,[data-wish],[data-quick]'));
    });
    window.addEventListener('mousedown', () => ring.classList.add('is-down'));
    window.addEventListener('mouseup', () => ring.classList.remove('is-down'));
    document.addEventListener('mouseleave', () => { dot.style.opacity = 0; ring.style.opacity = 0; });
    document.addEventListener('mouseenter', () => { dot.style.opacity = ''; ring.style.opacity = ''; });
  }

  /* ---------- Back to top with scroll progress ---------- */
  const top = document.createElement('button');
  top.className = 'back-top';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML =
    '<svg class="bt-ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="bt-track" cx="24" cy="24" r="21"/><circle class="bt-progress" cx="24" cy="24" r="21"/></svg>' +
    '<svg class="bt-arrow" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 14.5v-11M4.5 8 9 3.5 13.5 8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(top);
  const progress = top.querySelector('.bt-progress');
  const CIRC = 2 * Math.PI * 21;
  progress.style.strokeDasharray = String(CIRC);
  progress.style.strokeDashoffset = String(CIRC);
  let topTick = false;
  window.addEventListener('scroll', () => {
    if (!topTick) {
      topTick = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        progress.style.strokeDashoffset = String(CIRC * (1 - p));
        top.classList.toggle('is-on', window.scrollY > 640);
        topTick = false;
      });
    }
  }, { passive: true });
  top.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

})();
