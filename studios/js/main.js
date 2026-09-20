/* ============================================================
   GATEWAY STUDIOS — BEHAVIOUR
   studios/js/main.js
   Reads window.SITE and window.WORKS (studios/js/data.js).
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  'use strict';

  var SITE = window.SITE || {};
  var WORKS = Array.isArray(window.WORKS) ? window.WORKS : [];

  var reduceMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var coarseMq = window.matchMedia('(pointer: coarse)');
  function reduced() { return reduceMq.matches; }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clean(v) { return typeof v === 'string' ? v.trim() : ''; }

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
     CATEGORIES
  ---------------------------------------------------------- */
  var CATS = {
    documentary: { label: 'Documentary', plural: 'documentaries', slug: 'documentaries' },
    film:        { label: 'Film',        plural: 'films',         slug: 'films' },
    brand:       { label: 'Brand Film',  plural: 'brand films',   slug: 'brand-films' }
  };
  function catLabel(key) { return CATS[key] ? CATS[key].label : ''; }

  /* ----------------------------------------------------------
     VIDEO URL → EMBED URL (YouTube / Vimeo only)
     YouTube uses the privacy-enhanced youtube-nocookie.com host.
     Returns { provider, url } or null when the link is empty/unsupported.
  ---------------------------------------------------------- */
  function parseStart(t) {
    if (!t) return 0;
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    var m = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/.exec(t);
    if (!m) return 0;
    return (parseInt(m[1] || 0, 10) * 3600) + (parseInt(m[2] || 0, 10) * 60) + parseInt(m[3] || 0, 10);
  }

  function toEmbedUrl(raw, autoplay) {
    raw = clean(raw);
    if (!raw) return null;
    var u;
    try { u = new URL(raw); } catch (e) { return null; }
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;

    var host = u.hostname.toLowerCase().replace(/^(www|m)\./, '');
    var parts = u.pathname.split('/').filter(Boolean);
    var q = [];

    // YouTube
    var ytId = null;
    if (host === 'youtu.be') {
      ytId = parts[0] || null;
    } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      if (parts[0] === 'watch') ytId = u.searchParams.get('v');
      else if (/^(embed|shorts|live|v)$/.test(parts[0] || '')) ytId = parts[1] || null;
    }
    if (ytId && /^[A-Za-z0-9_-]{11}$/.test(ytId)) {
      if (autoplay) q.push('autoplay=1');
      q.push('rel=0', 'modestbranding=1', 'playsinline=1');
      var start = parseStart(u.searchParams.get('t') || u.searchParams.get('start'));
      if (start) q.push('start=' + start);
      return { provider: 'youtube', url: 'https://www.youtube-nocookie.com/embed/' + ytId + '?' + q.join('&') };
    }

    // Vimeo: vimeo.com/ID, vimeo.com/ID/HASH, vimeo.com/channels/x/ID, player.vimeo.com/video/ID?h=HASH
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      var vid = null, hash = u.searchParams.get('h');
      for (var i = 0; i < parts.length; i++) {
        if (/^\d+$/.test(parts[i])) {
          vid = parts[i];
          if (!hash && parts[i + 1] && /^[a-f0-9]{8,}$/i.test(parts[i + 1])) hash = parts[i + 1];
          break;
        }
      }
      if (vid) {
        if (autoplay) q.push('autoplay=1');
        q.push('dnt=1', 'title=0', 'byline=0', 'portrait=0');
        if (hash && /^[A-Za-z0-9]+$/.test(hash)) q.push('h=' + hash);
        return { provider: 'vimeo', url: 'https://player.vimeo.com/video/' + vid + '?' + q.join('&') };
      }
    }
    return null;
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
    var subject = 'Project enquiry';

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
      document.body.classList.toggle('hovered', !!(e.target.closest && e.target.closest('a,button,.is-playable')));
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
     VIDEO LIGHTBOX
     The iframe exists only while the dialog is open.
  ---------------------------------------------------------- */
  var lb = {};
  function initLightbox() {
    lb.root = $('#lightbox');
    lb.player = $('#lbPlayer');
    lb.title = $('#lbTitle');
    lb.cat = $('#lbCat');
    lb.close = $('#lbClose');
    lb.site = $('#site');
    lb.opener = null;
    lb.open = false;
    lb.timer = null;
    if (!lb.root) return;

    lb.root.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('[data-lb-close]')) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lb.open) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
      else trapTab(e, lb.root);
    });
  }

  function openLightbox(item, opener) {
    if (!lb.root || lb.open) return;
    var embed = toEmbedUrl(item.videoUrl, !reduced()); // reduced motion → no autoplay
    if (!embed) return;

    lb.opener = opener || document.activeElement;
    lb.open = true;
    clearTimeout(lb.timer);

    lb.title.textContent = item.title || '';
    lb.cat.textContent = [item.category, item.year].filter(Boolean).join(' · ');

    var frame = document.createElement('iframe');
    frame.title = item.title ? 'Video: ' + item.title : 'Video player';
    frame.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    frame.setAttribute('allowfullscreen', '');
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.src = embed.url;
    lb.player.textContent = '';
    lb.player.appendChild(frame);

    lb.root.hidden = false;
    if (lb.site) lb.site.inert = true;
    lockScroll();
    // next frame so the fade-in transition runs
    requestAnimationFrame(function () { lb.root.classList.add('is-open'); });
    lb.close.focus();
  }

  function closeLightbox() {
    if (!lb.open) return;
    lb.open = false;
    lb.root.classList.remove('is-open');
    lb.player.textContent = ''; // removes the iframe → playback stops
    if (lb.site) lb.site.inert = false;
    unlockScroll();
    var opener = lb.opener;
    lb.opener = null;
    if (opener && document.contains(opener) && opener.offsetParent !== null) opener.focus();
    lb.timer = setTimeout(function () { if (!lb.open) lb.root.hidden = true; }, reduced() ? 0 : 200);
  }

  /* ----------------------------------------------------------
     SHOWREEL BUTTON (hero) — only shown when a valid URL is set
  ---------------------------------------------------------- */
  function initShowreel() {
    var btn = $('#showreelBtn');
    if (!btn) return;
    var reel = SITE.showreel || {};
    if (!toEmbedUrl(reel.videoUrl, false)) { btn.hidden = true; return; }
    btn.hidden = false;
    btn.addEventListener('click', function () {
      openLightbox({ title: clean(reel.title) || 'Showreel', category: 'Showreel', year: '', videoUrl: reel.videoUrl }, btn);
    });
  }

  /* ----------------------------------------------------------
     WORK GRID + FILTERS
  ---------------------------------------------------------- */
  var work = { grid: null, cards: [], filter: 'all', swapTimer: null };

  function sortedWorks() {
    return WORKS.map(function (w, i) { return { w: w, i: i }; })
      .sort(function (a, b) { return (b.w.featured ? 1 : 0) - (a.w.featured ? 1 : 0) || a.i - b.i; })
      .map(function (x) { return x.w; });
  }

  function buildCard(w) {
    var title = clean(w.title) || 'Untitled';
    var playable = !!toEmbedUrl(w.videoUrl, false);
    var catKey = CATS[w.category] ? w.category : 'film';

    var li = el('li', 'work-card' + (playable ? ' is-playable' : ''));
    li.setAttribute('data-category', catKey);
    li.setAttribute('data-reveal', '');
    if (playable) li.setAttribute('data-id', clean(w.id));

    var inner = el('article', 'work-card-inner');
    var thumb = playable ? el('button', 'work-thumb') : el('div', 'work-thumb is-soon');
    if (playable) {
      thumb.type = 'button';
      thumb.setAttribute('aria-haspopup', 'dialog');
      thumb.setAttribute('aria-label', 'Play ' + title);
    }

    var img = document.createElement('img');
    img.src = clean(w.thumbnail);
    img.width = 960;
    img.height = 540;
    img.alt = clean(w.thumbnailAlt) || ('Thumbnail for ' + title);
    img.loading = 'lazy';
    img.decoding = 'async';
    thumb.appendChild(img);

    if (w.featured) thumb.appendChild(el('span', 'work-feat', 'Featured'));
    if (playable) {
      var play = el('span', 'work-play');
      play.setAttribute('aria-hidden', 'true');
      var disc = el('span');
      disc.appendChild(svg('<path d="M6 4l14 8-14 8z"/>'));
      play.appendChild(disc);
      thumb.appendChild(play);
    } else {
      thumb.appendChild(el('span', 'work-soon', 'Coming soon'));
    }

    var body = el('div', 'work-body');
    body.appendChild(el('p', 'work-cat', catLabel(catKey)));
    body.appendChild(el('h3', 'work-title', title));
    var info = [clean(w.year), clean(w.runtime)].filter(Boolean).join(' · ');
    if (info) body.appendChild(el('p', 'work-info', info));
    if (clean(w.logline)) body.appendChild(el('p', 'work-logline', clean(w.logline)));

    inner.appendChild(thumb);
    inner.appendChild(body);
    li.appendChild(inner);
    return li;
  }

  function slugFor(key) { return key === 'all' ? '#work' : '#work/' + CATS[key].slug; }
  function filterFromHash(hash) {
    if (hash === '#work') return 'all';
    var m = /^#work\/([a-z-]+)$/.exec(hash || '');
    if (!m) return null;
    for (var k in CATS) if (CATS[k].slug === m[1]) return k;
    return 'all'; // unknown slug → show everything
  }

  function setFilter(key, opts) {
    opts = opts || {};
    if (!work.grid) return;
    var changed = key !== work.filter;
    work.filter = key;

    $$('.filter-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key));
    });
    if (opts.updateHash) history.replaceState(null, '', slugFor(key));

    function apply() {
      var shown = 0;
      work.cards.forEach(function (c) {
        var match = key === 'all' || c.getAttribute('data-category') === key;
        c.hidden = !match;
        if (match) shown++;
      });
      var empty = $('#workEmpty');
      if (empty) empty.hidden = shown !== 0;
      var status = $('#workStatus');
      if (status && changed) { // announce only when the visitor changes the filter
        status.textContent = shown
          ? 'Showing ' + shown + ' ' + (key === 'all' ? (shown === 1 ? 'project' : 'projects') : CATS[key].plural)
          : 'No projects in this category yet.';
      }
      work.grid.classList.remove('is-swapping');
      initReveal(work.grid);
    }

    clearTimeout(work.swapTimer);
    if (!changed || reduced()) { apply(); return; }
    work.grid.classList.add('is-swapping'); // fade out, swap, fade in
    work.swapTimer = setTimeout(apply, 180);
  }

  function initWork() {
    work.grid = $('#workGrid');
    var filters = $('#workFilters');
    if (!work.grid) return;

    sortedWorks().forEach(function (w) {
      var card = buildCard(w);
      work.cards.push(card);
      work.grid.appendChild(card);
    });

    if (filters) {
      filters.hidden = !work.cards.length;
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.filter-btn');
        if (btn) setFilter(btn.getAttribute('data-filter'), { updateHash: true });
      });
    }

    // Card click → lightbox (whole card, keyboard via the thumbnail button)
    var byId = {};
    WORKS.forEach(function (w) { byId[clean(w.id)] = w; });
    work.grid.addEventListener('click', function (e) {
      var card = e.target.closest && e.target.closest('.work-card.is-playable');
      if (!card) return;
      var w = byId[card.getAttribute('data-id')];
      if (!w) return;
      openLightbox({
        title: clean(w.title),
        category: catLabel(w.category),
        year: clean(w.year),
        videoUrl: w.videoUrl
      }, card.querySelector('.work-thumb'));
    });

    // Initial filter from the URL hash (shareable links: #work/documentaries)
    var fromHash = filterFromHash(location.hash);
    setFilter(fromHash || 'all', { updateHash: false });
    if (fromHash && fromHash !== 'all' || /^#work\//.test(location.hash)) {
      var section = document.getElementById('work');
      if (section) section.scrollIntoView({ behavior: 'auto', block: 'start' });
    }

    window.addEventListener('hashchange', function () {
      var f = filterFromHash(location.hash);
      if (f) setFilter(f, { updateHash: false });
    });
  }

  /* ----------------------------------------------------------
     BOOT
  ---------------------------------------------------------- */
  function init() {
    initContact();
    initNav();
    initMenu();
    initLightbox();
    initShowreel();
    initWork();
    initCursor();
    initReveal(document);
  }

  // Small public surface, handy for testing in the browser console
  window.GatewayStudios = { toEmbedUrl: toEmbedUrl };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
