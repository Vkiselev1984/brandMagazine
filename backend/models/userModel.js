const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = 'C:/Users/kiselev/Desktop/Git/BrandShop/backend/db/adminBrandShop.db';

module.exports = {
  getUserByEmail(email, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) console.error('DB error in getUserByEmail:', err);
      db.close();
      callback(err, user);
    });
  },
  getUserById(id, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
      if (err) console.error('DB error in getUserById:', err);
      db.close();
      callback(err, user);
    });
  },
  createUser(data, callback) {
    const db = new sqlite3.Database(DB_PATH);
    const sql = 'INSERT INTO users (firstName, lastName, gender, email, password, role) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [data.firstName, data.lastName, data.gender, data.email, data.password, data.role || 'user'], function(err) {
      if (err) console.error('DB error in createUser:', err);
      db.close();
      callback(err, this ? this.lastID : null);
    });
  }
};
