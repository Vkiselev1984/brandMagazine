module.exports = function trendsFilter(trends) {
  if (trends) {
    const arr = trends.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length > 0) {
      return {
        sql: '(' + arr.map(() => 'trends LIKE ?').join(' OR ') + ')',
        params: arr.map(val => `%${val}%`)
      };
    }
  }
  return { sql: '', params: [] };
};
