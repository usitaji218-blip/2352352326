/* ============================================================
   ZCAT — всё, что нужно поменять, лежит здесь.
   Открыл → поправил цифры → сохранил. HTML трогать не надо.
   ============================================================ */
window.ZCAT_CONFIG = {

  /* ---------- токен ---------- */
  mint: 'HcRLc9VDgjLeK154xDawfb1dmVJ98DoSqcwTHGqiDeJR',
  chain: 'solana',
  // основная пара ZCAT/ZEC (Raydium CLMM) — для живого тикера
  pair: 'BTccxxTFi7a9xJTE1exKn38Jgie35s6gNeRxd8DM61Rc',
  supply: 968922007,

  /* ---------- картинки ---------- */
  images: {
    // аватарка монеты (пусто = официальный аватар $ZCAT из Dexscreener)
    logo:  '',

    // что летит на фоне героя: официальный brandmark Zcash, при недоступности — локальный zec.png
    float: [
      'https://z.cash/wp-content/uploads/2023/11/Brandmark-Yellow.png',
      'img/zec.png'
    ],

    // иконки 4 шагов: пусто = логотип $ZCAT
    steps: [
      '',
      ['https://z.cash/wp-content/uploads/2023/11/Brandmark-Yellow.png', 'img/zec.png'],
      ['https://z.cash/wp-content/uploads/2023/11/Brandmark-Yellow.png', 'img/zec.png'],
      ''
    ]
  },

  /* ---------- аирдроп Season 1 (цифры — черновик!) ---------- */
  airdrop: {
    pool: 48000000,            // всего ZCAT на Season 1
    poolPct: 5,                // % от саплая
    snapshotFrom: '2026-08-20',
    snapshotTo:   '2026-09-05',
    claimOpens:   '2026-09-21T15:00:00Z',
    claimedPct: 0,             // сколько уже заклеймили, %
    minHoldUsd: 20,
    minHoldDays: 14
  },

  /* ---------- тиры ---------- */
  tiers: [
    { name: 'Kitten',     ico: '🐱', min: 20,    mult: '1×',   pool: 35, color: '#FF8A7A', soft: 'rgba(255,138,122,.16)' },
    { name: 'Tabby',      ico: '🐈', min: 250,   mult: '1.5×', pool: 25, color: '#FFC49B', soft: 'rgba(255,196,155,.22)' },
    { name: 'House Cat',  ico: '😺', min: 1000,  mult: '2.5×', pool: 20, color: '#F4B728', soft: 'rgba(244,183,40,.20)'  },
    { name: 'Panther',    ico: '🐆', min: 5000,  mult: '4×',   pool: 12, color: '#7ED8B4', soft: 'rgba(126,216,180,.22)' },
    { name: 'Ninth Life', ico: '😼', min: 25000, mult: '7×',   pool: 8,  color: '#B7A9FF', soft: 'rgba(183,169,255,.22)' }
  ],

  /* ---------- таймлайн ---------- */
  timeline: [
    { date: '20 Aug – 5 Sep', title: 'Snapshot window', text: 'Wallets were tracked during the eligibility window. Minimum qualifying hold: $20 for 14 days.', state: 'done' },
    { date: '8 Sep 2026',     title: 'Eligibility review', text: 'Snapshot data is finalized and qualifying holders are prepared for the claim window.', state: 'now' },
    { date: '21 Sep 2026',    title: 'Claim opens', text: 'Season 1 claims open on the official page. No seed phrase, no wallet validation, no unsafe prompts.', state: 'next' },
    { date: 'October 2026',   title: 'Next campaign update', text: 'Further holder incentives and the next campaign details will be announced after Season 1.', state: 'next' }
  ],

  /* ---------- FAQ ---------- */
  faq: [
    { q: 'Is the airdrop free?', a: 'Yes. Checking your allocation costs nothing and never asks for a signature. The only thing you ever pay is Solana network fees when you transact.' },
    { q: 'Do I need to hold $ZCAT to be eligible?', a: 'Yes — the snapshot rewards wallets that held at least $20 of $ZCAT on a self-custody Solana wallet during the snapshot window. Exchange balances do not count, because we cannot prove they are yours.' },
    { q: 'What is the 3% tax and where does it go?', a: 'Every buy, sell and transfer of $ZCAT pays a 3% tax. It is converted into Zcash and streamed to eligible holders automatically — no staking, no claiming, no lockups.' },
    { q: 'When do claims open?', a: 'The claim window opens on the date shown in the timeline. Before that time, nothing is claimable yet.' },
    { q: 'How are bots and sybils filtered?', a: 'Wallets are clustered, coordinated groups are dropped, and only behaviour over time counts. One allocation per cluster — not per wallet.' },
    { q: 'Is this financial advice?', a: 'No. $ZCAT is a meme coin with no intrinsic value and no expectation of return. Rewards depend entirely on trading activity. If volume stops, payouts stop.' }
  ],

  /* ---------- ссылки ---------- */
  links: [
    { label: 'Chart',        url: 'https://dexscreener.com/solana/btccxxtfi7a9xjte1exkn38jgie35s6gnerxd8dm61rc' },
    { label: 'Buy on Pump',  url: 'https://pump.fun/coin/HcRLc9VDgjLeK154xDawfb1dmVJ98DoSqcwTHGqiDeJR' },
    { label: 'Swap Jupiter', url: 'https://jup.ag/tokens/HcRLc9VDgjLeK154xDawfb1dmVJ98DoSqcwTHGqiDeJR' },
    { label: 'Solscan',      url: 'https://solscan.io/token/HcRLc9VDgjLeK154xDawfb1dmVJ98DoSqcwTHGqiDeJR' }
  ],
  // соцсети: впиши свои, пустые просто не покажутся
  socials: [
    // { label: 'X / Twitter', url: 'https://x.com/…' },
    // { label: 'Telegram',    url: 'https://t.me/…' }
  ],

  /* ---------- проверенные факты (на 7 Sep 2026) ---------- */
  facts: {
    zecDistributed: 2320,
    usdDistributed: 2800000,
    payouts: 470000
  }
};
