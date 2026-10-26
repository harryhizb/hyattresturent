(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.getElementById('header');
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');

  document.getElementById('year').textContent = new Date().getFullYear();

  /* Sticky header: transparent over hero, solid after scrolling */
  function onScroll(){ header.classList.toggle('is-solid', window.scrollY > 40 || document.body.classList.contains('nav-open')); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* Mobile menu */
  function setMenu(open){
    document.body.classList.toggle('nav-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    onScroll();
  }
  toggle.addEventListener('click', function(){ setMenu(!document.body.classList.contains('nav-open')); });
  links.addEventListener('click', function(e){ if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && document.body.classList.contains('nav-open')) { setMenu(false); toggle.focus(); } });
  window.matchMedia('(min-width: 52.01rem)').addEventListener('change', function(){ setMenu(false); });

  /* Reveal on scroll */
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else { items.forEach(function(el){ el.classList.add('is-in'); }); }

  /* Gentle parallax inside rooftop frames */
  var par = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (par.length && !reduce) {
    var ticking = false;
    var update = function(){
      var vh = window.innerHeight;
      par.forEach(function(img){
        var r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var p = (r.top + r.height/2 - vh/2) / vh;           // -0.5 … 0.5
        img.style.transform = 'translate3d(0,' + (p * -6).toFixed(2) + '%,0)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive:true});
    window.addEventListener('resize', update); update();
  }

  /* Gallery filter */
  var grid = document.getElementById('masonry');
  var cells = Array.prototype.slice.call(grid.children);
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function(b){ b.setAttribute('aria-pressed', String(b === btn)); });
      grid.classList.add('is-switching');
      setTimeout(function(){
        cells.forEach(function(li){ li.hidden = !(f === 'all' || li.getAttribute('data-cat') === f); });
        grid.classList.remove('is-switching');
      }, reduce ? 0 : 230);
    });
  });

  /* Lightbox */
  var dlg = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbCap = document.getElementById('lb-cap');
  var lbCount = document.getElementById('lb-count');
  var set = [], idx = 0;
  function visibleShots(){ return cells.filter(function(li){ return !li.hidden; }).map(function(li){ return li.querySelector('.shot'); }); }
  function show(i){
    idx = (i + set.length) % set.length;
    var b = set[idx], im = b.querySelector('img');
    lbImg.style.opacity = 0;
    lbImg.width = +b.dataset.w; lbImg.height = +b.dataset.h;
    lbImg.onload = function(){ lbImg.style.opacity = 1; };
    lbImg.src = b.dataset.full; lbImg.alt = im.alt; lbCap.textContent = im.alt;
    lbCount.textContent = (idx + 1) + ' / ' + set.length;
    if (lbImg.complete) lbImg.style.opacity = 1;
  }
  grid.addEventListener('click', function(e){
    var b = e.target.closest('.shot'); if (!b) return;
    set = visibleShots(); show(set.indexOf(b));
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open','');
    document.body.style.overflow = 'hidden';
  });
  function closeLb(){ if (dlg.open) dlg.close(); }
  dlg.addEventListener('close', function(){ document.body.style.overflow = ''; });
  dlg.querySelector('.lb-close').addEventListener('click', closeLb);
  dlg.querySelector('.lb-prev').addEventListener('click', function(){ show(idx - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function(){ show(idx + 1); });
  dlg.addEventListener('click', function(e){ if (e.target === dlg || e.target.classList.contains('lb')) closeLb(); });
  dlg.addEventListener('keydown', function(e){
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
  });
  var sx = null;
  var fig = dlg.querySelector('figure');
  fig.addEventListener('pointerdown', function(e){ sx = e.clientX; });
  fig.addEventListener('pointerup', function(e){
    if (sx === null) return; var dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
  });
  fig.addEventListener('pointercancel', function(){ sx = null; });
})();
