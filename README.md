# ZCAT — Anonymous Cat · Airdrop Season 1

Статический лендинг аирдропа под **$ZCAT (Anonymous Cat, Solana)**.
Пастельный мемный стиль, анимации на чистом JS, никакой сборки: открыл `index.html` — работает.

```
zcat/
├── index.html        разметка (тикер, хедер, герой, стикеры, шаги, тиры, таймлайн, правила, FAQ, CA)
├── css/style.css     стили + анимации (палитра и шрифты — в :root)
├── js/config.js      ← ВСЕ цифры, тиры, даты, ссылки, FAQ. Менять здесь
├── js/main.js        интерактив: тикер, таймер, модалка клейма, аккордеон, конфетти
└── img/og.jpg        обложка для соцсетей (1200×630)
```

## Запуск

```bash
python3 -m http.server 8080      # внутри папки zcat/
```
или двойной клик по `index.html`.

## Картинки — только реальные ассеты

Никаких нейрогенерёнок. Откуда что берётся:

| Где | Что |
|---|---|
| Лого в шапке, герой, стикеры, футер, favicon | официальный аватар $ZCAT из метаданных Dexscreener (`cdn.dexscreener.com/cms/images/-DNNIYh0wlMsd_v4`) |
| Летающие монетки на фоне героя | официальный **Zcash Brandmark Yellow** с z.cash (`/wp-content/uploads/2023/11/Brandmark-Yellow.png`) |
| Иконки шагов 2 и 3 | тот же brandmark Zcash |
| Иконки шагов 1 и 4, чип «2,320 ZEC» | логотип $ZCAT |
| Чип «Solana» | `img/sol.png` — настоящий логотип Solana |

ZEC/SOL в `img/` — из стандартного набора `cryptocurrency-icons` (не AI): они работают как резерв,
если внешний brandmark недоступен.

### Как подставить свои картинки

Всё в одном месте — `js/config.js` → `images`:

```js
images: {
  logo:  '',      // аватарка шапки/героя (пусто = официальный аватар $ZCAT)
  float: [...],   // что летит на фоне: сначала brandmark с z.cash, потом локальный img/zec.png
  steps: [...]    // иконки 4 шагов (пусто = логотип $ZCAT)
}
```

Можно писать строкой или массивом — массив перебирается по очереди, пока картинка не загрузится.

Положи файл в `img/` и пропиши путь — или дай прямую ссылку (любой хостинг).
Если картинка не грузится, включается запасной вариант: монетки рисуются на CSS,
а в шагах появляется аккуратная плитка с буквой Z. Никаких битых картинок.

## Что подтягивается извне

- **Dexscreener API** — живой тикер (цена, 24h, капа, ликвидность, цена ZEC).
  Пара `BTccxxTFi7a9xJTE1exKn38Jgie35s6gNeRxd8DM61Rc` (ZCAT/ZEC, Raydium CLMM).
  Недоступен — тикер скрывается, страница работает дальше.
- **Google Fonts** — Baloo 2, Nunito, Space Mono.

## Быстрые правки

| Что | Где |
|---|---|
| Контракт, пара, саплай | `js/config.js` → `mint`, `pair`, `supply` |
| Дата открытия клейма | `js/config.js` → `airdrop.claimOpens` (таймер и модалка считают от неё) |
| Пул, снапшот, мин. холд | `js/config.js` → `airdrop` |
| Тиры и множители | `js/config.js` → `tiers` |
| Тексты FAQ и таймлайн | `js/config.js` → `faq`, `timeline` |
| Ссылки и соцсети | `js/config.js` → `links`, `socials` |
| Цвета, радиусы, шрифты | `css/style.css` → `:root` |

## Кнопка Claim

Кнопки с атрибутом `data-claim` (герой, шапка, блок шагов, мобильное меню) открывают модалку
с обратным отсчётом до `airdrop.claimOpens`. Сам приём заявок **не подключён** — заглушка:

```js
// js/main.js, обработчик #modalClaim
mc.addEventListener('click', function () {
  toast('Connect your claim contract in js/main.js → #modalClaim');
});
```

Подключи сюда свой контракт/бэкенд (или форму на Google Sheets / Telegram-бот).

## Факты на странице (7 Sep 2026)

- $ZCAT = Anonymous Cat, Solana, mint `HcRLc9VDgjLeK154xDawfb1dmVJ98DoSqcwTHGqiDeJR`
- 3% налог с трансфера → конвертируется в ZEC → холдерам с балансом от $20
- Выплачено ~2 320 ZEC (~$2.8M) при 470 000+ выплат
- Торгуется к ZEC через StonkFun, капа ~$122M
- Источники: CoinDesk, Dexscreener

Всё, что касается «Season 1» (пул, тиры, даты) — **черновик**, поменяй под свой дроп.
