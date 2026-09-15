# ONRE — Allocation Checker

Статичный лендинг **OnRe Finance** (ончейн-реинстра, Solana) — одна страница
по референсу: шапка, герой, бегущая строка бэкеров. Без сборки:
открыл `index.html` — работает.

```
onre/
├── index.html        разметка (навигация + бургер, герой, marquee, meta-теги)
├── css/style.css     стили + анимации (палитра и шрифты — в :root)
├── js/config.js      ← ВСЕ цифры, тексты, ссылки, бэкары. Менять здесь
├── js/main.js        интерактив: AUM-тик, marquee, бургер-меню, reveal
└── img/onre-logo.svg логотип (fill=currentColor — красится через CSS)
```

## Запуск

```bash
python3 -m http.server 8080      # внутри папки onre/
```

## Навигация

Ссылки шапки подставляются из `js/config.js → links` (атрибут `data-nav`):

| Пункт | URL |
|---|---|
| Home | `https://www.onre.finance/` |
| About | `https://www.onre.finance/about-us` |
| Resources | `https://www.onre.finance/resources` |
| Docs | `https://docs.onre.finance/` |

На мобильных (< 860px) ссылки уходят в бургер-меню, AUM скрывается (< 720px).

## Кнопки CTA

«Check Eligibility» (герой) и «Start today» (шапка) — пока декоративные,
без действий. При появлении реального чекера/страницы — повеси href или
обработчик на `.btn--accent` / `.btn--light`.

## Соцсети / шаринг

Meta-теги (og:* и twitter:*) — в `<head>` `index.html`:
картинка `https://i.ibb.co/q3HpfhMh/onre-2.jpg`, title «$ONRE · Airdrop Season 1».

## Фавиконка

- `rel="icon"` → **`img/favicon.svg`** — копия иконки onre.finance
  (белая скруглённая плитка + чёрное кольцо), лежит в репозитории.
- Второй `<link rel="icon">` — оригинальный PNG с Webflow CDN (запасной).
- `rel="apple-touch-icon"` → Webclip с Webflow CDN (Apple требует PNG).

## Быстрые правки

| Что | Где |
|---|---|
| AUM в шапке (стартовое значение + «живой» дрейф, 0 = статично) | `js/config.js` → `aum` |
| Бегущая строка бэкеров (mark: 'dot' / 'x' / пусто) | `js/config.js` → `backers` |
| Ссылки навигации | `js/config.js` → `links` |
| Соцтеги (title/desc/image) | `index.html` → `<head>` |
| Цвета, радиусы, шрифты, скорость marquee | `css/style.css` → `:root`, `@keyframes marquee` |

## Факты (по публичным данным, Mar 2026)

- OnRe Finance — бермудская лицензированная ончейн-реинстра компания на Solana
- $100M AUM достигнуто 17 Feb 2026 (цель 12 мес. — за 8)
- ONyc — флагманский yield-bearing dollar, ONe — accumulating LP (до 40.35%)
- Бэкары/партнёры: Ethena, Solana Ventures, Guy Carpenter, XBTO и др.
