/* ============================================================
   GATEWAY COMMUNICATIONS — BEHAVIOUR
   comms/js/main.js
   Reads window.SITE, window.CASES and window.CLIENTS
   (comms/js/data.js). Vanilla JS, no dependencies.

   Blocks, in order:
     1. helpers                  4. case study cards
     2. shared kit               5. case study panel + carousel
        (nav, menu, cursor,         (same logic as the Spaces panel)
        reveal, contact)         6. clients
     3. mailto builders

   URL scheme (all in the hash):
     #case-id         opens that case study (at image 1)
     #case-id/2       opens that case study at image 2
     #services, #approach, #work, #clients, #one-gateway, #contact
                      are page sections

   History behaviour (same as Spaces and Photography):
     - Opening the panel pushes ONE history entry.
     - Moving between images uses replaceState (no extra entries).
     - Back (button, mobile gesture) closes the panel. Closing with Esc /
       X / backdrop does the same by calling history.back().
     - Opening a deep link directly first rewrites the entry to the plain
       page and then pushes the panel, so Back closes it without leaving
       the site.
   ============================================================ */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var CASES = Array.isArray(window.CASES) ? window.CASES : [];
  var CLIENTS = Array.isArray(window.CLIENTS) ? window.CLIENTS : [];

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
  var SUBJECTS = SITE.subjects || {};
  var PROJECT_SUBJECT = clean(SUBJECTS.project) || 'Project enquiry, Gateway Communications';
  var MEDIA_SUBJECT = clean(SUBJECTS.media) || 'Media enquiry, Gateway Communications';
  var PROJECT_BODY = 'Hello Gateway Communications,\n\nI would like to start a conversation about a project.\n\nName:\nOrganisation:\nPhone or email:\nWhat would you like to communicate?\n\nThank you.';
  var MEDIA_BODY = 'Hello Gateway Communications,\n\nThis is a media enquiry.\n\nName:\nOutlet or organisation:\nDeadline (if any):\nPhone or email:\n\nThank you.';

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
    var hrefs = {
      project: mailtoHref(PROJECT_SUBJECT, PROJECT_BODY),
      media: mailtoHref(MEDIA_SUBJECT, MEDIA_BODY)
    };

    // data-mailto="project" (default) or data-mailto="media"
    $$('[data-mailto]').forEach(function (a) {
      var kind = a.getAttribute('data-mailto') === 'media' ? 'media' : 'project';
      if (hrefs[kind]) a.setAttribute('href', hrefs[kind]); else a.hidden = true;
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
     3. CASE DATA HELPERS
  ========================================================== */
  function validCases() {
    return CASES.filter(function (c) { return c && clean(c.id) && clean(c.title); });
  }
  // Images for a case: its own list; else the cover as a single image; else none
  function imagesOf(c) {
    if (Array.isArray(c.images) && c.images.length) return c.images;
    var cv = clean(c.cover);
    return cv ? [{ src: cv, thumb: cv, alt: clean(c.title) }] : [];
  }
  function coverOf(c) {
    var im = imagesOf(c)[0];
    return clean(c.cover) || (im ? clean(im.thumb) || clean(im.src) : '');
  }
  function caseEnquiryHref(c) {
    return mailtoHref(
      PROJECT_SUBJECT,
      'Hello Gateway Communications,\n\nI read the case study "' + clean(c.title) + '" and would like to talk about a similar project.\n\nName:\nOrganisation:\nPhone or email:\n\nThank you.'
    );
  }

  var ICON_ARROW = '<path d="M5 12h14M13 6l6 6-6 6"/>';

  /* ==========================================================
     4. CASE STUDY CARDS
  ========================================================== */
  var cases = [];
  var byId = Object.create(null);

  function buildCard(c) {
    var title = clean(c.title);
    var li = el('li', 'case-item');
    li.setAttribute('data-reveal', '');

    var btn = el('button', 'case-box');
    btn.type = 'button';
    btn.setAttribute('data-case', clean(c.id));
    btn.setAttribute('aria-haspopup', 'dialog');

    var coverUrl = coverOf(c);
    if (coverUrl) {
      var cover = el('div', 'case-cover');
      var img = document.createElement('img');
      img.src = coverUrl;
      img.width = 1200;
      img.height = 800;
      img.alt = 'Cover image for the case study “' + title + '”';
      img.loading = 'lazy';
      img.decoding = 'async';
      cover.appendChild(img);
      btn.appendChild(cover);
    }

    var body = el('div', 'case-body');
    if (clean(c.clientType)) body.appendChild(el('p', 'case-type', clean(c.clientType)));
    body.appendChild(el('h3', 'case-title', title));
    if (clean(c.summary)) body.appendChild(el('p', 'case-summary', clean(c.summary)));
    var more = el('span', 'case-more', 'Read the case study ');
    more.setAttribute('aria-hidden', 'true');
    more.appendChild(svg(ICON_ARROW));
    body.appendChild(more);

    btn.appendChild(body);
    li.appendChild(btn);
    return li;
  }

  function initCases() {
    var grid = $('#caseGrid');
    if (!grid) return;
    cases = validCases();
    if (!cases.length) { hideSection('work'); return; }

    cases.forEach(function (c) { byId[clean(c.id)] = c; grid.appendChild(buildCard(c)); });
    grid.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.case-box');
      if (!btn) return;
      var c = byId[btn.getAttribute('data-case')];
      if (c) openCase(c, 0, { opener: btn });
    });
  }

  /* ==========================================================
     5. CASE STUDY PANEL + CAROUSEL
     (carousel logic shared with the Spaces panel and the
     Photography lightbox)
  ========================================================== */
  var pn = {
    root: $('#panel'), site: $('#site'), panel: $('.cp-panel'),
    carousel: $('#cpCarousel'), imgwrap: $('#cpImgWrap'), img: $('#cpImg'), spinner: $('#cpSpinner'),
    prev: $('#cpPrev'), next: $('#cpNext'), count: $('#cpCount'), closeBtn: $('#cpClose'),
    type: $('#cpType'), title: $('#cpTitle'), summary: $('#cpSummary'),
    challenge: $('#cpChallenge'), approach: $('#cpApproach'), outcome: $('#cpOutcome'),
    services: $('#cpServices'), cta: $('#cpCta'), live: $('#cpLive'),
    open: false, item: null, photos: [], index: 0, opener: null,
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
      var c = byId[m[1]];
      var count = imagesOf(c).length || 1;
      var n = m[2] ? parseInt(m[2], 10) : 1;
      return { type: 'case', item: c, index: Math.max(1, Math.min(count, n)) - 1 };
    }
    return { type: 'other' };
  }
  function plainUrl() { return location.pathname + location.search; }
  function caseUrl(c, i) { return '#' + encodeURIComponent(clean(c.id)) + '/' + (i + 1); }

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

  /* --- fill the panel's text for the current case study --- */
  function fillBlock(node, text) {
    var wrap = node.closest('.cp-block');
    var t = clean(text);
    node.textContent = t;
    if (wrap) wrap.hidden = !t;
    return !!t;
  }

  function renderCase() {
    var c = pn.item;
    var many = pn.photos.length > 1;

    // The carousel controls only exist for 2+ images; one image is shown plain; none = no media
    pn.carousel.hidden = !pn.photos.length;
    pn.panel.classList.toggle('no-media', !pn.photos.length);
    pn.prev.hidden = pn.next.hidden = pn.count.hidden = !many;

    pn.type.textContent = clean(c.clientType);
    pn.type.hidden = !clean(c.clientType);
    pn.title.textContent = clean(c.title);
    pn.summary.textContent = clean(c.summary);
    pn.summary.hidden = !clean(c.summary);

    var any = false;
    any = fillBlock(pn.challenge, c.challenge) || any;
    any = fillBlock(pn.approach, c.approach) || any;
    any = fillBlock(pn.outcome, c.outcome) || any;

    pn.services.textContent = '';
    var sv = (Array.isArray(c.services) ? c.services : []).map(clean).filter(Boolean);
    sv.forEach(function (s) { pn.services.appendChild(el('li', 'cp-chip', s)); });
    pn.services.closest('.cp-block').hidden = !sv.length;
    any = any || !!sv.length;
    $('#cpBlocks').hidden = !any;

    var href = caseEnquiryHref(c);
    if (href) pn.cta.setAttribute('href', href);
    pn.cta.hidden = !href;

    pn.panel.scrollTop = 0;
  }

  /* --- show image i of the current case study --- */
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
    pn.live.textContent = 'Image ' + (i + 1) + ' of ' + n + (clean(p.alt) ? ': ' + clean(p.alt) : '');
    if (!opts.initial) animate(opts.dir);

    // The frame has a fixed 3:2 size, so nothing jumps while an image loads.
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
    if (n > 1) {
      preload(clean(photos[(i + 1) % n].src));
      preload(clean(photos[(i - 1 + n) % n].src));
    }

    // Keep the URL in step (replace, never push, so Back closes in one press)
    if (pn.pushed && !opts.noUrl) history.replaceState(history.state, '', caseUrl(pn.item, i));
  }
  function step(d) { if (pn.open && pn.photos.length > 1) show(pn.index + d, { dir: d }); }

  /* --- open / close --- */
  function openCase(item, index, opts) {
    opts = opts || {};
    if (!pn.root || !item) return;
    clearTimeout(pn.hideTimer);

    if (pn.open) { // already open: switch image (and case study, if it changed)
      if (pn.item !== item) { pn.item = item; pn.photos = imagesOf(item); renderCase(); }
      show(index, { dir: index > pn.index ? 1 : -1, noUrl: !!opts.fromHistory });
      return;
    }

    pn.item = item;
    pn.photos = imagesOf(item);
    pn.opener = opts.opener || null;
    renderCase();
    pn.open = true;

    // One history entry for the whole panel session
    if (opts.fromHistory) {
      pn.pushed = true; // the entry already exists (Forward / edited URL)
    } else {
      history.pushState({ cp: 'panel' }, '', caseUrl(item, index));
      pn.pushed = true;
    }

    pn.root.hidden = false;
    if (pn.site) pn.site.inert = true;
    document.documentElement.classList.add('cp-open');
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
    document.documentElement.classList.remove('cp-open');
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
      if (e.target === pn.root || (e.target.closest && e.target.closest('[data-cp-close]'))) closePanel(false);
    });

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!pn.open) return;
      var many = pn.photos.length > 1;
      if (e.key === 'Escape') { e.preventDefault(); closePanel(false); }
      else if (e.key === 'ArrowRight' && many) { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft' && many) { e.preventDefault(); step(-1); }
      else if (e.key === 'Home' && many) { e.preventDefault(); show(0, { dir: -1 }); }
      else if (e.key === 'End' && many) { e.preventDefault(); show(pn.photos.length - 1, { dir: 1 }); }
      else trapTab(e, pn.root);
    });

    // Swipe on the image: pointer events; touch-action:pan-y keeps vertical scrolling native
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
      if (!reduced()) { // the image follows the finger
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
      if (r.type === 'case') {
        openCase(r.item, r.index, { fromHistory: true, opener: pn.opener });
        return;
      }
      if (pn.open) closePanel(true); // Back landed on the page entry
    });

    // Deep link: make the current entry the plain page, then push the panel on top of it
    var first = route(location.hash);
    if (first.type === 'case') {
      history.replaceState({ cp: 'page' }, '', plainUrl());
      openCase(first.item, first.index, {});
    }
  }

  /* ==========================================================
     6. CLIENTS (hidden until CLIENTS has entries)
  ========================================================== */
  function initClients() {
    var list = $('#clientList');
    if (!list) return;
    var items = CLIENTS.filter(function (c) { return c && clean(c.name) && clean(c.logo); });
    if (!items.length) { hideSection('clients'); return; }
    items.forEach(function (c) {
      var li = el('li', 'client');
      li.setAttribute('data-reveal', '');
      var img = document.createElement('img');
      img.src = clean(c.logo);
      img.alt = clean(c.name);
      img.width = 160;
      img.height = 44;
      img.loading = 'lazy';
      img.decoding = 'async';
      if (clean(c.url)) {
        var a = document.createElement('a');
        a.href = clean(c.url);
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', clean(c.name) + ' (opens in a new tab)');
        a.appendChild(img);
        li.appendChild(a);
      } else {
        li.appendChild(img);
      }
      list.appendChild(li);
    });
  }

  /* ==========================================================
     BOOT
  ========================================================== */
  function init() {
    initContact();
    initNav();
    initMenu();
    initCases();
    initClients();
    initPanel();   // after the cards exist: a deep link needs byId
    initCursor();
    initReveal(document);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
