# BrandShop

BrandShop — это современный интернет-магазин с фильтрацией товаров, авторизацией, ролями пользователей, корзиной и админ-панелью. Проект построен на Node.js (Express, SQLite) и современном фронтенде (Vite, Vanilla JS). Подходит для учебных и коммерческих задач.

---

## Содержание
- [Описание](#описание)
- [Структура проекта](#структура-проекта)
- [Технологии](#технологии)
- [Запуск проекта](#запуск-проекта)
- [Архитектура и принципы работы](#архитектура-и-принципы-работы)
- [Функционал](#функционал)
  - [Фильтрация товаров](#фильтрация-товаров)
  - [Пагинация](#пагинация)
  - [Авторизация и роли](#авторизация-и-роли)
  - [Админ-панель](#админ-панель)
  - [Корзина](#корзина)
  - [Работа с базой данных](#работа-с-базой-данных)
- [Примеры кода и сценарии](#примеры-кода-и-сценарии)
  - [Пример фильтрации на backend](#пример-фильтрации-на-backend)
  - [Пример фильтрации на frontend](#пример-фильтрации-на-frontend)
  - [Пример авторизации](#пример-авторизации)
  - [Пример работы с корзиной](#пример-работы-с-корзиной)
  - [Пример работы с админ-панелью](#пример-работы-с-админ-панелью)
  - [Пример миграции и наполнения БД](#пример-миграции-и-наполнения-бд)
- [Расширение и доработка](#расширение-и-доработка)
- [FAQ и советы](#faq-и-советы)
- [Контакты и поддержка](#контакты-и-поддержка)

---

## Описание
BrandShop — это учебный и демонстрационный интернет-магазин, реализующий:
- Модульную фильтрацию товаров по множеству критериев (категория, бренд, тренд, размер, цена, поиск)
- Пагинацию и динамическую подгрузку товаров
- Авторизацию, регистрацию, роли пользователей (user/admin)
- Админ-панель для управления товарами, пользователями, рассылками, акциями
- Корзину для гостей и авторизованных пользователей
- Современный UI на чистом JS (Vite, ES6+)

---

## Структура проекта
```
BrandShop/
├── backend/
│   ├── app.js                # Точка входа backend
│   ├── controllers/          # Контроллеры (логика API)
│   ├── filters/              # Модули фильтрации для товаров
│   ├── migrations/           # Скрипты для создания и наполнения БД
│   ├── models/               # Модели для работы с БД
│   ├── routes/               # Определение API-роутов
│   └── db/                   # Файл базы данных SQLite
├── frontend/
│   ├── index.html            # Главная страница
│   ├── catalog.html          # Каталог товаров
│   ├── js/                   # JS-модули (filter.js, cart-popup.js, ...)
│   ├── css/                  # Стили
│   ├── img/                  # Изображения
│   └── ...
├── package.json              # Зависимости frontend
├── Readme.md                 # Описание проекта
└── ...
```

---

## Технологии
- **Backend:** Node.js, Express, SQLite, express-session, CORS
- **Frontend:** Vite, Vanilla JS (ES6+), Fetch API, localStorage
- **База данных:** SQLite (таблицы: users, products, user_cart, promotions, mailings, user_profiles)
- **Миграции:** JS-скрипты для создания и наполнения БД

---

## Запуск проекта

### 1. Установка зависимостей
Перейдите в папки backend и frontend и установите зависимости:
```bash
cd backend
npm install
cd ../frontend
npm install
```

### 2. Инициализация базы данных
Выполните миграции для создания таблиц и наполнения товаров:
```bash
cd ../backend
node migrations/init_db.js
node migrations/migrate_create_products_table.js
node migrations/import_products_from_csv.js
node migrations/migrate_add_role_and_admin.js
```

### 3. Запуск backend
```bash
cd backend
npm start
```

### 4. Запуск frontend
```bash
cd ../frontend
npm run dev
```

- Backend по умолчанию на http://localhost:3001
- Frontend (Vite) на http://localhost:5173

---

## Архитектура и принципы работы

### Backend (Node.js/Express)
- Все API-эндпоинты начинаются с `/api/` (например, `/api/products`, `/api/login`, `/api/cart`)
- Фильтрация реализована через отдельные модули-фильтры (каждый фильтр — отдельный файл)
- Контроллеры отвечают за обработку запросов, валидацию, возврат данных
- Модели инкапсулируют работу с БД
- Сессии и авторизация через express-session (cookie-based)
- Роли пользователей (user/admin) хранятся в таблице users

### Frontend (Vite, Vanilla JS)
- Все запросы к API через fetch с credentials: 'include' для авторизации
- Фильтрация товаров, пагинация, корзина, авторизация — отдельные JS-модули
- Корзина для гостей — в localStorage, для авторизованных — на сервере
- Динамическое отображение админ-панели только для admin

---

## Функционал

### Фильтрация товаров
- Фильтрация по категории, бренду, тренду, размеру, цене, поиску
- Любые фильтры можно комбинировать (AND)
- Фильтрация работает без обязательного выбора категории или бренда
- Пример запроса:
```js
fetch('/api/products?category=Bags&brand=BagIndustries&trend=Color&size=M&priceMin=20&priceMax=30')
```
- Пример SQL-запроса, который формируется на сервере:
```sql
SELECT * FROM products WHERE 1=1
  AND category = ?
  AND brand = ?
  AND (trend LIKE ? OR trend LIKE ?)
  AND (size LIKE ? OR size LIKE ?)
  AND price >= ? AND price <= ?
  AND (title LIKE ? OR description LIKE ?)
LIMIT ? OFFSET ?
```

### Пагинация
- Главная страница: 3 товара
- Каталог: 9 товаров на страницу, кнопки страниц
- Параметры page и limit передаются в API

### Авторизация и роли
- Регистрация и вход через email и пароль
- Роль пользователя определяется в базе (user/admin)
- Для админов доступна админ-панель
- Пример запроса:
```js
fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
```

### Админ-панель
- Доступна только для пользователей с ролью admin
- Позволяет управлять товарами, пользователями, рассылками, акциями
- Проверка роли через API:
```js
fetch('/api/me', { credentials: 'include' })
```
- Пример динамического рендеринга панели:
```js
if (data.role === 'admin') {
  // показать админ-панель
}
```

### Корзина
- Для неавторизованных — хранится в localStorage
- Для авторизованных — хранится на сервере (user_cart)
- Синхронизация корзины при входе
- Пример добавления товара:
```js
fetch('/api/cart/add', { method: 'POST', body: JSON.stringify(product), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
```

### Работа с базой данных
- SQLite, таблицы: users, products, user_cart, promotions, mailings, user_profiles
- Миграции для создания и наполнения БД
- Пример создания таблицы:
```js
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT,
  brand TEXT,
  trend TEXT,
  size TEXT,
  price REAL,
  title TEXT,
  description TEXT,
  image TEXT
)
```

---

## Примеры кода и сценарии

### Пример фильтрации на backend (filters/brandFilter.js)
```js
module.exports = function brandFilter(brand) {
  if (brand && brand !== 'all') {
    return { sql: 'brand = ?', params: [brand] };
  }
  return { sql: '', params: [] };
};
```

### Пример фильтрации по тренду (filters/trendFilter.js)
```js
module.exports = function trendFilter(trend) {
  if (trend) {
    const arr = trend.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length > 0) {
      return {
        sql: '(' + arr.map(() => 'trend LIKE ?').join(' OR ') + ')',
        params: arr.map(val => `%${val}%`)
      };
    }
  }
  return { sql: '', params: [] };
};
```

### Пример фильтрации по цене (filters/priceFilter.js)
```js
module.exports = function priceFilter(priceMin, priceMax) {
  let sql = '';
  let params = [];
  if (priceMin) {
    sql += 'price >= ?';
    params.push(Number(priceMin));
  }
  if (priceMax) {
    if (sql) sql += ' AND ';
    sql += 'price <= ?';
    params.push(Number(priceMax));
  }
  if (sql) return { sql: '(' + sql + ')', params };
  return { sql: '', params: [] };
};
```

### Пример динамической фильтрации (models/productModel.js)
```js
const brand = brandFilter(filters.brand);
if (brand.sql) {
  whereClauses.push(brand.sql);
  params.push(...brand.params);
}
const trend = trendFilter(filters.trend);
if (trend.sql) {
  whereClauses.push(trend.sql);
  params.push(...trend.params);
}
const price = priceFilter(filters.priceMin, filters.priceMax);
if (price.sql) {
  whereClauses.push(price.sql);
  params.push(...price.params);
}
// ... остальные фильтры
let sql = 'SELECT * FROM products WHERE 1=1' + (whereClauses.length ? ' AND ' + whereClauses.join(' AND ') : '');
```

### Пример фильтрации на frontend (filter.js)
```js
const filters = {};
if (category) filters.category = category;
if (brand) filters.brand = brand;
if (trends.length > 0) filters.trend = trends.join(',');
if (sizes.length > 0) filters.size = sizes.join(',');
if (search) filters.search = search;
if (priceMinInput && priceMinInput.value) filters.priceMin = priceMinInput.value;
if (priceMaxInput && priceMaxInput.value) filters.priceMax = priceMaxInput.value;
filters.page = currentPage;
filters.limit = currentLimit;
```

### Пример авторизации (frontend/authorization.js)
```js
fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
  credentials: 'include'
})
  .then(res => res.json())
  .then(user => {
    if (user.role === 'admin') {
      // показать админ-панель
    }
  });
```

### Пример работы с корзиной (frontend/cart-popup.js)
```js
fetch('/api/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(product),
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      // обновить счетчик корзины
    }
  });
```

### Пример работы с админ-панелью (frontend/script.js)
```js
fetch('/api/me', { credentials: 'include' })
  .then(res => res.json())
  .then(data => {
    if (data.role === 'admin') {
      // динамически добавить элементы админ-панели
    }
  });
```

### Пример миграции и наполнения БД (backend/migrations/import_products_from_csv.js)
```js
const stmt = db.prepare('INSERT INTO products (category, brand, trend, size, price, title, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
products.forEach(p => {
  stmt.run(p.category, p.brand, p.trend, p.size, p.price, p.title, p.description, p.image);
});
```

---

## Расширение и доработка
- Добавьте новые фильтры, создав модуль в backend/filters и подключив его в productModel.js
- Для новых полей в товарах — добавьте их в миграции и в фильтры
- Для новых страниц — создайте HTML и подключите нужные JS-модули
- Для интеграции с внешними сервисами — добавьте новые роуты и контроллеры
- Для сложных фильтров (например, диапазон дат, сортировка) — создайте отдельные фильтры и параметры

---

## FAQ и советы
- **Вопрос:** Почему фильтрация не работает по нескольким критериям?
  **Ответ:** Проверьте, что параметры фильтрации совпадают с названиями полей в базе и фильтрах backend.
- **Вопрос:** Как добавить новый фильтр?
  **Ответ:** Создайте файл-фильтр в backend/filters, подключите его в productModel.js, добавьте параметр на фронте.
- **Вопрос:** Как сделать фильтрацию по диапазону?
  **Ответ:** Используйте min/max параметры и соответствующий фильтр (см. priceFilter.js).
- **Вопрос:** Как добавить нового админа?
  **Ответ:** Добавьте пользователя с role = 'admin' в таблицу users (см. миграции).
- **Вопрос:** Как развернуть проект на сервере?
  **Ответ:** Используйте pm2 или systemd для backend, любой статический сервер для frontend (например, nginx).

---

## Контакты и поддержка
- Вопросы и предложения: создайте issue или обратитесь к автору проекта.
- Для коммерческой поддержки — пишите на email, указанный в профиле.
