const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../db/adminBrandShop.db');

db.serialize(() => {
  console.log('--- Структура таблицы products ---');
  db.all('PRAGMA table_info(products);', [], (err, columns) => {
    if (err) return console.error('Ошибка:', err);
    columns.forEach(col => {
      console.log(`${col.cid}: ${col.name} (${col.type})`);
    });
    console.log('\n--- Первые 3 товара ---');
    db.all('SELECT * FROM products LIMIT 3;', [], (err, rows) => {
      if (err) return console.error('Ошибка:', err);
      rows.forEach(row => {
        console.log(row);
      });
      db.close();
    });
  });
});
