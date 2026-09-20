/* ============================================================
   GATEWAY SPACES — BEHAVIOUR
   spaces/js/main.js
   Reads window.SITE, window.SPACES, window.AMENITIES and
   window.FAQS (spaces/js/data.js). Vanilla JS, no dependencies.

   Blocks, in order:
     1. helpers                  4. spaces cards
     2. shared kit               5. space detail panel + carousel
        (nav, menu, cursor,         (same logic as the Photography
        reveal, contact)            lightbox, adapted to a panel)
     3. mailto builders          6. amenities   7. FAQ + JSON-LD

   URL scheme (all in the hash):
     #space-id        opens that space at photo 1
     #space-id/3      opens that space at photo 3
     #spaces, #amenities, #how-it-works, #faq, #contact are page sections

   History behaviour (same as Photography):
     - Opening the panel pushes ONE history entry.
     - Moving between photos uses replaceState (no extra entries).
     - Back (button, mobile gesture) closes the panel. Closing with Esc /
       X / backdrop does the same by calling history.back().
     - Opening a deep link directly first rewrites the entry to the plain
       page and then pushes the panel, so Back closes it without leaving
       the site.
   ============================================================ */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var SPACES = Array.isArray(window.SPACES) ? window.SPACES : [];
  var AMENITIES = Array.isArray(window.AMENITIES) ? window.AMENITIES : [];
  var FAQS = Array.isArray(window.FAQS) ? window.FAQS : [];

  /* ==========================================================
     1. HELPERS
  ========================================================== */
  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarseMq = window.matchMedia('(pointer: coarse)');
  function reduced() { return reduceMq.matches; }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clean(v) { return v == null ? '' : String(v).trim(); }

  var SVG_NS = 'http://www.w3.org/2000/svg';
  function svg(inner, cls) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = inner;
    return s;
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null && text !== '') n.textContent = text;
    return n;
  }

  var lockCount = 0;
  function lockScroll() {
    if (lockCount++ > 0) return;
    var gap = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.classList.add('is-locked');
    if (gap > 0) document.body.style.paddingRight = gap + 'px';
  }
  function unlockScroll() {
    if (--lockCount > 0) return;
    lockCount = 0;
    document.documentElement.classList.remove('is-locked');
    document.body.style.paddingRight = '';
  }

  /* Keep Tab inside a container */
  function trapTab(e, container) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])', container)
      .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], active = document.activeElement;
    if (!container.contains(active)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  /* Hide a whole section and every link that points at it */
  function hideSection(name) {
    var s = document.getElementById(name);
    if (s) s.hidden = true;
    $$('[data-section-link="' + name + '"]').forEach(function (a) {
      a.hidden = true;
      var li = a.closest('li');
      if (li) li.hidden = true;
    });
  }

  /* ==========================================================
     2. SHARED KIT: MAILTO, CONTACT, REVEAL, NAV, CURSOR, MENU
  ========================================================== */
  function mailtoHref(subject, body) {
    var email = clean(SITE.email);
    if (!email) return '';
    return 'mailto:' + email + '?subject=' + encodeURIComponent(subject) +
      (body ? '&body=' + encodeURIComponent(body) : '');
  }
  var VISIT_SUBJECT = 'Book a visit, Gateway Spaces';
  var VISIT_BODY = 'Hello Gateway Spaces,\n\nI would like to book a visit.\n\nName:\nPhone or email:\nPreferred date:\n\nThank you.';

  var SOCIALS = [
    { key: 'instagram', label: 'Instagram', icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>' },
    { key: 'facebook',  label: 'Facebook',  icon: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>' },
    { key: 'youtube',   label: 'YouTube',   icon: '<path d="M22.5 6.5a2.5 2.5 0 0 0-1.7-1.8C19.2 4.3 12 4.3 12 4.3s-7.2 0-8.8.4A2.5 2.5 0 0 0 1.5 6.5C1 8.1 1 12 1 12s0 3.9.5 5.5a2.5 2.5 0 0 0 1.7 1.8c1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4a2.5 2.5 0 0 0 1.7-1.8c.5-1.6.5-5.5.5-5.5s0-3.9-.5-5.5z"/><path d="M10 15l5-3-5-3z"/>' },
    { key: 'vimeo',     label: 'Vimeo',     icon: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M7 8.5l2.6 8 3-4.5 2 4.5L17.5 8.5"/>' },
    { key: 'tiktok',    label: 'TikTok',    icon: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>' },
    { key: 'linkedin',  label: 'LinkedIn',  icon: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>' }
  ];

  function initContact() {
    var email = clean(SITE.email);
    var visit = mailtoHref(VISIT_SUBJECT, VISIT_BODY);

    $$('[data-mailto]').forEach(function (a) {
      if (visit) a.setAttribute('href', visit); else a.hidden = true;
    });
    $$('[data-email]').forEach(function (n) {
      if (email) n.textContent = email; else if (n.parentNode) n.parentNode.hidden = true;
    });

    var address = clean(SITE.address), maps = clean(SITE.mapsUrl);
    $$('[data-address]').forEach(function (n) {
      if (address) n.textContent = address; else if (n.parentNode) n.parentNode.hidden = true;
    });
    $$('[data-maps]').forEach(function (a) {
      if (maps) a.setAttribute('href', maps); else a.removeAttribute('href');
    });

    var wrap = $('#socialsWrap'), list = $('#socials');
    if (!wrap || !list) return;
    list.textContent = '';
    var socials = SITE.socials || {};
    SOCIALS.forEach(function (s) {
      var url = clean(socials[s.key]);
      if (!url) return;
      var a = el('a', 'social-link');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', 'Gateway on ' + s.label + ' (opens in a new tab)');
      a.appendChild(svg(s.icon));
      list.appendChild(a);
    });
    wrap.hidden = !list.children.length;
  }

  /* Scroll reveal: content is visible by default. Only blocks that start
     below the fold get .reveal-pending, then .is-in when they scroll in. */
  var revealIO = null;
  function initReveal(root) {
    if (reduced() || !('IntersectionObserver' in window)) return;
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            revealIO.unobserve(en.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    }
    $$('[data-reveal]:not([data-reveal-init])', root).forEach(function (n) {
      n.setAttribute('data-reveal-init', '');
      if (n.getBoundingClientRect().top < window.innerHeight) return; // already on screen
      var d = parseInt(n.getAttribute('data-reveal-delay') || '0', 10);
      if (d) n.style.transitionDelay = d + 'ms';
      n.classList.add('reveal-pending');
      revealIO.observe(n);
    });
  }

  function initNav() {
    var navbar = $('#navbar');
    if (!navbar) return;
    function onScroll() { navbar.classList.toggle('scrolled', window.scrollY > 40); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initCursor() {
    if (reduced() || coarseMq.matches) return;
    var dot = $('#cursor'), ring = $('#cursorRing');
    if (!dot || !ring) return;
    var mx = -100, my = -100, rx = -100, ry = -100;
    dot.style.left = ring.style.left = '-100px';
    dot.style.top = ring.style.top = '-100px';
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = (mx - 4) + 'px';
      dot.style.top = (my - 4) + 'px';
    });
    (function loop() {
      if (reduced()) return;
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = (rx - 16) + 'px';
      ring.style.top = (ry - 16) + 'px';
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', function (e) {
      document.body.classList.toggle('hovered', !!(e.target.closest && e.target.closest('a,button')));
    });
  }

  function initMenu() {
    var menu = $('#mobileMenu'), openBtn = $('#hamburger'), closeBtn = $('#hamburgerClose');
    if (!menu || !openBtn || !closeBtn) return;
    var isOpen = false;

    function open() {
      if (isOpen) return;
      isOpen = true;
      menu.inert = false;
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      openBtn.classList.add('open');
      openBtn.setAttribute('aria-expanded', 'true');
      openBtn.setAttribute('aria-label', 'Close menu');
      lockScroll();
      closeBtn.focus();
    }
    function close(returnFocus) {
      if (!isOpen) return;
      isOpen = false;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      menu.inert = true;
      openBtn.classList.remove('open');
      openBtn.setAttribute('aria-expanded', 'false');
      openBtn.setAttribute('aria-label', 'Open menu');
      unlockScroll();
      if (returnFocus !== false) openBtn.focus();
    }

    openBtn.addEventListener('click', function () { isOpen ? close() : open(); });
    closeBtn.addEventListener('click', function () { close(); });
    menu.addEventListener('click', function (e) {
      // Links inside the menu: let the browser follow them, then close without stealing focus
      if (e.target.closest && e.target.closest('a')) close(false);
    });
    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') close();
      else trapTab(e, menu);
    });
    window.addEventListener('resize', function () { if (isOpen && window.innerWidth > 960) close(false); });
  }

  /* ==========================================================
     3. SPACE DATA HELPERS
  ========================================================== */
  var TYPES = {
    coworking: 'Co-working',
    office:    'Private Office',
    meeting:   'Meeting Room',
    event:     'Event Space'
  };
  function typeLabel(t) { return TYPES[t] || ''; }

  function validSpaces() {
    return SPACES.filter(function (s) { return s && clean(s.id) && clean(s.name); });
  }
  // Photos for a space; falls back to the cover so a space with no photo list still works
  function photosOf(s) {
    if (Array.isArray(s.photos) && s.photos.length) return s.photos;
    var c = clean(s.cover);
    return c ? [{ src: c, thumb: c, alt: clean(s.name) }] : [];
  }
  function coverOf(s) {
    var p = photosOf(s)[0];
    return clean(s.cover) || (p ? clean(p.thumb) || clean(p.src) : '');
  }
  function priceText(s) {
    var p = clean(s.price);
    if (!p) return 'Price on request';
    var u = clean(s.priceUnit);
    return u ? p + ' ' + u : p;
  }
  function enquireHref(s) {
    var name = clean(s.name), tl = typeLabel(s.type);
    return mailtoHref(
      'Enquiry: ' + name + ', Gateway Spaces',
      'Hello Gateway Spaces,\n\nI would like to enquire about: ' + name + (tl ? ' (' + tl + ')' : '') +
      '.\n\nName:\nPhone or email:\nPreferred date for a visit:\n\nThank you.'
    );
  }

  var ICON_USERS = '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.6"/>';
  var ICON_TAG = '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/>';
  var ICON_ARROW = '<path d="M5 12h14M13 6l6 6-6 6"/>';
  var ICON_TICK = '<polyline points="20 6 9 17 4 12"/>';

  /* ==========================================================
     4. SPACES: CARDS
  ========================================================== */
  var spaces = [];
  var byId = Object.create(null);

  function buildCard(s) {
    var name = clean(s.name);
    var li = el('li', 'space-item');
    li.setAttribute('data-reveal', '');

    var btn = el('button', 'space-box');
    btn.type = 'button';
    btn.setAttribute('data-space', clean(s.id));
    btn.setAttribute('aria-haspopup', 'dialog');

    var body = el('div', 'space-body');
    if (typeLabel(s.type)) body.appendChild(el('p', 'space-type', typeLabel(s.type)));
    body.appendChild(el('h3', 'space-name', name));
    if (clean(s.description)) body.appendChild(el('p', 'space-desc', clean(s.description)));

    // Chips: only what is filled in. Price always shows ("Price on request" when empty).
    var chips = el('div', 'space-chips');
    if (clean(s.capacity)) {
      var c1 = el('span', 'chip');
      c1.appendChild(svg(ICON_USERS));
      c1.appendChild(document.createTextNode(clean(s.capacity)));
      chips.appendChild(c1);
    }
    var c2 = el('span', 'chip');
    c2.appendChild(svg(ICON_TAG));
    c2.appendChild(document.createTextNode(priceText(s)));
    chips.appendChild(c2);
    body.appendChild(chips);

    var more = el('span', 'space-more', 'View space ');
    more.setAttribute('aria-hidden', 'true');
    more.appendChild(svg(ICON_ARROW));
    body.appendChild(more);

    // Cover image only when there is one (no broken image for a space with no photos yet)
    var coverUrl = coverOf(s);
    if (coverUrl) {
      var cover = el('div', 'space-cover');
      var img = document.createElement('img');
      img.src = coverUrl;
      img.width = 1200;
      img.height = 800;
      img.alt = 'Photo of ' + name;
      img.loading = 'lazy';
      img.decoding = 'async';
      cover.appendChild(img);
      btn.appendChild(cover);
    }
    btn.appendChild(body);
    li.appendChild(btn);
    return li;
  }

  function initSpaces() {
    var grid = $('#spaceGrid');
    if (!grid) return;
    spaces = validSpaces();
    spaces.forEach(function (s) { byId[clean(s.id)] = s; });

    var empty = $('#spaceEmpty');
    if (!spaces.length) { if (empty) empty.hidden = false; return; }

    spaces.forEach(function (s) { grid.appendChild(buildCard(s)); });
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.space-box');
      if (!btn) return;
      var s = byId[btn.getAttribute('data-space')];
      if (s) openSpace(s, 0, { opener: btn });
    });
  }

  /* ==========================================================
     5. SPACE DETAIL PANEL + CAROUSEL
     (carousel logic ported from the Photography lightbox)
  ========================================================== */
  var pn = {
    root: $('#panel'), site: $('#site'),
    carousel: $('#spCarousel'), imgwrap: $('#spImgWrap'), img: $('#spImg'), spinner: $('#spSpinner'),
    prev: $('#spPrev'), next: $('#spNext'), count: $('#spCount'), closeBtn: $('#spClose'),
    type: $('#spType'), title: $('#spTitle'), desc: $('#spDesc'), facts: $('#spFacts'),
    includes: $('#spIncludes'), list: $('#spList'), cta: $('#spCta'), live: $('#spLive'),
    open: false, space: null, photos: [], index: 0, opener: null,
    pushed: false,      // true while the panel owns one history entry
    token: 0,           // guards against out-of-order image loads
    spinTimer: null, hideTimer: null,
    cache: Object.create(null), loaded: Object.create(null)
  };

  /* --- hash routing --- */
  function route(hash) {
    var h = String(hash || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    var m = /^([^/]+)(?:\/(\d+))?$/.exec(h);
    if (m && m[1] in byId) {
      var s = byId[m[1]];
      var count = photosOf(s).length || 1;
      var n = m[2] ? parseInt(m[2], 10) : 1;
      return { type: 'space', space: s, index: Math.max(1, Math.min(count, n)) - 1 };
    }
    return { type: 'other' };
  }
  function plainUrl() { return location.pathname + location.search; }
  function spaceUrl(s, i) { return '#' + encodeURIComponent(clean(s.id)) + '/' + (i + 1); }

  /* --- image loading / preloading --- */
  function preload(url) {
    if (!url || pn.cache[url]) return pn.cache[url];
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () { pn.loaded[url] = true; };
    im.src = url;
    pn.cache[url] = im; // keep a reference so the request isn't dropped
    return im;
  }
  function whenLoaded(url) {
    return new Promise(function (resolve) {
      if (pn.loaded[url]) return resolve(true);
      var im = preload(url);
      if (im.complete) { // finished before we started listening (loaded or failed)
        if (im.naturalWidth) pn.loaded[url] = true;
        return resolve(!!im.naturalWidth);
      }
      im.addEventListener('load', function () { pn.loaded[url] = true; resolve(true); });
      im.addEventListener('error', function () { resolve(false); });
    });
  }
  function setImage(url, alt, placeholder) {
    pn.img.alt = alt || '';
    pn.img.src = url;
    pn.img.classList.toggle('is-loading', !!placeholder);
  }
  function animate(dir) {
    if (reduced() || !dir) return;
    var w = pn.imgwrap;
    w.classList.remove('is-anim-next', 'is-anim-prev');
    void w.offsetWidth; // restart the animation
    w.classList.add(dir > 0 ? 'is-anim-next' : 'is-anim-prev');
  }

  /* --- fill the panel's text for the current space --- */
  function renderSpace() {
    var s = pn.space;
    var many = pn.photos.length > 1;

    pn.carousel.hidden = !pn.photos.length;
    pn.prev.hidden = pn.next.hidden = pn.count.hidden = !many;

    var tl = typeLabel(s.type);
    pn.type.textContent = tl;
    pn.type.hidden = !tl;
    pn.title.textContent = clean(s.name);
    var desc = clean(s.description);
    pn.desc.textContent = desc;
    pn.desc.hidden = !desc;

    // Facts: capacity only when filled in; price always ("Price on request" when empty)
    pn.facts.textContent = '';
    if (clean(s.capacity)) {
      var f1 = el('div', 'sp-fact');
      f1.appendChild(el('dt', '', 'Capacity'));
      f1.appendChild(el('dd', '', clean(s.capacity)));
      pn.facts.appendChild(f1);
    }
    var f2 = el('div', 'sp-fact');
    f2.appendChild(el('dt', '', 'Price'));
    f2.appendChild(el('dd', '', priceText(s)));
    pn.facts.appendChild(f2);

    // What's included: hidden when the list is empty
    pn.list.textContent = '';
    var inc = (Array.isArray(s.includes) ? s.includes : []).map(clean).filter(Boolean);
    inc.forEach(function (t) {
      var li = el('li');
      var tick = el('span', 'sp-tick');
      tick.setAttribute('aria-hidden', 'true');
      tick.appendChild(svg(ICON_TICK));
      li.appendChild(tick);
      li.appendChild(el('span', '', t));
      pn.list.appendChild(li);
    });
    pn.includes.hidden = !inc.length;

    var href = enquireHref(s);
    if (href) pn.cta.setAttribute('href', href);
    pn.cta.hidden = !href;

    pn.root.scrollTop = 0;
    $('.sp-panel', pn.root).scrollTop = 0;
  }

  /* --- show photo i of the current space --- */
  function show(i, opts) {
    opts = opts || {};
    var photos = pn.photos, n = photos.length;
    if (!n) return;
    i = ((i % n) + n) % n; // previous/next wrap around
    var p = photos[i];
    var full = clean(p.src), thumb = clean(p.thumb);
    var token = ++pn.token;
    pn.index = i;

    pn.count.textContent = (i + 1) + ' / ' + n;
    pn.live.textContent = 'Photo ' + (i + 1) + ' of ' + n + (clean(p.alt) ? ': ' + clean(p.alt) : '');
    if (!opts.initial) animate(opts.dir);

    // The frame has a fixed 3:2 size, so nothing jumps while a photo loads.
    clearTimeout(pn.spinTimer);
    pn.spinner.hidden = true;
    if (pn.loaded[full]) {
      pn.imgwrap.removeAttribute('aria-busy');
      setImage(full, p.alt, false);
    } else {
      pn.imgwrap.setAttribute('aria-busy', 'true');
      setImage(thumb || full, p.alt, !!thumb); // instant soft preview, then the sharp one
      pn.spinTimer = setTimeout(function () { if (token === pn.token) pn.spinner.hidden = false; }, 200);
      whenLoaded(full).then(function (ok) {
        if (token !== pn.token) return; // user already moved on
        clearTimeout(pn.spinTimer);
        pn.spinner.hidden = true;
        pn.imgwrap.removeAttribute('aria-busy');
        if (ok) setImage(full, p.alt, false);
        else pn.img.classList.remove('is-loading');
      });
    }

    // Preload the neighbours
    preload(clean(photos[(i + 1) % n].src));
    preload(clean(photos[(i - 1 + n) % n].src));

    // Keep the URL in step (replace, never push, so Back closes in one press)
    if (pn.pushed && !opts.noUrl) history.replaceState(history.state, '', spaceUrl(pn.space, i));
  }
  function step(d) { if (pn.open && pn.photos.length > 1) show(pn.index + d, { dir: d }); }

  /* --- open / close --- */
  function openSpace(space, index, opts) {
    opts = opts || {};
    if (!pn.root || !space) return;
    clearTimeout(pn.hideTimer);

    if (pn.open) { // already open: switch photo (and space, if it changed)
      if (pn.space !== space) { pn.space = space; pn.photos = photosOf(space); renderSpace(); }
      show(index, { dir: index > pn.index ? 1 : -1, noUrl: !!opts.fromHistory });
      return;
    }

    pn.space = space;
    pn.photos = photosOf(space);
    pn.opener = opts.opener || null;
    renderSpace();
    pn.open = true;

    // One history entry for the whole panel session
    if (opts.fromHistory) {
      pn.pushed = true; // the entry already exists (Forward / edited URL)
    } else {
      history.pushState({ sp: 'panel' }, '', spaceUrl(space, index));
      pn.pushed = true;
    }

    pn.root.hidden = false;
    if (pn.site) pn.site.inert = true;
    document.documentElement.classList.add('sp-open');
    lockScroll();
    show(index, { initial: true, noUrl: true });
    void pn.root.offsetWidth; // flush styles so the fade-in runs (rAF pauses in background tabs)
    pn.root.classList.add('is-open');
    pn.closeBtn.focus();
  }

  function closePanel(fromPop) {
    if (!pn.open) return;
    pn.open = false;
    pn.token++; // cancel pending image work
    clearTimeout(pn.spinTimer);
    pn.root.classList.remove('is-open');
    pn.imgwrap.style.transform = '';
    if (pn.site) pn.site.inert = false;
    document.documentElement.classList.remove('sp-open');
    unlockScroll();

    // Back to the card that opened it (or the page, for a deep link)
    var opener = pn.opener;
    pn.opener = null;
    var target = opener && document.contains(opener) ? opener : document.getElementById('main');
    if (target) target.focus();

    pn.hideTimer = setTimeout(function () {
      if (!pn.open) { pn.root.hidden = true; pn.img.removeAttribute('src'); }
    }, reduced() ? 0 : 200);

    // Closing from the UI walks history back to the page entry; Back has already done it.
    if (!fromPop && pn.pushed) { pn.pushed = false; history.back(); }
    else pn.pushed = false;
  }

  function initPanel() {
    if (!pn.root) return;

    pn.prev.addEventListener('click', function () { step(-1); });
    pn.next.addEventListener('click', function () { step(1); });

    // Backdrop (the dim area around the panel) and the close button
    pn.root.addEventListener('click', function (e) {
      if (e.target === pn.root || (e.target.closest && e.target.closest('[data-sp-close]'))) closePanel(false);
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!pn.open) return;
      if (e.key === 'Escape') { e.preventDefault(); closePanel(false); }
      else if (e.key === 'ArrowRight' && pn.photos.length > 1) { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft' && pn.photos.length > 1) { e.preventDefault(); step(-1); }
      else if (e.key === 'Home' && pn.photos.length > 1) { e.preventDefault(); show(0, { dir: -1 }); }
      else if (e.key === 'End' && pn.photos.length > 1) { e.preventDefault(); show(pn.photos.length - 1, { dir: 1 }); }
      else trapTab(e, pn.root);
    });

    // Swipe on the photo: pointer events; touch-action:pan-y keeps vertical scrolling native
    var drag = null;
    pn.carousel.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button') || pn.photos.length < 2) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, t: Date.now(), axis: null };
    });
    pn.carousel.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // not a gesture yet
        drag.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
        if (drag.axis === 'x') { try { pn.carousel.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ } }
      }
      if (drag.axis !== 'x') return;
      drag.dx = dx;
      if (!reduced()) { // the photo follows the finger
        pn.imgwrap.classList.remove('is-snap', 'is-anim-next', 'is-anim-prev');
        pn.imgwrap.style.transform = 'translateX(' + dx + 'px)';
      }
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag;
      drag = null;
      try { pn.carousel.releasePointerCapture(e.pointerId); } catch (err) { /* nothing to release */ }
      if (d.axis !== 'x') return;
      var width = pn.carousel.clientWidth || window.innerWidth;
      var threshold = Math.min(120, Math.max(50, width * 0.15)); // 15% of the frame, between 50 and 120 px
      var speed = Math.abs(d.dx) / Math.max(1, Date.now() - d.t);
      var commit = e.type !== 'pointercancel' && (Math.abs(d.dx) >= threshold || (Math.abs(d.dx) >= 30 && speed > 0.5));
      if (commit) {
        pn.imgwrap.style.transform = '';
        step(d.dx < 0 ? 1 : -1);
      } else if (!reduced()) {
        pn.imgwrap.classList.add('is-snap');
        pn.imgwrap.style.transform = '';
      } else {
        pn.imgwrap.style.transform = '';
      }
    }
    pn.carousel.addEventListener('pointerup', endDrag);
    pn.carousel.addEventListener('pointercancel', endDrag);

    // Browser history (Back / Forward / edited URL)
    window.addEventListener('popstate', function () {
      var r = route(location.hash);
      if (r.type === 'space') {
        openSpace(r.space, r.index, { fromHistory: true, opener: pn.opener });
        return;
      }
      if (pn.open) closePanel(true); // Back landed on the page entry
    });

    // Deep link: make the current entry the plain page, then push the panel on top of it
    var first = route(location.hash);
    if (first.type === 'space') {
      history.replaceState({ sp: 'page' }, '', plainUrl());
      openSpace(first.space, first.index, {});
    }
  }

  /* ==========================================================
     6. AMENITIES
  ========================================================== */
  var AMENITY_ICONS = {
    power:    '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    wifi:     '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10.5 10.5 0 0 1 14 0M8.5 16a5.5 5.5 0 0 1 7 0"/><circle cx="12" cy="19.5" r="1"/>',
    meeting:  ICON_USERS,
    coffee:   '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 10h2a2 2 0 0 1 0 4h-2M7 3v2M11 3v2M15 3v2"/>',
    parking:  '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    security: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    desk:     '<path d="M3 10h18M5 10v9M19 10v9M9 10v5h6v-5"/>',
    event:    '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/>',
    kitchen:  '<path d="M6 3v8a2 2 0 0 0 2 2v8M10 3v6M14 3c-2 2-2 6 0 8v10"/>',
    lock:     '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check:    ICON_TICK
  };

  function initAmenities() {
    var list = $('#amenList');
    if (!list) return;
    var items = AMENITIES.filter(function (a) { return a && clean(a.label); });
    if (!items.length) { hideSection('amenities'); return; }
    items.forEach(function (a) {
      var li = el('li', 'amen-item');
      li.setAttribute('data-reveal', '');
      var icon = el('span', 'amen-icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.appendChild(svg(AMENITY_ICONS[clean(a.icon)] || AMENITY_ICONS.check));
      li.appendChild(icon);
      li.appendChild(el('span', 'amen-label', clean(a.label)));
      list.appendChild(li);
    });
  }

  /* ==========================================================
     7. FAQ (accordion) + FAQPage JSON-LD
  ========================================================== */
  function initFaq() {
    var list = $('#faqList');
    if (!list) return;
    var items = FAQS.filter(function (f) { return f && clean(f.q) && clean(f.a); });
    if (!items.length) { hideSection('faq'); return; }

    items.forEach(function (f, i) {
      var qid = 'faq-q-' + i, aid = 'faq-a-' + i;
      var li = el('li', 'faq-item');
      li.setAttribute('data-reveal', '');

      var h = el('h3', 'faq-heading');
      var btn = el('button', 'faq-q');
      btn.type = 'button';
      btn.id = qid;
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-controls', aid);
      btn.appendChild(el('span', '', clean(f.q)));
      var icon = el('span', 'faq-icon');
      icon.setAttribute('aria-hidden', 'true');
      btn.appendChild(icon);
      h.appendChild(btn);

      var panel = el('div', 'faq-panel');
      panel.id = aid;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', qid);
      var inner = el('div', 'faq-panel-inner');
      inner.appendChild(el('p', 'faq-a', clean(f.a)));
      panel.appendChild(inner);

      btn.addEventListener('click', function () {
        var open = li.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
      });

      li.appendChild(h);
      li.appendChild(panel);
      list.appendChild(li);
    });

    injectFaqSchema();
  }

  // FAQPage structured data, built ONLY from real entries (never from
  // entries flagged placeholder: true). No real entries = no markup.
  function injectFaqSchema() {
    var real = FAQS.filter(function (f) { return f && !f.placeholder && clean(f.q) && clean(f.a); });
    var old = document.getElementById('faqLd');
    if (old) old.remove();
    if (!real.length) return;
    var s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'faqLd';
    s.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: real.map(function (f) {
        return { '@type': 'Question', name: clean(f.q), acceptedAnswer: { '@type': 'Answer', text: clean(f.a) } };
      })
    });
    document.head.appendChild(s);
  }

  /* ==========================================================
     BOOT
  ========================================================== */
  function init() {
    initContact();
    initNav();
    initMenu();
    initSpaces();
    initAmenities();
    initFaq();
    initPanel();   // after the cards exist: a deep link needs byId
    initCursor();
    initReveal(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
