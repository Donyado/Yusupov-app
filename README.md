# Telegram Mini Apps - Демонстрационный проект

🤖 **Telegram бот и мини-приложение для демонстрации возможностей Telegram Mini Apps для различных сфер бизнеса**

## Особенности

- 🤖 **Telegram бот** для взаимодействия с пользователями
- 📱 **Мини-приложение** с интерактивными шаблонами
- 📞 **Сбор контактной информации** для последующей связи
- 🎯 **6 шаблонов для разных сфер бизнеса**:
  - Ресторанный бизнес
  - Розничная торговля
  - Услуги
  - Образование
  - Медицина
  - Финансы
- 📊 **API для управления контактами**
- 📱 **Адаптивный дизайн** для мобильных устройств

## Быстрый старт

### 1. Деплой на Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FDonyado%2Ftelegram-miniapp-demo&project-name=telegram-miniapp-demo&repository-name=telegram-miniapp-demo)

### 2. Настройка переменных окружения

В панели Vercel добавьте переменные:

```
BOT_TOKEN = 8391693320:AAGfEICnRg12DZFxdRB_qVXW-d4st71R58A
NODE_ENV = production
```

### 3. Настройка Telegram бота

1. Найдите в Telegram: [@BotFather](https://t.me/BotFather)
2. Команда `/setdomain` → выберите бота `@testappersmini_bot` → укажите домен Vercel
3. Команда `/newapp` → выберите бота → имя: `MiniApp Demo` → URL: `https://ваш-проект.vercel.app`

## Как это работает

### Для пользователей

1. **Находят бота** в Telegram
2. **Выбирают сферу бизнеса**
3. **Оставляют номер телефона** для связи
4. **Получают доступ** к интерактивному шаблону
5. **Тестируют функциональность**

### Для администраторов

1. **Заходят в админ-панель**: `/admin`
2. **Просматривают контакты** пользователей
3. **Фильтруют по категориям** и датам
4. **Экспортируют данные** для анализа

## Шаблоны мини-приложений

### 🍽️ Ресторанный бизнес
- Меню с блюдами
- Корзина заказов
- Оформление заказа

### 🛍️ Розничная торговля
- Каталог товаров
- Фильтрация по категориям
- Страницы товаров

### 🔧 Услуги
- Выбор услуги
- Запись на прием
- Выбор даты и времени

### 🎓 Образование
- Доступные курсы
- Прогресс обучения
- Запись на курсы

### 🏥 Медицина
- Выбор специалиста
- Запись к врачу
- Анкета симптомов

### 💰 Финансы
- Просмотр счетов
- Перевод средств
- История операций

## Технологии

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Telegraf** - Telegram Bot Framework
- **Body Parser** - Request parsing

### Frontend
- **HTML5** - Структура страниц
- **CSS3** - Стилизация и анимации
- **JavaScript (ES6+)** - Логика приложения
- **Telegram Web Apps SDK** - Интеграция с Telegram

### Деплой
- **Vercel** - Cloud platform
- **GitHub** - Version control
- **Environment Variables** - Configuration

## API endpoints

- `GET /health` - Проверка состояния сервера
- `POST /api/contacts` - Сохранение контактной информации
- `GET /api/contacts` - Получение всех контактов
- `GET /api/contacts/category/:category` - Получение по категории
- `DELETE /api/contacts/:id` - Удаление контакта

## Структура проекта

```
├── bot.js              # Telegram бот
├── server.js           # Express сервер
├── package.json        # Зависимости
├── vercel.json         # Конфигурация Vercel
├── .env.production     # Переменные для production
├── public/             # Frontend файлы
│   ├── index.html      # Главная страница
│   ├── styles.css      # Стили
│   └── app.js          # JavaScript логика
├── admin.html          # Админ-панель
└── README.md           # Документация
```

## Документация

- [🚀 Инструкция по запуску](LAUNCH_GUIDE.md)
- [⚙️ Деплой и DevOps](DEPLOYMENT.md)
- [🔧 Архитектура](ARCHITECTURE.md)
- [🧪 Тестирование](TESTING.md)
- [💼 Бизнес-логика](BUSINESS.md)

## Разработка

### Локальный запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Запуск production
npm start
```

### Требования

- Node.js 16+
- npm или yarn

## Безопасность

- Храните токен бота в секрете
- Используйте HTTPS в production
- Ограничьте доступ к API endpoints
- Реализуйте валидацию входящих данных

## Лицензия

MIT License

## Поддержка

Для вопросов и предложений создайте issue в репозитории.

---

**Telegram Mini Apps Demo** - ваш первый шаг к созданию бизнес-решений в Telegram! 🚀