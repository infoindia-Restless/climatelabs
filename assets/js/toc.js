(function(){
  const STEPS = [
    { rail:"The challenge", c:"var(--ink)", eyebrow:"Where we start",
      title:"Young people are on the frontline of the climate crisis, but rarely in the room.",
      lead:"In Bengaluru's fast growing neighbourhoods, water scarcity, waste and heat hit marginalised communities hardest. Young people there already hold solutions. What they lack is not capacity or creativity, but timely and trusting support. They meet barriers at every level.",
      rows:[["Individual","Little technical know how, no flexible finance, no support to engage complex systems."],
            ["Community","Complex power dynamics, fragile social cohesion, youth voices discouraged."],
            ["Systemic","Low political will, closed decision making, little grounded understanding of the problem."]] },
    { rail:"How we work", c:"var(--ink)", eyebrow:"Our approach",
      title:"We back young people in four ways: nurture, connect, fund and celebrate.",
      lead:"Through the Youth Fund, young people define local priorities and lead collective action. Inclusion is built into every step, from who decides to how money moves.",
      rows:[["Nurture","Mentoring, leadership labs and reflective learning that grow systems thinkers."],
            ["Connect","Links to community rooted mentor organisations, technical experts and decision makers."],
            ["Fund","Flexible, trust based grants with simple multilingual applications, decided by a youth led steering group."],
            ["Celebrate","Storytelling and public platforms that make young leaders visible and credible."]],
      stat:{n:15,label:"youth organisations mentored"} },
    { rail:"Individual", c:"var(--t-navy)", eyebrow:"Level one · Individual",
      title:"Young people grow from project implementers into systems thinkers.",
      rows:[["The barrier","Lack of technical knowledge, finance and confidence to navigate power."],
            ["What shifts","Skills in community engagement, negotiation and working through bureaucracy. Young leaders become role models, invited into schools, public forums and local governance spaces."],
            ["In practice","A young leader navigated political and institutional hurdles to revive a 100 year old well in DJ Halli."]],
      stat:{n:30,suffix:"+",label:"young leaders nurtured to hold decision makers accountable"} },
    { rail:"Community", c:"var(--t-teal)", eyebrow:"Level two · Community",
      title:"Communities change everyday habits and gain essential services.",
      rows:[["The barrier","Complex power dynamics and fragile cohesion. Change is not easily accepted."],
            ["What shifts","Young people bring together neighbours, women's groups, community leaders and NGOs around shared problems, building local ownership of climate action."],
            ["In practice","50+ women led households adopted biocomposting. 30 wedding halls went plastic free. Wells and water units restored safe drinking water."]],
      stat:{n:800,suffix:"+",label:"households with access to safe drinking water"} },
    { rail:"Systemic", c:"var(--t-green)", eyebrow:"Level three · Systemic",
      title:"Institutions come to the table, and public money follows youth led solutions.",
      rows:[["The barrier","Low political will, non conducive decision making structures, expectation of financial incentives."],
            ["What shifts","The city water board, municipal bodies, the local MLA's office and agricultural training institutes engage directly with youth led pilots."],
            ["In practice","Green Warriors Against Plastic influenced district level commitments on single use plastic."]],
      stat:{n:2,prefix:"INR ",suffix:"M+",label:"in public and corporate capital unlocked to scale up"} },
    { rail:"Ripple effect", c:"var(--t-green)", eyebrow:"Beyond the project",
      title:"One young leader's success becomes many.",
      lead:"Change does not stop at the edge of a project. Youth led wins inspire neighbouring communities to act, turning pilots into movements.",
      rows:[["Replication","The first well inspired local youth to revive a second well and set up a new water unit."],
            ["Movements","Green Warriors Against Plastic mobilised hundreds of students and young people across a district."],
            ["Learning","Game based climate education reached 2,500+ young people and became a go to tool in schools and public forums."]],
      stat:{n:15000,suffix:"+",label:"people reached by youth led civic and climate action"} }
  ];
  const DUR = 7500;

  const root = document.getElementById('theory-of-change');
  const rail = root.querySelector('.tocx-rail');
  const panel = root.querySelector('.tocx-panel');
  const svg = root.querySelector('svg');
  const playBtn = document.getElementById('toc-play');
  const prevBtn = document.getElementById('toc-prev');
  const nextBtn = document.getElementById('toc-next');
  const lv = [1,2,3].map(i => document.getElementById('lvl'+i));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ring stroke lengths
  lv.forEach(g => { const c = g.querySelector('.ring-on'); const L = 2*Math.PI*c.r.baseVal.value;
    c.style.strokeDasharray = L; c.style.strokeDashoffset = L; c.dataset.len = L; });

  root.style.setProperty('--dur', DUR+'ms');
  const btns = STEPS.map((s,i) => {
    const b = document.createElement('button');
    b.className = 'tocx-step'; b.type = 'button'; b.setAttribute('role','tab');
    b.style.setProperty('--c', s.c);
    b.innerHTML = '<span class="bar"></span><span class="n">0'+(i+1)+'</span><span class="l">'+s.rail+'</span>';
    b.addEventListener('click', () => { stop(); go(i); });
    rail.appendChild(b); return b;
  });

  let cur = -1, playing = false, timer = null, started = false;

  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function render(i){
    const s = STEPS[i];
    let h = '<div class="inner" style="--c:'+s.c+'">';
    h += '<p class="p-eyebrow">'+esc(s.eyebrow)+'</p><h3 class="p-title">'+esc(s.title)+'</h3>';
    if (s.lead) h += '<p class="p-lead">'+esc(s.lead)+'</p>';
    h += '<dl class="p-rows">'+s.rows.map(r=>'<div class="p-row"><dt>'+r[0]+'</dt><dd>'+esc(r[1])+'</dd></div>').join('')+'</dl>';
    if (s.stat) h += '<div class="p-stat"><span class="p-num" data-n="'+s.stat.n+'" data-p="'+(s.stat.prefix||'')+'" data-s="'+(s.stat.suffix||'')+'"></span><span class="p-num-label">'+esc(s.stat.label)+'</span></div>';
    h += '</div>';
    panel.innerHTML = h;
    const num = panel.querySelector('.p-num');
    if (num) count(num);
  }
  function count(el){
    const n = +el.dataset.n, p = el.dataset.p, sfx = el.dataset.s, fmt = v => p + v.toLocaleString('en-IN') + sfx;
    if (reduce){ el.textContent = fmt(n); return; }
    const t0 = performance.now(), d = 1400;
    (function tick(t){ const k = Math.min(1,(t-t0)/d), e = 1-Math.pow(1-k,3);
      el.textContent = fmt(Math.round(n*e)); if (k<1) requestAnimationFrame(tick); })(t0);
  }
  function diagram(i){
    document.getElementById('barriers').classList.toggle('on', i===0);
    const P = document.getElementById('pillars');
    P.classList.toggle('on', i>=1); P.classList.toggle('dim', i>=2);
    lv.forEach((g,k) => {
      const on = i >= k+2, c = g.querySelector('.ring-on');
      g.classList.toggle('on', on); g.classList.toggle('focus', i === k+2);
      c.style.strokeDashoffset = on ? 0 : c.dataset.len;
    });
    document.getElementById('core').style.fill = i>=1 ? 'var(--t-navy)' : 'var(--ink)';
    document.getElementById('ripple').classList.toggle('on', i===5);
    document.getElementById('sats').classList.toggle('on', i===5);
  }
  function go(i){
    if (i===cur) return;
    cur = i;
    btns.forEach((b,k) => { b.classList.toggle('active',k===i); b.classList.toggle('done',k<i);
      b.setAttribute('aria-selected', k===i); const bar=b.querySelector('.bar'); bar.style.animation='none'; void bar.offsetWidth; bar.style.animation=''; });
    render(i); diagram(i);
    const ab = btns[i]; rail.scrollTo({left: Math.max(0, ab.offsetLeft - rail.offsetLeft - 16), behavior: reduce ? 'auto' : 'smooth'});
    prevBtn.disabled = i===0; nextBtn.disabled = i===STEPS.length-1;
    if (playing){ clearTimeout(timer); timer = setTimeout(advance, DUR); }
    syncBtn();
  }
  function advance(){ go(cur < STEPS.length-1 ? cur+1 : 0); }
  function play(){ playing = true; root.classList.remove('paused','static');
    if (cur<0) go(0); else { clearTimeout(timer); timer = setTimeout(advance, DUR); const b=btns[cur].querySelector('.bar'); b.style.animation='none'; void b.offsetWidth; b.style.animation=''; } syncBtn(); }
  function stop(){ playing=false; clearTimeout(timer); root.classList.add('static'); syncBtn(); }
  function syncBtn(){
    const end = false;
    playBtn.innerHTML = playing
      ? '<svg viewBox="0 0 12 12"><rect x="1" y="1" width="3.5" height="10"/><rect x="7.5" y="1" width="3.5" height="10"/></svg>Pause'
      : '<svg viewBox="0 0 12 12"><path d="M2 1l9 5-9 5z"/></svg>' + (end ? 'Replay' : 'Play');
  }
  playBtn.addEventListener('click', () => playing ? stop() : play());
  prevBtn.addEventListener('click', () => { stop(); if (cur>0) go(cur-1); });
  nextBtn.addEventListener('click', () => { stop(); if (cur<STEPS.length-1) go(cur+1); });

  // start when scrolled into view
  go(0); stop();
  svg.classList.add('fig-ready');
  if (!reduce && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(es => { es.forEach(e => {
      if (e.isIntersecting && !started){ started = true; root.classList.remove('static'); cur=-1; play(); io.disconnect(); }
    }); }, {threshold:.35});
    io.observe(root);
  }
})();
