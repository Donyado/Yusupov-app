# Инструкция по настройке и запуску проекта

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка окружения

1. Скопируйте файл `.env.example` в `.env`:
```bash
cp .env.example .env
```

2. Заполните `.env` файл:
```
BOT_TOKEN=your_bot_token_here
WEBHOOK_URL=https://your_domain.com/webhook
PORT=3000
APP_URL=https://your_domain.com
```

### 3. Запуск сервера

```bash
# Локальный запуск
npm start

# Режим разработки с авто-перезагрузкой
npm run dev
```

Сервер будет доступен по адресу: `http://localhost:3000`

## Настройка Telegram бота

### 1. Создание бота

1. Найдите в Telegram бота [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Получите токен бота в формате: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### 2. Настройка бота

1. Отправьте BotFather команду `/setdomain`
2. Выберите вашего бота
3. Укажите домен вашего приложения (например, `your_domain.com`)

### 3. Настройка Web App

1. Отправьте BotFather команду `/newapp`
2. Выберите вашего бота
3. Укажите имя приложения
4. Укажите URL вашего мини-приложения (например, `https://your_domain.com`)

## Тестирование локально

### 1. Использование ngrok для локального тестирования

Для тестирования бота локально используйте ngrok:

```bash
# Установите ngrok (если не установлен)
npm install -g ngrok

# Запустите ngrok для порта 3000
ngrok http 3000
```

2. Скопируйте HTTPS URL из ngrok и обновите `.env` файл:
```
WEBHOOK_URL=https://your-ngrok-subdomain.ngrok.io/webhook
APP_URL=https://your-ngrok-subdomain.ngrok.io
```

### 2. Тестирование мини-приложения

1. Запустите сервер: `npm start`
2. Откройте в браузере: `http://localhost:3000`
3. Используйте Telegram Desktop для тестирования Web App

## Деплой на сервер

### Вариант 1: VPS/Cloud сервер

1. Установите Node.js на сервер
2. Склонируйте репозиторий
3. Установите зависимости: `npm install`
4. Настройте `.env` файл
5. Запустите сервер: `npm start`
6. Настройте nginx для проксирования:
```nginx
server {
    listen 80;
    server_name your_domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Установите SSL сертификат (Let's Encrypt):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
```

### Вариант 2: Heroku

1. Установите Heroku CLI
2. Авторизуйтесь: `heroku login`
3. Создайте приложение: `heroku create your-app-name`
4. Установите переменные окружения:
```bash
heroku config:set BOT_TOKEN=your_token
heroku config:set WEBHOOK_URL=https://your-app-name.herokuapp.com/webhook
heroku config:set APP_URL=https://your-app-name.herokuapp.com
```
5. Запушьте код: `git push heroku main`

### Вариант 3: Railway

1. Зарегистрируйтесь на [Railway.app](https://railway.app)
2. Подключите GitHub репозиторий
3. Настройте переменные окружения в интерфейсе Railway
4. Запустите деплой

## Проверка работоспособности

### 1. Проверка сервера

```bash
curl http://localhost:3000/health
```

Ожидаемый ответ:
```json
{
  "status": "ok",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
  "uptime": XX.XXX,
  "contactsCount": 0
}
```

### 2. Проверка API

```bash
# Сохранение контакта
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"category":"restaurant","phone":"+79991234567"}'

# Получение контактов
curl http://localhost:3000/api/contacts
```

### 3. Тестирование бота

1. Найдите бота в Telegram по имени
2. Отправьте команду `/start`
3. Проверьте работу всех функций

## Администрирование

### Доступ к админ-панели

1. Перейдите по адресу: `http://localhost:3000/admin`
2. Просмотрите список контактов
3. Используйте фильтры для поиска
4. Экспортируйте данные в CSV

### API endpoints

- `GET /health` - Проверка состояния
- `POST /api/contacts` - Сохранение контакта
- `GET /api/contacts` - Получение всех контактов
- `GET /api/contacts/category/:category` - Получение по категории
- `DELETE /api/contacts/:id` - Удаление контакта

## Возможные проблемы

### 1. Bot API не отвечает

- Проверьте токен бота в `.env`
- Убедитесь, что бот активен
- Проверьте интернет-соединение

### 2. Web App не загружается

- Проверьте URL в настройках бота
- Убедитесь, что сервер запущен
- Проверьте SSL сертификат

### 3. Контакты не сохраняются

- Проверьте права доступа к файлам
- Убедитесь, что сервер имеет доступ к записи
- Проверьте логи сервера

## Безопасность

1. Никогда не публикуйте `.env` файл
2. Используйте HTTPS в production
3. Ограничьте доступ к API endpoints
4. Регулярно обновляйте зависимости
5. Используйте strong passwords для админ-панели

## Поддержка

Если возникли проблемы:

1. Проверьте логи сервера
2. Убедитесь, что все зависимости установлены
3. Проверьте настройки окружения
4. Создайте issue в репозитории