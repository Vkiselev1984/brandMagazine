const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('adminBrandShop.db');

db.serialize(() => {
  db.run(`
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
  `, (err) => {
    if (err) throw err;
    console.log('Таблица products создана');
    db.close();
  });
});
