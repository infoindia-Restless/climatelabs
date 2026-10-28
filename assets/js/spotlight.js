/* Home hero spotlight: rotates three featured pieces.
   - Moves on every 7 seconds until a visitor interacts, hovers or focuses it.
   - Films play in place when clicked (nothing loads from YouTube before that).
   - Other scripts can call window.spotlight.play('heat') to open and play a film. */
(function () {
  var root = document.querySelector('.hspot');
  if (!root) return;
  var tabs = [].slice.call(root.querySelectorAll('.spot-tab'));
  var slides = [].slice.call(root.querySelectorAll('.slide'));
  var MS = 7000, i = 0, timer = null, stopped = false, hold = false;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canEmbed = location.protocol.indexOf('http') === 0 && !/claude|anthropic/.test(location.hostname);
  root.style.setProperty('--spot-ms', MS + 'ms');

  function show(n, focusTab) {
    i = (n + slides.length) % slides.length;
    tabs.forEach(function (t, k) {
      var on = k === i;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      slides[k].classList.toggle('on', on);
      slides[k].hidden = !on;
    });
    if (focusTab) tabs[i].focus();
    restartBar();
  }
  function restartBar() {
    var b = tabs[i].querySelector('.bar');
    if (!b) return;
    b.style.animation = 'none'; void b.offsetWidth; b.style.animation = '';
  }
  function tick() { if (!hold && !stopped) show(i + 1); }
  function start() {
    if (reduce || stopped) return;
    clearInterval(timer); timer = setInterval(tick, MS);
    root.classList.add('playing'); restartBar();
  }
  function pause() { hold = true; root.classList.remove('playing'); }
  function resume() { if (stopped) return; hold = false; start(); }
  function stop() { stopped = true; clearInterval(timer); root.classList.remove('playing'); }

  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { stop(); show(k); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); stop(); show(i + 1, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); stop(); show(i - 1, true); }
    });
  });
  var prev = root.querySelector('[data-spot="prev"]'), next = root.querySelector('[data-spot="next"]');
  if (prev) prev.addEventListener('click', function () { stop(); show(i - 1); });
  if (next) next.addEventListener('click', function () { stop(); show(i + 1); });
  root.addEventListener('mouseenter', pause);
  root.addEventListener('mouseleave', resume);
  root.addEventListener('focusin', pause);
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) resume(); });

  function playIn(card) {
    var id = card.getAttribute('data-yt');
    var wrap = document.createElement('div');
    wrap.className = 'film-player';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    f.title = card.getAttribute('data-title') || 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    wrap.appendChild(f);
    card.replaceWith(wrap);
    f.focus();
    if (window.gtag) window.gtag('event', 'play_spotlight_film', { video_id: id });
  }
  root.addEventListener('click', function (e) {
    var card = e.target.closest && e.target.closest('.slide-card');
    if (!card) return;
    stop();
    if (card.hasAttribute('data-yt')) {
      if (!canEmbed) return; // open YouTube instead
      e.preventDefault(); playIn(card);
    } else if (window.gtag) {
      window.gtag('event', 'open_spotlight_story', { link: card.getAttribute('href') });
    }
  });

  window.spotlight = {
    play: function (key) {
      var k = slides.findIndex(function (s) { return s.getAttribute('data-key') === key; });
      if (k < 0) return false;
      stop(); show(k);
      var card = slides[k].querySelector('.slide-card[data-yt]');
      root.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (card && canEmbed) { playIn(card); return true; }
      return !!slides[k].querySelector('.film-player');
    }
  };

  show(0);
  start();
})();
