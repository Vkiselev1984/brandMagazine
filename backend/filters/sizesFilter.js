module.exports = function sizesFilter(sizes) {
  if (sizes) {
    const arr = sizes.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length > 0) {
      return {
        sql: '(' + arr.map(() => 'sizes LIKE ?').join(' OR ') + ')',
        params: arr.map(val => `%${val}%`)
      };
    }
  }
  return { sql: '', params: [] };
};
