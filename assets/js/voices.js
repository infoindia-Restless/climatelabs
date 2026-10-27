/* Change stories filter. Reads #youth-fund or #youth-leadership from the address. */
(function () {
  var bar = document.querySelector('.vfilter');
  if (!bar) return;
  var cards = [].slice.call(document.querySelectorAll('.vstories .story'));
  function apply(f) {
    [].forEach.call(bar.querySelectorAll('button'), function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-f') === f ? 'true' : 'false'); });
    cards.forEach(function (c) { c.hidden = !(f === 'all' || c.getAttribute('data-area') === f); });
  }
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var f = b.getAttribute('data-f'); apply(f);
    try { history.replaceState(null, '', f === 'all' ? location.pathname : '#' + f); } catch (err) {}
  });
  var h = (location.hash || '').slice(1);
  apply(h === 'youth-fund' || h === 'youth-leadership' ? h : 'all');
})();

/* Spotify player. The page shows a "Listen on Spotify" panel; on the live site
   it is swapped for the Spotify player. Previews that block embedded players
   (such as claude.ai) keep the panel, which links straight to the show. */
(function () {
  var host = location.hostname;
  var canEmbed = location.protocol.indexOf('http') === 0 && !/claude|anthropic/.test(host);
  if (!canEmbed) return;
  [].forEach.call(document.querySelectorAll('.pod-embed[data-spotify]'), function (box) {
    var f = document.createElement('iframe');
    f.src = 'https://open.spotify.com/embed/show/' + box.getAttribute('data-spotify') + '?utm_source=generator';
    f.title = 'Climate Katte podcast on Spotify';
    f.width = '100%'; f.height = '352'; f.loading = 'lazy';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    var link = box.querySelector('a.pod-card');
    box.innerHTML = '';
    box.appendChild(f);
    if (link) {
      var p = document.createElement('p'); p.className = 'vnote';
      p.innerHTML = 'Prefer the app? <a href="' + link.href + '" target="_blank" rel="noopener">Open Climate Ka&#7789;&#7789;e on Spotify</a>.';
      box.appendChild(p);
    }
  });
})();
