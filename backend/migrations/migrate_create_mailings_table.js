const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../backend/db/adminBrandShop.db');
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS mailings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content TEXT,
      discount REAL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      user_id INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `, err => {
    if (err) {
      console.error('Ошибка создания таблицы mailings:', err.message);
    } else {
      console.log('Таблица mailings создана или уже существует.');
    }
    db.close();
  });
});
