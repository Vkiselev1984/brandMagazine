const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const db = new sqlite3.Database('users.db');
const csvPath = path.join(__dirname, 'products.csv');

function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',').map(h => h.trim());
  return {
    headers,
    rows: lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i] || '';
      });
      return obj;
    })
  };
}

fs.readFile(csvPath, 'utf8', (err, data) => {
  if (err) return console.error('Ошибка чтения products.csv:', err);
  const { headers, rows: products } = parseCSV(data);
  if (!products.length) return console.error('Нет товаров для импорта!');
  console.log('Заголовки:', headers);
  console.log('Пример товара:', products[0]);

  db.serialize(() => {
    db.run('DELETE FROM products');
    const stmt = db.prepare('INSERT INTO products (category, brand, trend, size, price, title, description, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    let success = 0, fail = 0;
    products.forEach(p => {
      stmt.run(p.category, p.brand, p.trend, p.size, p.price, p.title, p.description, p.image, function (err) {
        if (err) {
          fail++;
          console.error('Ошибка вставки:', err, p);
        } else {
          success++;
        }
      });
    });
    stmt.finalize(() => {
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) {
          console.error('Ошибка подсчёта:', err);
        } else {
          console.log(`Импортировано товаров: ${success}, ошибок: ${fail}`);
          console.log(`Всего товаров в базе: ${row.count}`);
        }
        db.close();
      });
    });
  });
});
