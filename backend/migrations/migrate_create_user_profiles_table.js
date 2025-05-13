const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../backend/db/adminBrandShop.db');
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE,
      registration_date TEXT,
      total_spent REAL DEFAULT 0,
      last_purchase_date TEXT,
      current_discount REAL DEFAULT 0,
      checks TEXT,
      promotion_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(promotion_id) REFERENCES promotions(id)
    )
  `, err => {
    if (err) {
      console.error('Ошибка создания таблицы user_profiles:', err.message);
    } else {
      console.log('Таблица user_profiles создана или уже существует.');
    }
    db.close();
  });
});
