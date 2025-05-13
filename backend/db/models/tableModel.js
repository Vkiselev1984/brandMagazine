const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = 'C:/Users/kiselev/Desktop/Git/BrandShop/backend/db/adminBrandShop.db';

module.exports = {
  getTables(callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
      db.close();
      callback(err, tables);
    });
  },

  getTableRows(table, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.all(`SELECT * FROM ${table}`, (err, rows) => {
      db.close();
      callback(err, rows);
    });
  },

  deleteRow(table, id, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
      db.close();
      callback(err);
    });
  },

  getTableColumns(table, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.all(`PRAGMA table_info(${table})`, (err, columns) => {
      db.close();
      callback(err, columns);
    });
  },

  addRow(table, data, columns, callback) {
    const db = new sqlite3.Database(DB_PATH);
    const placeholders = columns.map(() => '?').join(',');
    const sql = `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`;
    db.run(sql, columns.map(col => data[col]), function(err) {
      db.close();
      callback(err);
    });
  },

  getRowById(table, id, callback) {
    const db = new sqlite3.Database(DB_PATH);
    db.get(`SELECT * FROM ${table} WHERE id = ?`, [id], (err, row) => {
      db.close();
      callback(err, row);
    });
  },

  updateRow(table, data, columns, id, callback) {
    const db = new sqlite3.Database(DB_PATH);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    db.run(sql, [...columns.map(col => data[col]), id], function(err) {
      db.close();
      callback(err);
    });
  }
};
