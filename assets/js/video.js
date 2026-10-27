/* Click-to-play YouTube.
   The page only shows a photo and a play button. Nothing from YouTube loads
   until a visitor clicks, then the card is swapped for the player in place.
   If embedding is not possible (for example in a preview that blocks it),
   the link simply opens the video on YouTube instead. */
(function () {
  var host = location.hostname;
  var canEmbed = location.protocol.indexOf('http') === 0 && !/claude|anthropic/.test(host);
  if (!canEmbed) return; // fall back to the normal link

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a.film[data-yt]');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('data-yt');
    var wrap = document.createElement('div');
    wrap.className = 'film-player';
    var f = document.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    f.title = a.getAttribute('data-title') || 'Video';
    f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    wrap.appendChild(f);
    a.replaceWith(wrap);
    f.focus();
  });
})();
