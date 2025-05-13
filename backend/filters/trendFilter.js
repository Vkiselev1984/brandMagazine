module.exports = function trendFilter(trend) {
  if (trend) {
    const arr = trend.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length > 0) {
      return {
        sql: '(' + arr.map(() => 'trend LIKE ?').join(' OR ') + ')',
        params: arr.map(val => `%${val}%`)
      };
    }
  }
  return { sql: '', params: [] };
};
