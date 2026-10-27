/* Rolling number counters.
   Any number inside .yfnums b, .figs b, .meta b or an element with data-count
   rolls up from zero the first time it scrolls into view.
   Years (e.g. 2022) are left as they are. The final figure is written in the
   HTML, so the page still reads correctly if this script does not run. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  var els = [].slice.call(document.querySelectorAll('.yfnums b, .figs b, .meta b, [data-count]'));
  var items = [];

  els.forEach(function (el) {
    var text = el.textContent.trim();
    var m = text.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!m) return;
    var numStr = m[2];
    if (/^(19|20)\d\d$/.test(numStr) && !m[3]) return; // a year, not a count
    var target = parseFloat(numStr.replace(/,/g, ''));
    if (!(target > 0)) return;
    var decimals = (numStr.split('.')[1] || '').length;
    items.push({ el: el, pre: m[1], suf: m[3], target: target, commas: numStr.indexOf(',') > -1 || target >= 10000, decimals: decimals, final: text });
  });

  function fmt(n, it) {
    var s = n.toFixed(it.decimals);
    if (it.commas) {
      var parts = s.split('.');
      // Indian digit grouping (2,500 / 15,000 / 1,00,000)
      var x = parts[0];
      var last3 = x.slice(-3), rest = x.slice(0, -3);
      if (rest) last3 = ',' + last3;
      parts[0] = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last3;
      s = parts.join('.');
    }
    return it.pre + s + it.suf;
  }

  function run(it) {
    var dur = 1600 + Math.min(900, Math.log10(it.target + 1) * 250);
    var start = null;
    it.el.classList.add('counting');
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = it.target * eased;
      it.el.textContent = p < 1 ? fmt(it.decimals ? v : Math.floor(v), it) : it.final;
      if (p < 1) requestAnimationFrame(step);
      else { it.el.classList.remove('counting'); it.el.classList.add('counted'); }
    }
    requestAnimationFrame(step);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var it = e.target.__count;
      if (!it || it.done) return;
      if (e.isIntersecting) { it.done = true; io.unobserve(e.target); run(it); }
    });
  }, { threshold: 0.4 });

  items.forEach(function (it) {
    it.el.__count = it;
    var r = it.el.getBoundingClientRect();
    var visible = r.top < window.innerHeight && r.bottom > 0;
    if (!visible) it.el.textContent = fmt(0, it); // reset only numbers below the fold
    io.observe(it.el);
  });
})();

/* Growing circle: each quarter fills in turn and its step comes forward; full circle reveals the outcome. */
(function () {
  var rings = [].slice.call(document.querySelectorAll('.ring'));
  if (!rings.length) return;
  rings.forEach(function (r) {
    [].forEach.call(r.querySelectorAll('.ring-step'), function (s) {
      var k = s.getAttribute('data-q');
      s.addEventListener('mouseenter', function () { r.classList.add('hov-' + k); });
      s.addEventListener('mouseleave', function () { r.classList.remove('hov-' + k); });
    });
  });
  function setCur(r, k) {
    r.__cur = k;
    [].forEach.call(r.querySelectorAll('.ring-step'), function (s) { s.classList.toggle('cur', s.getAttribute('data-q') == k); });
    [].forEach.call(r.querySelectorAll('.ring-tabs button'), function (b) { b.setAttribute('aria-selected', b.getAttribute('data-q') == k ? 'true' : 'false'); });
    for (var j = 1; j <= 4; j++) r.classList.toggle('cur-' + j, j == k);
  }
  rings.forEach(function (r) {
    r.classList.add('js'); setCur(r, 1);
    r.addEventListener('click', function (e) {
      var t = e.target.closest('.ring-tabs button, .ring-art [data-q]');
      if (!t) return;
      r.__touched = true; setCur(r, +t.getAttribute('data-q'));
    });
  });
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var r = e.target; io.unobserve(r);
      for (var i = 1; i <= 4; i++) (function (i) {
        setTimeout(function () {
          if (!r.__touched) setCur(r, i);
          [].forEach.call(r.querySelectorAll('[data-q="' + i + '"]'), function (el) { el.classList.add('on'); });
          if (i === 4) setTimeout(function () {
            r.classList.add('done');
            var t = setInterval(function () { if (r.__touched) return clearInterval(t); setCur(r, r.__cur % 4 + 1); }, 4500);
          }, 700);
        }, 250 + (i - 1) * 850);
      })(i);
    });
  }, { threshold: 0.35 });
  rings.forEach(function (r) { r.classList.add('pre'); io.observe(r); });
})();
