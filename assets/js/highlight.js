/* Home page film highlight (ribbon and hero button).
   - Shows until the date in data-hl-until on <main id="main">, then hides itself.
   - Clicking the ribbon or button opens the heat film in the hero spotlight. */
(function () {
  var main = document.getElementById('main');
  var until = main && main.getAttribute('data-hl-until');
  if (until && new Date() > new Date(until + 'T23:59:59+05:30')) {
    document.documentElement.classList.add('hl-done');
    return;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.hl-ribbon:not(.hl-show), .hl-slide[data-film], .hl-cta');
    if (!a || !window.spotlight) return;
    if (window.spotlight.play('heat')) {
      e.preventDefault();
      if (window.gtag) window.gtag('event', 'play_highlight_film', { video_id: 'dDRuFxW5qRg' });
    }
  });
})();

/* Ribbon slideshow: rotates the ribbon's slides every few seconds.
   Pauses while hovered or focused; stays on the first slide for reduced motion. */
(function () {
  var box = document.querySelector('.hl-show');
  if (!box) return;
  var slides = box.querySelectorAll('.hl-slide');
  var dots = box.querySelectorAll('.hl-dots i');
  if (slides.length < 2) return;
  var i = 0, paused = false;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(n) {
    slides[i].classList.remove('is-on'); slides[i].setAttribute('aria-hidden', 'true'); slides[i].tabIndex = -1;
    if (dots[i]) dots[i].classList.remove('on');
    i = n;
    slides[i].classList.add('is-on'); slides[i].removeAttribute('aria-hidden'); slides[i].removeAttribute('tabindex');
    if (dots[i]) dots[i].classList.add('on');
  }
  box.addEventListener('mouseenter', function () { paused = true; });
  box.addEventListener('mouseleave', function () { paused = false; });
  box.addEventListener('focusin', function () { paused = true; });
  box.addEventListener('focusout', function () { paused = false; });
  if (!still) setInterval(function () { if (!paused && !document.hidden) show((i + 1) % slides.length); }, 5000);
})();
