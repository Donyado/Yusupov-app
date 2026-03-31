# Деплой и DevOps

## Обзор деплоя

Этот документ описывает процессы деплоя и DevOps практики для проекта Telegram Mini Apps Presentation.

## Среды развертывания

### 1. Development (Разработка)

**Назначение**: Локальная разработка и тестирование

**Характеристики**:
- Локальный запуск на `localhost:3000`
- Автоматическая перезагрузка при изменениях
- Подробное логирование
- Нет SSL сертификата

**Команды**:
```bash
npm run dev  # Запуск в режиме разработки
npm run dev:debug  # Запуск с отладкой
```

### 2. Staging (Тестирование)

**Назначение**: Тестирование перед production

**Характеристики**:
- Тестовый домен
- Реальные данные (но не production)
- Полная функциональность
- SSL сертификат

**Настройка**:
```bash
NODE_ENV=staging
npm run build
npm start
```

### 3. Production (Продакшн)

**Назначение**: Рабочая среда для пользователей

**Характеристики**:
- Основной домен
- Полная безопасность
- Мониторинг и логирование
- Высокая доступность

**Настройка**:
```bash
NODE_ENV=production
npm run build
npm start
```

## Платформы деплоя

### 1. Heroku

**Преимущества**:
- Простота деплоя
- Автоматическое масштабирование
- Встроенные инструменты мониторинга

**Настройка**:
```bash
# Установка Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Авторизация
heroku login

# Создание приложения
heroku create your-app-name

# Установка переменных окружения
heroku config:set NODE_ENV=production
heroku config:set BOT_TOKEN=your_token

# Деплой
git push heroku main
```

**Procfile**:
```
web: npm start
worker: npm run worker
```

### 2. Railway

**Преимущества**:
- Бесплатный тариф
- Простая настройка
- Автоматический деплой

**Настройка**:
1. Подключить GitHub репозиторий
2. Настроить переменные окружения
3. Выбрать ветку для деплоя
4. Запустить деплой

### 3. AWS (Amazon Web Services)

**Преимущества**:
- Гибкость настройки
- Высокая производительность
- Масштабируемость

**Сервисы**:
- **EC2**: Виртуальные машины
- **Elastic Beanstalk**: PaaS платформа
- **Lambda**: Serverless функции
- **RDS**: База данных
- **CloudFront**: CDN

**Настройка EC2**:
```bash
# Подключение к серверу
ssh -i your-key.pem ec2-user@your-server-ip

# Установка Node.js
curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# Клонирование репозитория
git clone your-repo-url
cd your-repo

# Установка зависимостей
npm install

# Настройка переменных окружения
echo "NODE_ENV=production" >> .env
echo "BOT_TOKEN=your_token" >> .env

# Запуск с PM2
npm install -g pm2
pm2 start server.js --name "miniapp-server"
pm2 startup
pm2 save
```

### 4. DigitalOcean

**Преимущества**:
- Простота управления
- Хорошее соотношение цена/качество
- Быстрое развертывание

**Droplet настройка**:
```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2
sudo npm install -g pm2

# Клонирование и запуск
git clone your-repo
cd your-repo
npm install
pm2 start server.js
```

### 5. VPS (Virtual Private Server)

**Преимущества**:
- Полный контроль
- Гибкость настройки
- Низкая стоимость

**Настройка**:
```bash
# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка Nginx
sudo apt install nginx -y

# Настройка Nginx
sudo nano /etc/nginx/sites-available/your-domain

# Конфигурация Nginx
server {
    listen 80;
    server_name your-domain.com;

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

# Активация конфигурации
sudo ln -s /etc/nginx/sites-available/your-domain /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Установка SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## Docker

### Dockerfile

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - BOT_TOKEN=${BOT_TOKEN}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Команды Docker

```bash
# Сборка образа
docker build -t miniapp-server .

# Запуск контейнера
docker run -p 3000:3000 -e BOT_TOKEN=your_token miniapp-server

# Запуск с Docker Compose
docker-compose up -d

# Просмотр логов
docker logs container-name

# Остановка
docker-compose down
```

## CI/CD Pipeline

### GitHub Actions

**Рабочий процесс**:

```yaml
name: Deploy

on:
  push:
    branches: [ main, production ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'
      - run: npm install
      - run: npm run test
      - run: npm run test:integration
      - run: npm run test:e2e

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: staging
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Staging
        run: |
          # Deployment script for staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/production'
    environment: production
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: |
          # Deployment script for production
```

### GitLab CI

```yaml
stages:
  - test
  - deploy-staging
  - deploy-production

test:
  stage: test
  script:
    - npm install
    - npm run test
    - npm run test:integration
  only:
    - main
    - production

deploy_staging:
  stage: deploy-staging
  script:
    - echo "Deploying to staging..."
  environment:
    name: staging
    url: https://staging.your-domain.com
  only:
    - main

deploy_production:
  stage: deploy-production
  script:
    - echo "Deploying to production..."
  environment:
    name: production
    url: https://your-domain.com
  only:
    - production
```

## Мониторинг

### 1. Application Monitoring

**Инструменты**:
- **New Relic**: APM мониторинг
- **Datadog**: Комплексный мониторинг
- **Prometheus + Grafana**: Open-source решение

**Метрики**:
- Время отклика API
- Количество запросов
- Ошибки и исключения
- Потребление памяти

### 2. Infrastructure Monitoring

**Инструменты**:
- **UptimeRobot**: Мониторинг доступности
- **Pingdom**: Мониторинг производительности
- **CloudWatch**: AWS мониторинг

**Метрики**:
- CPU usage
- Memory usage
- Disk space
- Network traffic

### 3. Error Tracking

**Инструменты**:
- **Sentry**: Отслеживание ошибок
- **LogRocket**: Видеозапись сессий
- **Rollbar**: Мониторинг ошибок

**Настройка Sentry**:

```javascript
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: 'your-sentry-dsn',
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

// В Express middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(Sentry.Handlers.errorHandler());
```

## Логирование

### 1. Application Logging

**Инструменты**:
- **Winston**: Гибкая система логирования
- **Morgan**: HTTP request logger
- **Console**: Стандартное логирование

**Настройка Winston**:

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'miniapp-server' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. Log Aggregation

**Инструменты**:
- **ELK Stack**: Elasticsearch, Logstash, Kibana
- **Fluentd**: Data collector
- **CloudWatch Logs**: AWS логирование

## Безопасность

### 1. Environment Variables

**Best practices**:
- Никогда не коммитить .env файлы
- Использовать секреты в CI/CD
- Регулярно менять токены

### 2. SSL/TLS

**Настройка**:
- Let's Encrypt для бесплатных сертификатов
- Автоматическое обновление
- HSTS заголовки

### 3. Rate Limiting

**Настройка**:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // Ограничение 100 запросов
});

app.use('/api/', limiter);
```

### 4. CORS

**Настройка**:
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['https://your-domain.com', 'https://your-app.com'],
  credentials: true
}));
```

## Backup and Recovery

### 1. Database Backup

**PostgreSQL**:
```bash
# Создание бэкапа
pg_dump -h hostname -U username database_name > backup.sql

# Восстановление
psql -h hostname -U username -d database_name < backup.sql
```

**MongoDB**:
```bash
# Создание бэкапа
mongodump --host hostname --db database_name --out backup/

# Восстановление
mongorestore --host hostname --db database_name backup/database_name/
```

### 2. Application Backup

**Git**:
```bash
# Создание тега
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Создание архива
git archive --format=zip --output=backup.zip main
```

## Troubleshooting

### 1. Common Issues

**Port already in use**:
```bash
# Найти процесс
lsof -i :3000

# Завершить процесс
kill -9 PID
```

**Permission denied**:
```bash
# Изменить права
sudo chmod 755 server.js
sudo chown -R $USER:$USER /path/to/project
```

**Memory issues**:
```bash
# Проверить использование памяти
pm2 monit

# Перезапустить приложение
pm2 restart app-name
```

### 2. Debug Commands

```bash
# Проверить статус сервиса
pm2 status

# Просмотреть логи
pm2 logs app-name

# Проверить переменные окружения
pm2 env app-id

# Мониторинг ресурсов
pm2 monit
```

## Performance Optimization

### 1. Caching

**Redis**:
```javascript
const redis = require('redis');
const client = redis.createClient();

// Кэширование ответов
app.get('/api/data', async (req, res) => {
  const key = 'api_data';
  const cached = await client.get(key);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const data = await getData();
  client.setex(key, 3600, JSON.stringify(data));
  res.json(data);
});
```

### 2. Compression

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. CDN

**Настройка CloudFlare**:
- Включить автоматическое сжатие
- Настроить кэширование статических файлов
- Включить HTTP/2

## Cost Optimization

### 1. Resource Monitoring

**Инструменты**:
- AWS Cost Explorer
- DigitalOcean Monitoring
- Heroku Metrics

### 2. Auto-scaling

**Настройка**:
- Horizontal scaling по CPU usage
- Vertical scaling по памяти
- Auto-shutdown в нерабочее время

### 3. Caching Strategy

**Уровни кэширования**:
- Browser cache
- CDN cache
- Application cache
- Database cache

## Best Practices

### 1. Deployment Checklist

- [ ] Тесты пройдены
- [ ] Переменные окружения настроены
- [ ] SSL сертификат активен
- [ ] Бэкап сделан
- [ ] Мониторинг настроен
- [ ] Документация обновлена

### 2. Security Checklist

- [ ] Пароли не в коде
- [ ] HTTPS включен
- [ ] CORS настроен
- [ ] Rate limiting активен
- [ ] Логи не содержат sensitive data

### 3. Performance Checklist

- [ ] Статические файлы сжаты
- [ ] Кэширование настроено
- [ ] База данных оптимизирована
- [ ] CDN активен
- [ ] Мониторинг производительности

### 4. Monitoring Checklist

- [ ] Application monitoring
- [ ] Infrastructure monitoring
- [ ] Error tracking
- [ ] Log aggregation
- [ ] Alerting configured