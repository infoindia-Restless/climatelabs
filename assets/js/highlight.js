/* Home page film highlight.
   - Shows the featured film in the hero until the date set in data-until
     on <main id="main">. After that date, the mural photo comes back and
     the ribbon disappears, with no further changes needed.
   - Clicking the film, the ribbon or the button plays the film in the hero
     (nothing loads from YouTube until someone clicks). */
(function () {
  var main = document.getElementById('main');
  var until = main && main.getAttribute('data-hl-until');
  if (until && new Date() > new Date(until + 'T23:59:59+05:30')) {
    document.documentElement.classList.add('hl-done');
    return;
  }

  var host = location.hostname;
  var canEmbed = location.protocol.indexOf('http') === 0 && !/claude|anthropic/.test(host);

  function play(e) {
    var card = document.querySelector('.hl-film');
    if (!card) return; // already playing
    if (!canEmbed) return; // let the link open YouTube
    e.preventDefault();
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
    wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    f.focus();
    if (window.gtag) window.gtag('event', 'play_highlight_film', { video_id: id });
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.hl-film, .hl-ribbon, .hl-cta')) play(e);
  });
})();
