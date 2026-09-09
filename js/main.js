/* ============================================================
   ZCAT — интерактив лендинга
   Всё на ванильном JS, без зависимостей.
   Цифры/ссылки/тиры — в js/config.js
   ============================================================ */
(function () {
  'use strict';

  var C = window.ZCAT_CONFIG || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = false, fine = false;
  try { reduced = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  try { fine = matchMedia('(pointer: fine)').matches; } catch (e) {}

  function safe(fn) { try { fn(); } catch (e) { if (window.console) console.error('zcat:', e); } }

  /* ---------- утилиты ---------- */
  function fmt(n, dec) {
    if (!isFinite(n)) return '–';
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  function money(n) {
    if (!isFinite(n)) return '–';
    var a = Math.abs(n);
    if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'K';
    return '$' + n.toFixed(2);
  }
  function moneyShort(n) {
    if (!isFinite(n)) return '–';
    var a = Math.abs(n);
    if (a >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e8) return '$' + Math.round(n / 1e6) + 'M';
    if (a >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
    if (a >= 1e3) return '$' + Math.round(n / 1e3) + 'K';
    return '$' + Math.round(n);
  }
  function priceStr(n) {
    if (!isFinite(n)) return '–';
    return '$' + (n < 1 ? n.toFixed(5).replace(/0+$/, '') : n.toFixed(2));
  }
  function shortAddr(a) { return a.length > 12 ? a.slice(0, 5) + '…' + a.slice(-4) : a; }
  function hash32(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h >>> 0;
  }
  function rnd(seed, i) { // детерминированный 0..1 из хэша
    return ((hash32(seed + ':' + i) % 100000) / 100000);
  }

  /* ============================================================
     1. Прогресс-бар + липкая шапка
     ============================================================ */
  var progress = $('#progress'), nav = $('#nav');
  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    if (progress) progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('is-stuck', h.scrollTop > 8);
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ============================================================
     2. Reveal по скроллу
     ============================================================ */
  safe(function () {
    var items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(function (i) { i.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (!en.isIntersecting) return;
        var el = en.target;
        setTimeout(function () { el.classList.add('in'); }, Math.min(i, 6) * 70);
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  });

  /* ============================================================
     3. Счётчики (odometer)
     ============================================================ */
  function runOdom(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    el._gen = (el._gen || 0) + 1;
    var gen = el._gen;
    var to = parseFloat(el.dataset.to || '0');
    var dec = parseInt(el.dataset.dec || '0', 10);
    var sep = el.dataset.sep === '1';
    if (reduced) { el.textContent = sep ? fmt(to, 0) : to.toFixed(dec); return; }
    var dur = 1500, t0 = performance.now();
    function tick(now) {
      if (el._gen !== gen) return; // значение обновили извне — старая анимация больше не нужна
      var p = Math.min(1, (now - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var v = to * e;
      el.textContent = sep ? fmt(v, 0) : v.toFixed(dec);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  safe(function () {
    var ods = $$('.od');
    if (!('IntersectionObserver' in window)) { ods.forEach(runOdom); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { if (en.isIntersecting) { runOdom(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    ods.forEach(function (el) { io.observe(el); });
  });

  /* ============================================================
     4. Картинки: летающие монеты, иконки шагов, логотип
     ============================================================ */
  safe(function () {
    var IMG = C.images || {};

    if (IMG.logo) $$('[data-img="logo"]').forEach(function (el) { el.src = IMG.logo; });

    if (reduced) return;
    var wrap = $('#coins');
    if (!wrap) return;

    var candF = [].concat(IMG.float || 'img/zec.png').filter(Boolean);
    var kf = 0;
    function spawnFloat(url) {
      var failed = false;
      for (var i = 0; i < 12; i++) {
        var im = document.createElement('img');
        im.className = 'float'; im.src = url; im.alt = ''; im.referrerPolicy = 'no-referrer';
        im.style.left = (Math.random() * 94 + 2) + '%';
        im.style.animationDuration = (14 + Math.random() * 12) + 's';
        im.style.animationDelay = (-Math.random() * 22) + 's';
        im.style.width = (26 + Math.random() * 26) + 'px';
        im.onerror = function () {
          if (failed) return;
          failed = true; kf++; wrap.innerHTML = '';
          if (kf < candF.length) spawnFloat(candF[kf]); else spawnCoins();
        };
        wrap.appendChild(im);
      }
    }
    function spawnCoins() {
      for (var i = 0; i < 12; i++) {
        var c = document.createElement('span');
        c.className = 'coin';
        c.style.left = (Math.random() * 94 + 2) + '%';
        c.style.animationDuration = (14 + Math.random() * 12) + 's';
        c.style.animationDelay = (-Math.random() * 22) + 's';
        wrap.appendChild(c);
      }
    }

    // картинка из конфига; если не грузится — следующий кандидат, потом CSS-монетки
    spawnFloat(candF[0]);
    if (!fine) return;
    var paws = $('#paws'), last = 0, seq = ['🐾', '🐾', '🪙', '🐾'];
    addEventListener('pointermove', function (e) {
      var now = performance.now();
      if (now - last < 110 || !paws) return;
      last = now;
      var r = paws.getBoundingClientRect();
      var p = document.createElement('span');
      p.className = 'paw';
      p.textContent = seq[(now / 110 | 0) % seq.length];
      p.style.left = (e.clientX - r.left) + 'px';
      p.style.top = (e.clientY - r.top) + 'px';
      p.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
      paws.appendChild(p);
      setTimeout(function () { p.remove(); }, 1100);
    }, { passive: true });
  });

  /* ============================================================
     5. Магнитные кнопки
     ============================================================ */
  safe(function () {
    if (!fine || reduced) return;
    $$('.mag').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) / r.width;
        var y = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = 'translate(' + (x * 8).toFixed(1) + 'px,' + (y * 6).toFixed(1) + 'px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  });

  /* ============================================================
     7. Живой тикер (Dexscreener)
     ============================================================ */
  var LIVE = { price: 0.1258, zec: 1200 };
  safe(function () {
    var url = 'https://api.dexscreener.com/latest/dex/pairs/' + (C.chain || 'solana') + '/' + C.pair;
    var t = $('#ticker');
    function hide() { if (t) t.style.display = 'none'; }
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      var p = d && d.pairs && d.pairs[0];
      if (!p) return hide();
      var usd = parseFloat(p.priceUsd), nat = parseFloat(p.priceNative);
      LIVE.price = isFinite(usd) ? usd : LIVE.price;
      LIVE.zec = (isFinite(usd) && isFinite(nat) && nat > 0) ? usd / nat : LIVE.zec;

      var ch = p.priceChange && p.priceChange.h24;
      var set = function (id, v) { var el = $(id); if (el) el.textContent = v; };
      set('#tkPrice', priceStr(usd));
      set('#tkMcap', money(p.marketCap || p.fdv));
      set('#tkLiq', money(p.liquidity && p.liquidity.usd));
      set('#tkZec', '$' + fmt(LIVE.zec, 0));
      var cEl = $('#tkChange');
      if (cEl) { cEl.textContent = (ch >= 0 ? '+' : '') + Number(ch).toFixed(2) + '%'; cEl.style.color = ch >= 0 ? '#7CF0B0' : '#FF9C8F'; }
      var mc = $('#statMcap');
      if (mc && (p.marketCap || p.fdv)) mc.textContent = moneyShort(p.marketCap || p.fdv);
      var zt = $('#heroZecTicker');
      if (zt && C.facts) zt.textContent = fmt(C.facts.zecDistributed, 0);
    }).catch(hide);
  });

  /* ============================================================
     8. Тиры + круговая диаграмма
     ============================================================ */
  safe(function () {
    var grid = $('#tiersGrid'), chart = $('#poolChart'), legend = $('#poolLegend');
    var tiers = C.tiers || [];
    if (grid) {
      grid.innerHTML = tiers.map(function (t, i) {
        return '<article class="tier reveal" style="--tc:' + t.color + ';--tc-soft:' + t.soft + '">' +
          '<div class="tier__ico">' + t.ico + '</div>' +
          '<h3 class="tier__n">' + t.name + '</h3>' +
          '<p class="tier__min">hold ≥ $' + fmt(t.min, 0) + '</p>' +
          '<p class="tier__pool"><b>' + t.pool + '%</b>of Season 1 pool</p>' +
          '<span class="tier__mult">multiplier ' + t.mult + '</span>' +
          '</article>';
      }).join('');
      $$('#tiersGrid .reveal').forEach(function (el, i) {
        setTimeout(function () { el.classList.add('in'); }, 80 * i);
      });
    }
    if (chart) {
      tiers.forEach(function (t, i) {
        chart.style.setProperty('--c' + (i + 1), t.color);
        chart.style.setProperty('--p' + (i + 1), t.pool);
      });
    }
    if (legend) {
      legend.innerHTML = tiers.map(function (t) {
        return '<div class="pool__row"><span class="pool__sw" style="background:' + t.color + '"></span>' +
          t.ico + ' ' + t.name + '<span>' + t.pool + '%</span></div>';
      }).join('') +
      '<p class="pool__total">Total pool: ' + fmt(C.airdrop ? C.airdrop.pool : 0, 0) + ' $ZCAT · ' +
      (C.airdrop ? C.airdrop.poolPct : 0) + '% of supply</p>';
    }
  });

  /* ============================================================
     9. Таймлайн
     ============================================================ */
  safe(function () {
    var list = $('#tlList');
    if (!list) return;
    list.innerHTML = (C.timeline || []).map(function (t) {
      var st = t.state === 'done' ? 'done' : t.state === 'now' ? 'now' : '';
      var chip = t.state === 'done' ? 'done' : t.state === 'now' ? 'live now' : 'next';
      return '<li class="reveal ' + st + '"><div><p class="tl__date">' + t.date +
        '<span class="tl__state">' + chip + '</span></p></div>' +
        '<div><h3>' + t.title + '</h3><p>' + t.text + '</p></div></li>';
    }).join('');
    $$('#tlList .reveal').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('in'); }, 70 * i);
    });
  });

  /* ============================================================
     10. FAQ
     ============================================================ */
  safe(function () {
    var list = $('#faqList');
    if (!list) return;
    list.innerHTML = (C.faq || []).map(function (f, i) {
      return '<div class="qa reveal"><button class="qa__q" type="button" aria-expanded="false" aria-controls="qa' + i + '">' +
        f.q + '<i aria-hidden="true">+</i></button>' +
        '<div class="qa__a" id="qa' + i + '"><p>' + f.a + '</p></div></div>';
    }).join('');
    $$('#faqList .reveal').forEach(function (el, i) { setTimeout(function () { el.classList.add('in'); }, 60 * i); });
    $$('.qa__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.parentElement, open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
    });
  });

  /* ============================================================
     11. Ссылки
     ============================================================ */
  safe(function () {
    var box = $('#links');
    if (!box) return;
    var all = (C.links || []).concat(C.socials || []);
    box.innerHTML = all.map(function (l) {
      return '<a href="' + l.url + '" target="_blank" rel="noopener noreferrer">' + l.label + ' ↗</a>';
    }).join('');
  });

  /* ============================================================
     13. Claim buttons
     ============================================================ */
  safe(function () {
    $$('[data-claim]').forEach(function (el) {
      el.addEventListener('click', function () {
        /* no auto-scroll */
      });
    });
  });

  /* ============================================================
     14. Обратный отсчёт
     ============================================================ */
  function diffParts(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    return { d: Math.floor(s / 86400), h: Math.floor(s / 3600) % 24, m: Math.floor(s / 60) % 60, s: s % 60 };
  }
  safe(function () {
    var target = new Date((C.airdrop && C.airdrop.claimOpens) || Date.now()).getTime();
    var el = { d: $('#cdD'), h: $('#cdH'), m: $('#cdM'), s: $('#cdS') };
    var dateEl = $('#claimDate');
    if (dateEl && C.airdrop) {
      try {
        dateEl.textContent = new Date(C.airdrop.claimOpens).toLocaleString('en-GB',
          { dateStyle: 'long', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';
      } catch (e) { dateEl.textContent = C.airdrop.claimOpens; }
    }
    function tick() {
      var p = diffParts(target - Date.now());
      if (el.d) el.d.textContent = p.d < 10 ? '0' + p.d : p.d;
      if (el.h) el.h.textContent = p.h < 10 ? '0' + p.h : p.h;
      if (el.m) el.m.textContent = p.m < 10 ? '0' + p.m : p.m;
      if (el.s) el.s.textContent = p.s < 10 ? '0' + p.s : p.s;
    }
    tick();
    setInterval(tick, 1000);
  });

  /* ============================================================
     16. Копирование CA + тосты
     ============================================================ */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add('on'); });
    clearTimeout(toastT);
    toastT = setTimeout(function () {
      toastEl.classList.remove('on');
      setTimeout(function () { toastEl.hidden = true; }, 300);
    }, 2600);
  }
  safe(function () {
    var btn = $('#copyBtn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var ca = btn.dataset.ca || '';
      var done = function () { toast('Contract address copied ✓'); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(ca).then(done, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement('textarea');
        ta.value = ca; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { toast(ca); }
        ta.remove();
      }
    });
  });

  /* ============================================================
     17. Мелочи
     ============================================================ */
  safe(function () {
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
  });

})();
