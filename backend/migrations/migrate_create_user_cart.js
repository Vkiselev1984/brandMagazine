const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db/adminBrandShop.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user_cart (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            product_id INTEGER,
            title TEXT,
            description TEXT,
            image TEXT,
            price TEXT,
            quantity INTEGER,
            UNIQUE(user_id, product_id)
        )
    `, err => {
        if (err) {
            console.error('Ошибка создания таблицы user_cart:', err.message);
        } else {
            console.log('Таблица user_cart создана или уже существует.');
        }
        db.close();
    });
});