const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('adminBrandShop.db');
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS promotions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      discount REAL,
      start_date TEXT,
      end_date TEXT,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, err => {
    if (err) {
      console.error('Ошибка создания таблицы promotions:', err.message);
    } else {
      console.log('Таблица promotions создана или уже существует.');
    }
    db.close();
  });
});
