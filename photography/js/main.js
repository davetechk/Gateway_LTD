/* ============================================================
   GATEWAY PHOTOGRAPHY — SHARED BEHAVIOUR (home + gallery)
   photography/js/main.js
   Nav, mobile menu, cursor, scroll reveal, contact details,
   and the home page's featured albums. Reads window.SITE and
   window.ALBUMS (photography/js/data.js) and exposes a small
   helper kit as window.GP for gallery.js.
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var ALBUMS = Array.isArray(window.ALBUMS) ? window.ALBUMS : [];

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

  /* ----------------------------------------------------------
     CATEGORIES, DATES, ALBUM HELPERS
  ---------------------------------------------------------- */
  var CATS = {
    events:     { label: 'Events',          slug: 'events' },
    portraits:  { label: 'Portraits',       slug: 'portraits' },
    commercial: { label: 'Commercial',      slug: 'commercial' },
    editorial:  { label: 'Editorial',       slug: 'editorial' },
    brand:      { label: 'Brand Campaigns', slug: 'brand-campaigns' }
  };
  var CAT_ORDER = ['events', 'portraits', 'commercial', 'editorial', 'brand'];
  function catLabel(key) { return CATS[key] ? CATS[key].label : ''; }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // "2026-05-14" | "2026-05" | "2026" → parsed; anything else → null (shown as typed)
  function parseDate(d) {
    var m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?$/.exec(clean(d));
    if (!m) return null;
    var y = +m[1], mo = m[2] ? +m[2] : 0, da = m[3] ? +m[3] : 0;
    if (mo && (mo < 1 || mo > 12)) return null;
    return { y: y, mo: mo, key: y * 10000 + (mo || 1) * 100 + (da || 1) };
  }
  function formatDate(d) {
    var p = parseDate(d);
    if (!p) return clean(d);
    return p.mo ? MONTHS[p.mo - 1] + ' ' + p.y : String(p.y);
  }
  function countLabel(n) { return n + (n === 1 ? ' photo' : ' photos'); }

  function isValidAlbum(a) {
    return !!(a && clean(a.id) && Array.isArray(a.photos) && a.photos.length);
  }
  function coverOf(a) { return clean(a.cover) || clean(a.photos[0].thumb) || clean(a.photos[0].src); }
  function albumMeta(a) {
    return [formatDate(a.date), clean(a.location), countLabel(a.photos.length)].filter(Boolean).join(' · ');
  }

  // Newest first. Albums whose date can't be read keep their file order, after the dated ones.
  function sortedAlbums() {
    return ALBUMS.filter(isValidAlbum)
      .map(function (a, i) { return { a: a, i: i, p: parseDate(a.date) }; })
      .sort(function (x, y) {
        if (x.p && y.p) return (y.p.key - x.p.key) || (x.i - y.i);
        if (x.p) return -1;
        if (y.p) return 1;
        return x.i - y.i;
      })
      .map(function (x) { return x.a; });
  }

  /* ----------------------------------------------------------
     SCROLL LOCK (shared by mobile menu + lightbox)
  ---------------------------------------------------------- */
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
    var f = $$('a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])', container)
      .filter(function (n) { return n.offsetParent !== null || n === document.activeElement; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1], active = document.activeElement;
    if (!container.contains(active)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
  }

  /* ----------------------------------------------------------
     CONTACT DETAILS (email, address, maps link, socials)
  ---------------------------------------------------------- */
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
    var subject = 'Book a shoot';

    $$('[data-mailto]').forEach(function (a) {
      if (email) a.setAttribute('href', 'mailto:' + email + '?subject=' + encodeURIComponent(subject));
      else a.hidden = true;
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

  /* ----------------------------------------------------------
     SCROLL REVEAL
     Content is visible by default. Only blocks that start below the
     fold get .reveal-pending, then .is-in when they scroll into view.
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     NAV, CURSOR
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     MOBILE MENU
  ---------------------------------------------------------- */
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

  /* ----------------------------------------------------------
     HOME: FEATURED ALBUMS (first 3 with featured: true, newest first)
     Each card links to gallery.html#album-id, which opens that album
     straight into the lightbox.
  ---------------------------------------------------------- */
  function initFeatured() {
    var grid = $('#featuredGrid');
    if (!grid) return;
    var section = $('#featured');
    var list = sortedAlbums().filter(function (a) { return a.featured; }).slice(0, 3);
    if (!list.length) { if (section) section.hidden = true; return; }

    list.forEach(function (a) {
      var li = el('li');
      li.setAttribute('data-reveal', '');
      var link = el('a', 'feat-card');
      link.href = 'gallery.html#' + encodeURIComponent(clean(a.id));

      var cover = el('div', 'feat-cover');
      var img = document.createElement('img');
      img.src = coverOf(a);
      img.width = 1200;
      img.height = 900;
      img.alt = 'Cover photo for the album “' + (clean(a.title) || 'Untitled') + '”';
      img.loading = 'lazy';
      img.decoding = 'async';
      cover.appendChild(img);
      var arrow = el('span', 'feat-arrow');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.appendChild(svg('<path d="M5 12h14M13 6l6 6-6 6"/>'));
      cover.appendChild(arrow);

      var body = el('div', 'feat-body');
      body.appendChild(el('p', 'feat-cat', catLabel(a.category)));
      body.appendChild(el('h3', 'feat-title', clean(a.title) || 'Untitled'));
      body.appendChild(el('p', 'feat-meta', albumMeta(a)));

      link.appendChild(cover);
      link.appendChild(body);
      li.appendChild(link);
      grid.appendChild(li);
    });
  }

  /* ----------------------------------------------------------
     BOOT
  ---------------------------------------------------------- */
  function init() {
    initContact();
    initNav();
    initMenu();
    initFeatured();
    initCursor();
    initReveal(document);
  }

  // Helper kit for gallery.js (loaded after this file)
  window.GP = {
    SITE: SITE, CATS: CATS, CAT_ORDER: CAT_ORDER,
    $: $, $$: $$, el: el, svg: svg, clean: clean, reduced: reduced,
    catLabel: catLabel, formatDate: formatDate, countLabel: countLabel, albumMeta: albumMeta,
    coverOf: coverOf, sortedAlbums: sortedAlbums,
    lockScroll: lockScroll, unlockScroll: unlockScroll, trapTab: trapTab, initReveal: initReveal
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
