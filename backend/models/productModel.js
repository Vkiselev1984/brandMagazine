const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const DB_PATH = 'C:/Users/kiselev/Desktop/Git/BrandShop/backend/db/adminBrandShop.db';

const brandFilter = require('../filters/brandFilter');
const categoryFilter = require('../filters/categoryFilter');
const trendFilter = require('../filters/trendFilter');
const sizeFilter = require('../filters/sizeFilter');
const priceFilter = require('../filters/priceFilter');
const searchFilter = require('../filters/searchFilter');

function getAllProducts(callback) {
  const db = new sqlite3.Database(DB_PATH);
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) console.error('DB error in getAllProducts:', err);
    db.close();
    callback(err, rows);
  });
}

function getProductById(id, callback) {
  const db = new sqlite3.Database(DB_PATH);
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) console.error('DB error in getProductById:', err);
    db.close();
    callback(err, row);
  });
}

function getAllProductsFiltered(filters, callback) {
  const db = new sqlite3.Database(DB_PATH);
  let whereClauses = [];
  let params = [];
  let countWhereClauses = [];
  let countParams = [];

  // category
  const category = categoryFilter(filters.category);
  if (category.sql) {
    whereClauses.push(category.sql);
    params.push(...category.params);
    countWhereClauses.push(category.sql);
    countParams.push(...category.params);
  }
  // brand
  const brand = brandFilter(filters.brand);
  if (brand.sql) {
    whereClauses.push(brand.sql);
    params.push(...brand.params);
    countWhereClauses.push(brand.sql);
    countParams.push(...brand.params);
  }
  // trend
  const trend = trendFilter(filters.trend);
  if (trend.sql) {
    whereClauses.push(trend.sql);
    params.push(...trend.params);
    countWhereClauses.push(trend.sql);
    countParams.push(...trend.params);
  }
  // size
  const size = sizeFilter(filters.size);
  if (size.sql) {
    whereClauses.push(size.sql);
    params.push(...size.params);
    countWhereClauses.push(size.sql);
    countParams.push(...size.params);
  }
  // price
  const price = priceFilter(filters.priceMin, filters.priceMax);
  if (price.sql) {
    whereClauses.push(price.sql);
    params.push(...price.params);
    countWhereClauses.push(price.sql);
    countParams.push(...price.params);
  }
  // search
  const search = searchFilter(filters.search);
  if (search.sql) {
    whereClauses.push(search.sql);
    params.push(...search.params);
    countWhereClauses.push(search.sql);
    countParams.push(...search.params);
  }

  let sql = 'SELECT * FROM products WHERE 1=1' + (whereClauses.length ? ' AND ' + whereClauses.join(' AND ') : '');
  let countSql = 'SELECT COUNT(*) as total FROM products WHERE 1=1' + (countWhereClauses.length ? ' AND ' + countWhereClauses.join(' AND ') : '');

  db.get(countSql, countParams, (err, row) => {
    if (err) {
      db.close();
      return callback(err);
    }
    const total = row.total;
    sql += ' LIMIT ? OFFSET ?';
    params.push(Number(filters.limit) || 9, ((Number(filters.page) || 1) - 1) * (Number(filters.limit) || 9));
    db.all(sql, params, (err2, products) => {
      db.close();
      if (err2) {
        return callback(err2);
      }
      callback(null, products, total);
    });
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  getAllProductsFiltered
};
