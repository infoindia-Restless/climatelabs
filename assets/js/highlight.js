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
    var a = e.target.closest && e.target.closest('.hl-ribbon, .hl-cta');
    if (!a || !window.spotlight) return;
    if (window.spotlight.play('heat')) {
      e.preventDefault();
      if (window.gtag) window.gtag('event', 'play_highlight_film', { video_id: 'dDRuFxW5qRg' });
    }
  });
})();
