/* ============================================================
   GATEWAY PHOTOGRAPHY — GALLERY PAGE
   photography/js/gallery.js
   Album grid, category filters and the photo lightbox.
   Needs main.js (window.GP) and data.js (window.ALBUMS) first.

   URL scheme (all in the hash):
     gallery.html                    every album
     gallery.html#events             filter (events, portraits,
                                     commercial, editorial, brand-campaigns)
     gallery.html#album-id           opens that album at photo 1
     gallery.html#album-id/3         opens that album at photo 3

   History behaviour:
     - Opening the lightbox pushes ONE history entry.
     - Moving between photos uses replaceState (no extra entries).
     - Back (button, mobile gesture) closes the lightbox and returns to
       the gallery with the filter still set. Closing with Esc / X /
       backdrop does the same by calling history.back().
     - Opening a deep link directly first rewrites the entry to the plain
       gallery URL and then pushes the lightbox entry, so Back closes
       cleanly without leaving the site.
   ============================================================ */
(function () {
  'use strict';

  var GP = window.GP;
  var grid = document.getElementById('albumGrid');
  if (!GP || !grid) return;

  var $ = GP.$, $$ = GP.$$, el = GP.el, svg = GP.svg, clean = GP.clean;

  var albums = GP.sortedAlbums();
  var byId = Object.create(null);
  albums.forEach(function (a) { byId[clean(a.id)] = a; });

  /* ----------------------------------------------------------
     HASH ROUTING
  ---------------------------------------------------------- */
  var FILTER_SLUGS = Object.create(null);
  GP.CAT_ORDER.forEach(function (k) { FILTER_SLUGS[GP.CATS[k].slug] = k; });
  FILTER_SLUGS['brand'] = 'brand'; // short alias

  function route(hash) {
    var h = String(hash || '').replace(/^#/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* keep raw */ }
    if (!h) return { type: 'none' };
    if (h in FILTER_SLUGS) return { type: 'filter', key: FILTER_SLUGS[h] };
    var m = /^([^/]+)(?:\/(\d+))?$/.exec(h);
    if (m && m[1] in byId) {
      var a = byId[m[1]];
      var n = m[2] ? parseInt(m[2], 10) : 1;
      n = Math.max(1, Math.min(a.photos.length, n));
      return { type: 'album', album: a, index: n - 1 };
    }
    return { type: 'unknown' };
  }
  function plainUrl() { return location.pathname + location.search; }
  function filterUrl(key) { return key === 'all' ? plainUrl() : '#' + GP.CATS[key].slug; }
  function albumUrl(a, i) { return '#' + encodeURIComponent(clean(a.id)) + '/' + (i + 1); }

  /* ----------------------------------------------------------
     ALBUM GRID
  ---------------------------------------------------------- */
  var cards = [];
  var state = { filter: 'all', swapTimer: null };

  function buildAlbumBox(a) {
    var title = clean(a.title) || 'Untitled';
    var li = el('li', 'album-item');
    li.setAttribute('data-category', a.category);
    li.setAttribute('data-reveal', '');

    var btn = el('button', 'album-box');
    btn.type = 'button';
    btn.setAttribute('data-album', clean(a.id));
    btn.setAttribute('aria-haspopup', 'dialog');

    var cover = el('div', 'album-cover');
    var img = document.createElement('img');
    img.src = GP.coverOf(a);
    img.width = 1200;
    img.height = 900;
    img.alt = 'Cover photo for the album “' + title + '”';
    img.loading = 'lazy';
    img.decoding = 'async';
    cover.appendChild(img);
    var open = el('span', 'album-open', 'View album ');
    open.setAttribute('aria-hidden', 'true');
    open.appendChild(svg('<path d="M5 12h14M13 6l6 6-6 6"/>'));
    cover.appendChild(open);

    var body = el('div', 'album-body');
    body.appendChild(el('p', 'album-cat', GP.catLabel(a.category)));
    body.appendChild(el('h3', 'album-title', title));
    body.appendChild(el('p', 'album-meta', GP.albumMeta(a)));

    btn.appendChild(cover);
    btn.appendChild(body);
    li.appendChild(btn);
    return li;
  }

  function setFilter(key, opts) {
    opts = opts || {};
    var changed = key !== state.filter;
    state.filter = key;

    $$('.filter-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key));
    });
    if (opts.updateHash) history.replaceState(history.state, '', filterUrl(key));

    function apply() {
      var shown = 0;
      cards.forEach(function (c) {
        var match = key === 'all' || c.getAttribute('data-category') === key;
        c.hidden = !match;
        if (match) shown++;
      });
      var empty = $('#albumEmpty');
      if (empty) empty.hidden = shown !== 0;
      var status = $('#albumStatus');
      if (status && changed) { // announce only when the visitor changes the filter
        status.textContent = shown
          ? 'Showing ' + shown + (shown === 1 ? ' album' : ' albums') + (key === 'all' ? '' : ' in ' + GP.catLabel(key))
          : 'No albums in this category yet.';
      }
      grid.classList.remove('is-swapping');
      GP.initReveal(grid);
    }

    clearTimeout(state.swapTimer);
    if (!changed || GP.reduced()) { apply(); return; }
    grid.classList.add('is-swapping'); // fade out, swap, fade in
    state.swapTimer = setTimeout(apply, 180);
  }

  function initGrid() {
    albums.forEach(function (a) {
      var card = buildAlbumBox(a);
      cards.push(card);
      grid.appendChild(card);
    });

    // Tabs: hide any category no album uses; hide the whole row if there is nothing to choose between
    var used = {};
    albums.forEach(function (a) { used[a.category] = true; });
    var filters = $('#galleryFilters');
    if (filters) {
      var visibleTabs = 0;
      $$('.filter-btn', filters).forEach(function (b) {
        var k = b.getAttribute('data-filter');
        var show = k === 'all' || !!used[k];
        b.hidden = !show;
        if (show && k !== 'all') visibleTabs++;
      });
      filters.hidden = visibleTabs < 2;
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest && e.target.closest('.filter-btn');
        if (btn) setFilter(btn.getAttribute('data-filter'), { updateHash: true });
      });
    }

    grid.addEventListener('click', function (e) {
      var btn = e.target.closest && e.target.closest('.album-box');
      if (!btn) return;
      var a = byId[btn.getAttribute('data-album')];
      if (a) openAlbum(a, 0, { opener: btn });
    });
  }

  /* ----------------------------------------------------------
     LIGHTBOX
  ---------------------------------------------------------- */
  var lb = {
    root: $('#lightbox'), site: $('#site'),
    stage: $('#glStage'), imgwrap: $('#glImgWrap'), img: $('#glImg'), spinner: $('#glSpinner'),
    cap: $('#glCaption'), count: $('#glCount'), cat: $('#glCat'), title: $('#glTitle'), desc: $('#glDesc'),
    strip: $('#glStrip'), list: $('#glStripList'), live: $('#glLive'),
    prev: $('#glPrev'), next: $('#glNext'), closeBtn: $('#glClose'),
    open: false, album: null, index: 0, opener: null,
    pushed: false,      // true while the lightbox owns one history entry
    token: 0,           // guards against out-of-order image loads
    spinTimer: null, hideTimer: null,
    thumbs: [], cache: Object.create(null), loaded: Object.create(null)
  };

  /* --- image loading / preloading --- */
  function preload(url) {
    if (!url || lb.cache[url]) return lb.cache[url];
    var im = new Image();
    im.decoding = 'async';
    im.onload = function () { lb.loaded[url] = true; };
    im.src = url;
    lb.cache[url] = im; // keep a reference so the request isn't dropped
    return im;
  }
  function whenLoaded(url) {
    return new Promise(function (resolve) {
      if (lb.loaded[url]) return resolve(true);
      var im = preload(url);
      if (im.complete) { // finished before we started listening (loaded or failed)
        if (im.naturalWidth) lb.loaded[url] = true;
        return resolve(!!im.naturalWidth);
      }
      im.addEventListener('load', function () { lb.loaded[url] = true; resolve(true); });
      im.addEventListener('error', function () { resolve(false); });
    });
  }
  function setImage(url, alt, placeholder) {
    lb.img.alt = alt || '';
    lb.img.src = url;
    lb.img.classList.toggle('is-loading', !!placeholder);
  }

  /* --- header + thumbnail strip for the current album --- */
  function renderAlbum() {
    var a = lb.album;
    lb.cat.textContent = GP.catLabel(a.category);
    lb.title.textContent = clean(a.title) || 'Untitled';
    var desc = clean(a.description);
    lb.desc.textContent = desc;
    lb.desc.hidden = !desc;

    lb.list.textContent = '';
    lb.thumbs = [];
    a.photos.forEach(function (p, i) {
      var li = el('li');
      var b = el('button', 'gl-thumb');
      b.type = 'button';
      b.setAttribute('data-i', String(i));
      b.setAttribute('aria-label', 'Show photo ' + (i + 1) + ' of ' + a.photos.length);
      var im = document.createElement('img');
      im.src = clean(p.thumb) || clean(p.src);
      im.width = 72;
      im.height = 54;
      im.alt = clean(p.alt) || 'Photo ' + (i + 1);
      im.loading = 'lazy';
      im.decoding = 'async';
      b.appendChild(im);
      li.appendChild(b);
      lb.list.appendChild(li);
      lb.thumbs.push(b);
    });
  }

  function centerThumb(i) {
    var b = lb.thumbs[i], s = lb.strip;
    if (!b || !s || s.offsetParent === null) return; // strip hidden on small screens
    s.scrollTo({ left: b.offsetLeft - (s.clientWidth - b.offsetWidth) / 2, behavior: GP.reduced() ? 'auto' : 'smooth' });
  }

  function animate(dir) {
    if (GP.reduced() || !dir) return;
    var w = lb.imgwrap;
    w.classList.remove('is-anim-next', 'is-anim-prev');
    void w.offsetWidth; // restart the animation
    w.classList.add(dir > 0 ? 'is-anim-next' : 'is-anim-prev');
  }

  /* --- show photo i of the current album --- */
  function show(i, opts) {
    opts = opts || {};
    var photos = lb.album.photos, n = photos.length;
    i = ((i % n) + n) % n; // previous/next wrap around
    var p = photos[i];
    var full = clean(p.src), thumb = clean(p.thumb);
    var token = ++lb.token;
    lb.index = i;

    lb.count.textContent = (i + 1) + ' / ' + n;
    lb.cap.textContent = clean(p.caption);
    lb.thumbs.forEach(function (b, k) {
      if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
    });
    centerThumb(i);
    lb.live.textContent = 'Photo ' + (i + 1) + ' of ' + n + (clean(p.alt) ? ': ' + clean(p.alt) : '');
    if (!opts.initial) animate(opts.dir);

    // The image area keeps a fixed size, so nothing jumps while a photo loads.
    clearTimeout(lb.spinTimer);
    lb.spinner.hidden = true;
    if (lb.loaded[full]) {
      lb.imgwrap.removeAttribute('aria-busy');
      setImage(full, p.alt, false);
    } else {
      lb.imgwrap.setAttribute('aria-busy', 'true');
      setImage(thumb || full, p.alt, !!thumb); // instant soft preview, then the sharp one
      lb.spinTimer = setTimeout(function () { if (token === lb.token) lb.spinner.hidden = false; }, 200);
      whenLoaded(full).then(function (ok) {
        if (token !== lb.token) return; // user already moved on
        clearTimeout(lb.spinTimer);
        lb.spinner.hidden = true;
        lb.imgwrap.removeAttribute('aria-busy');
        if (ok) setImage(full, p.alt, false);
        else lb.img.classList.remove('is-loading');
      });
    }

    // Preload the neighbours
    preload(clean(photos[(i + 1) % n].src));
    preload(clean(photos[(i - 1 + n) % n].src));

    // Keep the URL in step (replace, never push, so Back closes in one press)
    if (lb.pushed && !opts.noUrl) history.replaceState(history.state, '', albumUrl(lb.album, i));
  }
  function step(d) { if (lb.open) show(lb.index + d, { dir: d }); }

  /* --- open / close --- */
  function openAlbum(album, index, opts) {
    opts = opts || {};
    if (!lb.root || !album) return;
    clearTimeout(lb.hideTimer);

    if (lb.open) { // already open: switch photo (and album, if it changed)
      if (lb.album !== album) { lb.album = album; renderAlbum(); }
      show(index, { dir: index > lb.index ? 1 : -1, noUrl: !!opts.fromHistory });
      return;
    }

    lb.album = album;
    lb.opener = opts.opener || null;
    renderAlbum();
    lb.open = true;

    // One history entry for the whole lightbox session
    if (opts.fromHistory) {
      lb.pushed = true; // the entry already exists (Forward / edited URL)
    } else {
      history.pushState({ gp: 'lightbox' }, '', albumUrl(album, index));
      lb.pushed = true;
    }

    lb.root.hidden = false;
    if (lb.site) lb.site.inert = true;
    document.documentElement.classList.add('gl-open');
    GP.lockScroll();
    show(index, { initial: true, noUrl: true });
    void lb.root.offsetWidth; // flush styles so the fade-in transition runs (rAF pauses in background tabs)
    lb.root.classList.add('is-open');
    lb.closeBtn.focus();
  }

  function closeLightbox(fromPop) {
    if (!lb.open) return;
    lb.open = false;
    lb.token++; // cancel pending image work
    clearTimeout(lb.spinTimer);
    lb.root.classList.remove('is-open');
    lb.imgwrap.style.transform = '';
    if (lb.site) lb.site.inert = false;
    document.documentElement.classList.remove('gl-open');
    GP.unlockScroll();

    // Back to the album box that opened it (or the page, for a deep link)
    var opener = lb.opener;
    lb.opener = null;
    var target = opener && document.contains(opener) && !opener.closest('[hidden]') ? opener : document.getElementById('main');
    if (target) target.focus();

    lb.hideTimer = setTimeout(function () {
      if (!lb.open) { lb.root.hidden = true; lb.img.removeAttribute('src'); }
    }, GP.reduced() ? 0 : 200);

    // Closing from the UI walks history back to the gallery entry; Back has already done it.
    if (!fromPop && lb.pushed) { lb.pushed = false; history.back(); }
    else lb.pushed = false;
  }

  /* --- events --- */
  function initLightbox() {
    if (!lb.root) return;

    lb.prev.addEventListener('click', function () { step(-1); });
    lb.next.addEventListener('click', function () { step(1); });
    lb.list.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.gl-thumb');
      if (!b) return;
      var i = parseInt(b.getAttribute('data-i'), 10);
      if (i !== lb.index) show(i, { dir: i > lb.index ? 1 : -1 });
    });

    // Backdrop: close button, or any click on empty dark space (including
    // the empty margins around a portrait photo, but never on the photo itself)
    var suppressClick = false;
    lb.root.addEventListener('click', function (e) {
      if (suppressClick) { suppressClick = false; return; }
      var t = e.target;
      if (t.closest('[data-gl-close]')) { closeLightbox(false); return; }
      if (t.closest('button,a,.gl-caption,.gl-heading,.gl-count,.gl-strip')) return;
      if (t === lb.img && insidePhoto(e)) return;
      closeLightbox(false);
    });
    function insidePhoto(e) {
      var r = lb.img.getBoundingClientRect(), nw = lb.img.naturalWidth, nh = lb.img.naturalHeight;
      if (!nw || !nh) return true;
      var s = Math.min(r.width / nw, r.height / nh), w = nw * s, h = nh * s;
      var l = r.left + (r.width - w) / 2, tp = r.top + (r.height - h) / 2;
      return e.clientX >= l && e.clientX <= l + w && e.clientY >= tp && e.clientY <= tp + h;
    }

    // Keyboard
    document.addEventListener('keydown', function (e) {
      if (!lb.open) return;
      if (e.key === 'Escape') { e.preventDefault(); closeLightbox(false); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
      else if (e.key === 'Home') { e.preventDefault(); show(0, { dir: -1 }); }
      else if (e.key === 'End') { e.preventDefault(); show(lb.album.photos.length - 1, { dir: 1 }); }
      else GP.trapTab(e, lb.root);
    });

    // Swipe: pointer events; touch-action:pan-y keeps vertical scrolling native
    var drag = null;
    lb.stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('button')) return;
      suppressClick = false;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, dx: 0, t: Date.now(), axis: null };
    });
    lb.stage.addEventListener('pointermove', function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // not a gesture yet
        drag.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
        if (drag.axis === 'x') { try { lb.stage.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ } }
      }
      if (drag.axis !== 'x') return;
      drag.dx = dx;
      if (!GP.reduced()) { // the photo follows the finger
        lb.imgwrap.classList.remove('is-snap', 'is-anim-next', 'is-anim-prev');
        lb.imgwrap.style.transform = 'translateX(' + dx + 'px)';
      }
    });
    function endDrag(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag;
      drag = null;
      try { lb.stage.releasePointerCapture(e.pointerId); } catch (err) { /* nothing to release */ }
      if (d.axis !== 'x') return;
      suppressClick = true; // the gesture must not count as a backdrop click...
      setTimeout(function () { suppressClick = false; }, 80); // ...but only the click that immediately follows it
      var width = lb.stage.clientWidth || window.innerWidth;
      var threshold = Math.min(120, Math.max(50, width * 0.15)); // 15% of the stage, between 50 and 120 px
      var speed = Math.abs(d.dx) / Math.max(1, Date.now() - d.t);
      var commit = e.type !== 'pointercancel' && (Math.abs(d.dx) >= threshold || (Math.abs(d.dx) >= 30 && speed > 0.5));
      if (commit) {
        lb.imgwrap.style.transform = '';
        step(d.dx < 0 ? 1 : -1);
      } else if (!GP.reduced()) {
        lb.imgwrap.classList.add('is-snap');
        lb.imgwrap.style.transform = '';
      } else {
        lb.imgwrap.style.transform = '';
      }
    }
    lb.stage.addEventListener('pointerup', endDrag);
    lb.stage.addEventListener('pointercancel', endDrag);
  }

  /* ----------------------------------------------------------
     BROWSER HISTORY (Back / Forward / edited URL)
  ---------------------------------------------------------- */
  window.addEventListener('popstate', function () {
    var r = route(location.hash);
    if (r.type === 'album') {
      openAlbum(r.album, r.index, { fromHistory: true, opener: lb.opener });
      return;
    }
    if (lb.open) closeLightbox(true); // Back landed on the gallery entry
    if (r.type === 'filter') setFilter(r.key);
    else if (r.type === 'none') setFilter('all');
  });

  /* ----------------------------------------------------------
     BOOT
  ---------------------------------------------------------- */
  initGrid();
  initLightbox();

  var first = route(location.hash);
  if (first.type === 'album') {
    // Deep link. Make the current entry the plain gallery, then push the
    // lightbox on top of it, so Back closes the lightbox and stays here.
    history.replaceState({ gp: 'gallery' }, '', plainUrl());
    setFilter('all');
    openAlbum(first.album, first.index, {});
  } else if (first.type === 'filter') {
    setFilter(first.key);
  } else {
    setFilter('all');
  }
})();
