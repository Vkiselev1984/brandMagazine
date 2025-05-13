module.exports = function priceFilter(priceMin, priceMax) {
  let sql = '';
  let params = [];
  if (priceMin) {
    sql += 'price >= ?';
    params.push(Number(priceMin));
  }
  if (priceMax) {
    if (sql) sql += ' AND ';
    sql += 'price <= ?';
    params.push(Number(priceMax));
  }
  if (sql) return { sql: '(' + sql + ')', params };
  return { sql: '', params: [] };
};
