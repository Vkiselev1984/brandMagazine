const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = path.join(__dirname, '../db/adminBrandShop.db');

module.exports = {
  getCart(userId, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.all(
      `SELECT user_cart.product_id, user_cart.quantity, products.title, products.price, products.image, products.description
       FROM user_cart
       JOIN products ON user_cart.product_id = products.id
       WHERE user_cart.user_id = ?`,
      [userId],
      (err, rows) => {
        db.close();
        if (err) console.error('DB error in getCart:', err);
        callback(err, rows);
      }
    );
  },
  addToCart(userId, product, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      `INSERT INTO user_cart (user_id, product_id, title, price, image, description, quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, product.product_id, product.title, product.price, product.image, product.description, product.quantity],
      function(err) {
        db.close();
        callback(err);
      }
    );
  },
  removeFromCart(userId, productId, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'DELETE FROM user_cart WHERE user_id = ? AND product_id = ?',
      [userId, productId],
      function(err) {
        db.close();
        callback(err);
      }
    );
  },
  updateCart(userId, productId, quantity, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.run(
      'UPDATE user_cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, productId],
      function(err) {
        db.close();
        callback(err);
      }
    );
  },
  clearCart(userId, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.run('DELETE FROM user_cart WHERE user_id = ?', [userId], function(err) {
      db.close();
      if (err) console.error('DB error in clearCart:', err);
      callback(err);
    });
  }
};
