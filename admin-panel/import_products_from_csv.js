const fs = require('fs');
const csv = require('csv-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('adminBrandShop.db');
const csvPath = path.join(__dirname, '../products.csv');

db.serialize(() => {
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
      db.run(
        `INSERT INTO products (category, brand, trend, size, price, title, description, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.category,
          row.brand,
          row.trend,
          row.size,
          parseFloat(row.price),
          row.title,
          row.description,
          row.image
        ]
      );
    })
    .on('end', () => {
      console.log('Импорт товаров завершён');
      db.close();
    });
});
