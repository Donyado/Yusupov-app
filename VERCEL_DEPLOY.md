# Деплой на Vercel

## Быстрая настройка

### 1. Подключение к Vercel

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Выберите свой GitHub репозиторий: `Donyado/telegram-miniapp-demo`
4. Нажмите "Create Project"

### 2. Настройка переменных окружения

В настройках проекта в Vercel добавьте переменные:

**Environment Variables:**
- `BOT_TOKEN` = `8391693320:AAGfEICnRg12DZFxdRB_qVXW-d4st71R58A`
- `NODE_ENV` = `production`

**Development (если нужно):**
- `BOT_TOKEN` = `8391693320:AAGfEICnRg12DZFxdRB_qVXW-d4st71R58A`
- `NODE_ENV` = `development`

### 3. Настройка Telegram бота

1. В Telegram найдите @BotFather
2. Отправьте команду `/setdomain`
3. Выберите бота: `@testappersmini_bot`
4. Укажите домен Vercel (например, `telegram-miniapp-demo.vercel.app`)

5. Отправьте команду `/newapp`
6. Выберите бота
7. Укажите имя приложения: `MiniApp Demo`
8. Укажите URL: `https://telegram-miniapp-demo.vercel.app`

### 4. Проверка деплоя

После деплоя проверьте:

1. **Основной сайт**: `https://telegram-miniapp-demo.vercel.app`
2. **Админ-панель**: `https://telegram-miniapp-demo.vercel.app/admin`
3. **API Health**: `https://telegram-miniapp-demo.vercel.app/health`

## Возможные проблемы

### 1. Ошибка "Bot Token Invalid"

**Решение:**
- Проверьте, что токен бота введен правильно
- Убедитесь, что переменная `BOT_TOKEN` добавлена в Vercel
- Перезапустите деплой

### 2. Ошибка "Port already in use"

**Решение:**
- Vercel автоматически управляет портами
- Убедитесь, что в коде используется `process.env.PORT`

### 3. Ошибка "Cannot find module"

**Решение:**
- Проверьте, что все зависимости в `package.json`
- Убедитесь, что `package.json` в корне репозитория

## Тестирование

### 1. Тест API

```bash
# Проверка состояния
curl https://telegram-miniapp-demo.vercel.app/health

# Сохранение контакта
curl -X POST https://telegram-miniapp-demo.vercel.app/api/contacts \
  -H "Content-Type: application/json" \
  -d '{"category":"restaurant","phone":"+79991234567"}'

# Получение контактов
curl https://telegram-miniapp-demo.vercel.app/api/contacts
```

### 2. Тест бота

1. Найдите в Telegram: `@testappersmini_bot`
2. Отправьте `/start`
3. Выберите категорию
4. Проверьте, что работает переход к мини-приложению

## Мониторинг

### 1. Логи Vercel

- В панели Vercel перейдите в "Functions"
- Выберите "server.js"
- Просмотрите логи выполнения

### 2. Метрики

- В панели Vercel перейдите в "Analytics"
- Проверьте количество запросов
- Проверьте время отклика

## Обновление

### 1. Через GitHub

Любое изменение в репозитории автоматически запускает новый деплой.

### 2. Через CLI

```bash
# Установка Vercel CLI
npm install -g vercel

# Деплой
vercel

# Продакшн деплой
vercel --prod
```

## Поддержка

Если возникнут проблемы:

1. Проверьте логи в панели Vercel
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что бот активен в Telegram
4. Создайте issue в репозитории