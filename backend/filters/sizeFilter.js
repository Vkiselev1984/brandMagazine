module.exports = function sizeFilter(size) {
  if (size) {
    const arr = size.split(',').map(s => s.trim()).filter(Boolean);
    if (arr.length > 0) {
      return {
        sql: '(' + arr.map(() => 'size LIKE ?').join(' OR ') + ')',
        params: arr.map(val => `%${val}%`)
      };
    }
  }
  return { sql: '', params: [] };
};
