# Тестирование проекта

## Обзор тестирования

Проект включает в себя различные уровни тестирования для обеспечения качества и надежности системы. Тестирование охватывает как backend, так и frontend компоненты.

## Уровни тестирования

### 1. Unit Testing (Модульное тестирование)

**Цель**: Проверка отдельных компонентов и функций

**Инструменты**:
- Jest (для JavaScript)
- Mocha (альтернатива)
- Chai (для ассертов)

**Что тестируем**:
- Функции обработки данных
- Валидацию входных параметров
- Логику бизнес-процессов

**Примеры тестов**:

```javascript
// Тест для функции валидации телефона
describe('Phone validation', () => {
    test('should validate correct phone number', () => {
        const result = validatePhone('+79991234567');
        expect(result).toBe(true);
    });
    
    test('should reject invalid phone number', () => {
        const result = validatePhone('invalid');
        expect(result).toBe(false);
    });
});

// Тест для функции создания контакта
describe('Contact creation', () => {
    test('should create contact with valid data', () => {
        const contact = createContact({
            category: 'restaurant',
            phone: '+79991234567'
        });
        
        expect(contact).toHaveProperty('id');
        expect(contact.category).toBe('restaurant');
        expect(contact.phone).toBe('+79991234567');
    });
});
```

### 2. Integration Testing (Интеграционное тестирование)

**Цель**: Проверка взаимодействия между компонентами

**Что тестируем**:
- API endpoints
- Взаимодействие frontend и backend
- Работу с базой данных

**Примеры тестов**:

```javascript
// Тест API endpoint
describe('API endpoints', () => {
    test('POST /api/contacts should save contact', async () => {
        const response = await request(app)
            .post('/api/contacts')
            .send({
                category: 'restaurant',
                phone: '+79991234567'
            });
        
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.contact.category).toBe('restaurant');
    });
    
    test('GET /api/contacts should return all contacts', async () => {
        const response = await request(app).get('/api/contacts');
        
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });
});
```

### 3. End-to-End Testing (Сквозное тестирование)

**Цель**: Проверка полного пользовательского сценария

**Инструменты**:
- Cypress
- Selenium
- Playwright

**Тестируемые сценарии**:

1. **Полный цикл пользователя**:
   - Переход в Telegram бота
   - Выбор категории
   - Ввод номера телефона
   - Переход к шаблону
   - Взаимодействие с шаблоном

2. **Административные функции**:
   - Доступ к админ-панели
   - Просмотр контактов
   - Фильтрация и поиск
   - Экспорт данных

**Пример Cypress теста**:

```javascript
describe('User flow testing', () => {
    it('should complete full user journey', () => {
        // 1. Visit main page
        cy.visit('/');
        
        // 2. Select category
        cy.get('[data-category="restaurant"]').click();
        
        // 3. Enter phone number
        cy.get('#phone-input').type('+79991234567');
        cy.get('#phone-form').submit();
        
        // 4. Check success message
        cy.get('.success-message').should('be.visible');
        
        // 5. Check template loading
        cy.get('#template-container').should('be.visible');
        cy.get('.menu-item').should('have.length.at.least', 1);
    });
    
    it('should test admin panel', () => {
        cy.visit('/admin');
        
        // Check stats
        cy.get('#total-contacts').should('be.visible');
        
        // Test filters
        cy.get('#category-filter').select('restaurant');
        cy.get('button').contains('Применить фильтры').click();
        
        // Check table
        cy.get('table tbody tr').should('have.length.at.least', 1);
    });
});
```

### 4. Performance Testing (Тестирование производительности)

**Цель**: Проверка производительности системы под нагрузкой

**Инструменты**:
- Artillery
- k6
- Apache Bench (ab)

**Тестируемые метрики**:
- Время отклика API
- Пропускная способность
- Потребление памяти
- CPU usage

**Пример Artillery конфигурации**:

```yaml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100
scenarios:
  - name: "API load test"
    weight: 70
    flow:
      - get:
          url: "/api/contacts"
      - post:
          url: "/api/contacts"
          json:
            category: "restaurant"
            phone: "+79991234567"
  - name: "Health check"
    weight: 30
    flow:
      - get:
          url: "/health"
```

### 5. Security Testing (Тестирование безопасности)

**Цель**: Проверка уязвимостей и безопасных практик

**Что тестируем**:
- Валидацию входных данных
- Защиту от XSS атак
- Защиту от SQL инъекций
- CORS настройки

**Примеры тестов**:

```javascript
describe('Security tests', () => {
    test('should prevent XSS attacks', async () => {
        const maliciousData = {
            category: '<script>alert("xss")</script>',
            phone: '+79991234567'
        };
        
        const response = await request(app)
            .post('/api/contacts')
            .send(maliciousData);
        
        expect(response.status).toBe(400);
        expect(response.text).toContain('Invalid category');
    });
    
    test('should validate phone format', async () => {
        const invalidData = {
            category: 'restaurant',
            phone: 'not a phone'
        };
        
        const response = await request(app)
            .post('/api/contacts')
            .send(invalidData);
        
        expect(response.status).toBe(400);
    });
});
```

## Тестирование frontend

### 1. Component Testing

**Цель**: Проверка отдельных компонентов интерфейса

**Инструменты**:
- Jest
- React Testing Library (если используется React)
- Vue Test Utils (если используется Vue)

**Тестируемые компоненты**:
- Категории бизнеса
- Формы ввода
- Шаблоны мини-приложений
- Админ-панель

### 2. Visual Testing

**Цель**: Проверка визуального отображения

**Инструменты**:
- Percy
- Chromatic
- Storybook

**Что проверяем**:
- Корректное отображение на разных устройствах
- Соответствие дизайну
- Адаптивность

## Тестирование backend

### 1. API Testing

**Цель**: Проверка REST API

**Инструменты**:
- Postman
- Insomnia
- Newman (для автоматизации)

**Тестируемые endpoints**:
- `POST /api/contacts` - Создание контакта
- `GET /api/contacts` - Получение контактов
- `GET /api/contacts/category/:category` - Получение по категории
- `DELETE /api/contacts/:id` - Удаление контакта
- `GET /health` - Проверка состояния

### 2. Database Testing

**Цель**: Проверка работы с базой данных

**Что тестируем**:
- Сохранение данных
- Чтение данных
- Удаление данных
- Индексацию

## Автоматизация тестирования

### 1. CI/CD Pipeline

**GitHub Actions workflow**:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run test
      - run: npm run test:integration
      - run: npm run test:e2e
```

### 2. Pre-commit Hooks

**Husky configuration**:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:unit",
      "pre-push": "npm run test:integration"
    }
  }
}
```

## Тестовые данные

### 1. Test Fixtures

**Пример тестовых данных**:

```javascript
const testContacts = [
    {
        id: '1',
        category: 'restaurant',
        phone: '+79991234567',
        timestamp: '2023-01-01T10:00:00.000Z'
    },
    {
        id: '2',
        category: 'retail',
        phone: '+79991234568',
        timestamp: '2023-01-01T11:00:00.000Z'
    }
];
```

### 2. Test Database

**In-memory database для тестов**:

```javascript
// test-db.js
let testContacts = [];

function clear() {
    testContacts = [];
}

function insert(contact) {
    testContacts.push(contact);
    return contact;
}

function find() {
    return testContacts;
}

module.exports = {
    clear,
    insert,
    find
};
```

## Покрытие кода

### 1. Code Coverage

**Инструменты**:
- Istanbul (nyc)
- Jest coverage
- Coveralls

**Настройка Jest**:

```json
{
  "jest": {
    "collectCoverage": true,
    "coverageDirectory": "coverage",
    "coverageReporters": ["text", "lcov", "html"],
    "collectCoverageFrom": [
      "server.js",
      "bot.js",
      "public/app.js",
      "!node_modules/**",
      "!coverage/**"
    ]
  }
}
```

### 2. Coverage Thresholds

**Требования к покрытию**:

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Регрессионное тестирование

### 1. Smoke Tests

**Цель**: Быстрая проверка основных функций

**Тесты**:
- Запуск сервера
- Доступность API
- Работа основных маршрутов

### 2. Regression Test Suite

**Цель**: Проверка, что новые изменения не сломали существующий функционал

**Тесты**:
- Все unit тесты
- Все integration тесты
- Ключевые e2e тесты

## Load Testing

### 1. Stress Testing

**Цель**: Проверка поведения системы под высокой нагрузкой

**Сценарии**:
- Множество одновременных запросов
- Длительная нагрузка
- Пиковая нагрузка

### 2. Scalability Testing

**Цель**: Проверка масштабируемости системы

**Тесты**:
- Увеличение количества пользователей
- Увеличение объема данных
- Проверка производительности

## Best Practices

### 1. Test Organization

```
tests/
├── unit/
│   ├── api/
│   ├── utils/
│   └── models/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   ├── user-flows/
│   └── admin-flows/
└── fixtures/
    ├── contacts.json
    └── categories.json
```

### 2. Test Naming

**Правила именования**:
- Четкое описание тестируемой функции
- Формат: `should_[действие]_when_[условие]`
- Пример: `should_save_contact_when_valid_data_provided`

### 3. Test Data Management

**Принципы**:
- Использование фикстур
- Изоляция тестов
- Очистка после тестов
- Реалистичные тестовые данные

## Continuous Testing

### 1. Local Testing

**Команды**:
```bash
npm run test           # Unit tests
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage
npm run test:integration  # Integration tests
npm run test:e2e       # End-to-end tests
```

### 2. Remote Testing

**Сервисы**:
- GitHub Actions
- Travis CI
- Circle CI
- Jenkins

### 3. Test Reporting

**Форматы отчетов**:
- HTML coverage reports
- JUnit XML
- JSON reports
- Slack notifications

## Troubleshooting

### 1. Common Issues

**Проблемы и решения**:
- **Memory leaks**: Использовать proper cleanup
- **Flaky tests**: Увеличить таймауты, использовать stable selectors
- **Slow tests**: Оптимизировать setup/teardown, использовать mocking

### 2. Debugging

**Инструменты**:
- Chrome DevTools
- Node.js debugger
- Logging
- Test runners with debug mode

## Test Documentation

### 1. Test Plan

**Документация**:
- Описание тестируемых сценариев
- Приоритеты тестов
- Требования к окружению
- Критерии успеха

### 2. Test Reports

**Регулярная отчетность**:
- Ежедневные отчеты о тестировании
- Отчеты о покрытии кода
- Отчеты о производительности
- Отчеты об ошибках и багах