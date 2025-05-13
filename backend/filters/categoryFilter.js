module.exports = function categoryFilter(category) {
  if (category && category !== 'all') {
    return { sql: 'category = ?', params: [category] };
  }
  return { sql: '', params: [] };
};
