# StonkFun — Trader Reward Pool ($1,000,000)

Лендинг пула наград для трейдеров платформы **StonkFun (Solana)**, полностью сверстанный по предоставленному референсу:
- **Header**: логотип StonkFun, социальные кнопки (Telegram, X) и интерактивная кнопка «Connect wallet».
- **Hero**: бейдж «Trader reward pool», заголовок «$1,000,000 for StonkFun traders», поясняющий текст.
- **3 карточки метрик**:
  1. *Total pool value*: `$1,000,000` (Reserved for eligible traders)
  2. *Eligible tokens*: `All StonkFun launches` (Any token launched on the platform)
  3. *Claim window*: `Open now` (Snapshot based on trade history)
- **Блок проверки**: «Check your eligibility» с кнопкой «Check my eligibility».
- **Блок условий**: «Who qualifies» с 4 пунктами правил (Traded not held, Any launch counts, One claim per wallet, Wash-trading excluded).
- **Footer**: ссылки 𝕏, $STONK, Revenue, API, Rewards, Terms of Service.
- **Интерактив**:
  - Модальное окно подключения кошелька (Phantom, Solflare, Backpack) или проверка по произвольному адресу.
  - Демо-пресеты кошельков для моментального тестирования (Top Trader $3,450, Active Trader $1,250, Casual Trader $320, Ineligible).
  - Анимированный сканер истории транзакций на Solana RPC.
  - Экран результатов с проверкой аллокации и анимацией конфетти при клейме наград.
  - Всплывающие уведомления (toasts) и копирование адреса.

## Структура файлов

```
├── index.html        # Главная разметка лендинга и модалок
├── css/style.css     # Стили, переменные тем, адаптив, анимации
├── js/config.js      # Конфигурация: тексты, цифры, ссылки, демо-кошельки
├── js/main.js        # Интерактив: кошелек, чекер, конфетти, тосты
└── img/
    ├── logo.svg      # Векторный логотип StonkFun
    └── favicon.svg   # Favicon
```

## Запуск

```bash
python3 -m http.server 8080
```
или открытие файла `index.html` в браузере.
