/* Google Analytics 4 for climatelabs.info
   Counts visits only on the live domain, so previews and local testing are not tracked.
   Also records: report downloads, film plays and podcast (Spotify) clicks. */
(function () {
  var ID = 'G-RR4TMVMFYM';
  if (!/(^|\.)climatelabs\.info$/i.test(location.hostname)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ID);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/\.pdf($|[?#])/i.test(href)) {
      gtag('event', 'report_download', { report_name: href.split('/').pop(), page_path: location.pathname });
    } else if (a.classList.contains('film')) {
      gtag('event', 'film_play', { film_title: a.getAttribute('data-title') || '', video_id: a.getAttribute('data-yt') || '', page_path: location.pathname });
    } else if (/spotify\.com/i.test(href)) {
      gtag('event', 'podcast_click', { link_url: a.href, page_path: location.pathname });
    }
  }, true);
})();
