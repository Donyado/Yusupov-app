# API Документация

## Описание

Этот документ описывает API для управления контактами, оставленными пользователями в Telegram Mini App.

## Базовый URL

```
http://localhost:3000/api
```

## Аутентификация

API не требует аутентификации для демо-версии. В production рекомендуется добавить аутентификацию.

## Эндпоинты

### 1. Сохранение контакта

**POST** `/contacts`

Сохраняет контактную информацию пользователя.

#### Запрос

```json
{
  "category": "restaurant",
  "phone": "+79991234567",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ"
}
```

#### Параметры

| Параметр | Тип | Обязательный | Описание |
|----------|-----|--------------|----------|
| category | string | Да | Категория бизнеса (restaurant, retail, services, education, healthcare, finance) |
| phone | string | Да | Номер телефона пользователя |
| timestamp | string | Нет | Время создания (если не указано, используется текущее) |

#### Ответ

```json
{
  "success": true,
  "message": "Contact saved successfully",
  "contact": {
    "id": "1234567890",
    "category": "restaurant",
    "phone": "+79991234567",
    "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### 2. Получение всех контактов

**GET** `/contacts`

Получает список всех сохраненных контактов.

#### Ответ

```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "category": "restaurant",
      "phone": "+79991234567",
      "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "count": 1
}
```

### 3. Получение контактов по категории

**GET** `/contacts/category/:category`

Получает контакты для определенной категории бизнеса.

#### Параметры URL

| Параметр | Тип | Описание |
|----------|-----|----------|
| category | string | Категория (restaurant, retail, services, education, healthcare, finance) |

#### Ответ

```json
{
  "success": true,
  "data": [
    {
      "id": "1234567890",
      "category": "restaurant",
      "phone": "+79991234567",
      "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "count": 1,
  "category": "restaurant"
}
```

### 4. Удаление контакта

**DELETE** `/contacts/:id`

Удаляет контакт по его ID.

#### Параметры URL

| Параметр | Тип | Описание |
|----------|-----|----------|
| id | string | ID контакта |

#### Ответ

```json
{
  "success": true,
  "message": "Contact deleted successfully",
  "deletedContact": {
    "id": "1234567890",
    "category": "restaurant",
    "phone": "+79991234567",
    "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
    "userAgent": "Mozilla/5.0..."
  }
}
```

### 5. Проверка состояния сервера

**GET** `/health`

Проверяет состояние сервера и получает статистику.

#### Ответ

```json
{
  "status": "ok",
  "timestamp": "2023-XX-XXTXX:XX:XX.XXXZ",
  "uptime": 123.456,
  "contactsCount": 42
}
```

## Категории бизнеса

| Категория | Описание |
|-----------|----------|
| restaurant | Ресторанный бизнес |
| retail | Розничная торговля |
| services | Услуги |
| education | Образование |
| healthcare | Медицина |
| finance | Финансы |

## Ошибки

### Общие ошибки

| Код | Сообщение | Описание |
|-----|-----------|----------|
| 400 | Missing required fields | Не указаны обязательные поля |
| 404 | Contact not found | Контакт не найден |
| 500 | Internal server error | Внутренняя ошибка сервера |

### Примеры ошибок

```json
{
  "error": "Missing required fields"
}
```

```json
{
  "error": "Contact not found"
}
```

```json
{
  "error": "Internal server error"
}
```

## Примеры использования

### Сохранение контакта

```javascript
fetch('/api/contacts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'restaurant',
    phone: '+79991234567'
  })
})
.then(response => response.json())
.then(data => console.log(data));
```

### Получение всех контактов

```javascript
fetch('/api/contacts')
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Контакты:', data.data);
    console.log('Всего:', data.count);
  }
});
```

### Получение контактов по категории

```javascript
fetch('/api/contacts/category/restaurant')
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Ресторанные контакты:', data.data);
  }
});
```

### Удаление контакта

```javascript
fetch('/api/contacts/1234567890', {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => console.log(data));
```

## CORS

Для работы с API с других доменов необходимо настроить CORS. В production рекомендуется ограничить доступ только доверенным доменам.

## Ограничения

- Максимальная длина номера телефона: 20 символов
- Максимальная длина категории: 50 символов
- Время жизни контактов: не ограничено (в demo-версии)

## Безопасность

- Не храните чувствительные данные в открытом виде
- Используйте HTTPS в production
- Ограничьте количество запросов с одного IP
- Реализуйте аутентификацию для production