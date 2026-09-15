/* ============================================================
   ONRE — Allocation Checker · интерактив
   AUM-тик, reveal, бегущая строка бэкеров, бургер-меню, тень шапки.
   ============================================================ */
(function () {
  'use strict';

  var C = window.ONRE;
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- ссылки навигации из конфига ---------- */
  (function () {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      var key = a.getAttribute('data-nav');
      var url = C.links && C.links[key];
      if (url && url !== '#') a.href = url;
    });
  })();

  /* ---------- AUM в шапке: мягкий «живой» дрейф ---------- */
  (function () {
    var el = $('aumVal');
    if (!el || !C.aum) return;
    var v = C.aum.start;
    var render = function () {
      el.textContent = '$' + v.toFixed(2) + 'M';
    };
    render();
    if (!C.aum.drift) return;
    setInterval(function () {
      v += (Math.random() - 0.5) * 2 * C.aum.drift;
      v = Math.max(C.aum.start - C.aum.drift * 4, v);
      render();
    }, C.aum.interval || 4000);
  })();

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- бегущая строка бэкеров (два одинаковых списка = бесшовный цикл) ---------- */
  (function () {
    var track = $('marqueeTrack');
    if (!track) return;
    var items = C.backers.map(function (b) {
      var mk = '';
      if (b.mark === 'dot') mk = '<span class="mk mk--dot" aria-hidden="true"></span>';
      if (b.mark === 'x') mk = '<span class="mk mk--x" aria-hidden="true">✕</span>';
      return '<span class="logo">' + mk + b.name + '</span>';
    }).join('');
    var list = function (hid) {
      return '<div class="marquee__list"' + (hid ? ' aria-hidden="true"' : '') + '>' + items + '</div>';
    };
    track.innerHTML = list(false) + list(true);
  })();

  /* ---------- бургер-меню ---------- */
  var burger = $('burger');
  var mnav = $('mnav');
  function closeMenu() {
    if (!mnav || !burger || mnav.hidden) return;
    mnav.hidden = true;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var willOpen = mnav.hidden;
      mnav.hidden = !willOpen;
      burger.classList.toggle('open', willOpen);
      burger.setAttribute('aria-expanded', String(willOpen));
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeMenu();
    });
  }

  /* ---------- тень на шапке при скролле ---------- */
  var nav = $('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });

})();
