// Скрипт для инициализации базы данных SQLite и создания таблицы пользователей
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('adminBrandShop.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        gender TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )`);
    console.log('Таблица users создана или уже существует.');
});

db.close();
