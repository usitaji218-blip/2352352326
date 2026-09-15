/* ============================================================
   ONRE — Allocation Checker · ВСЁ КОНТЕНТ И ЦИФРЫ ЗДЕСЬ
   Статичный сайт, без сборки. Поменял конфиг — обновил страницу.
   ============================================================ */
window.ONRE = {

  /* ---- живые цифры в шапке ---- */
  aum: {
    start: 297.34,        // AUM в $M (по скриншоту дизайна)
    drift: 0.04,          // «живой» дрейф ±$M каждые 4 сек (0 = статично)
    interval: 4000
  },

  /* ---- бэкары / партнёры (бегущая строка; mark: 'dot' | 'x' | пусто) ---- */
  backers: [
    { name: 'Maven 11' },
    { name: 'Spartan' },
    { name: 'udc' },
    { name: 'XBTO', mark: 'x' },
    { name: 'Ethena', mark: 'dot' },
    { name: 'Guy Carpenter', mark: 'dot' },
    { name: 'HODEN' },
    { name: 'Coinbase · Vertex', mark: 'dot' }
  ],

  /* ---- ссылки навигации ---- */
  links: {
    home: 'https://www.onre.finance/',
    about: 'https://www.onre.finance/about-us',
    resources: 'https://www.onre.finance/resources',
    docs: 'https://docs.onre.finance/'
  }
};
