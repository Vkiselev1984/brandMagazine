module.exports = function searchFilter(search) {
  if (search) {
    return {
      sql: '(title LIKE ? OR description LIKE ?)',
      params: [`%${search}%`, `%${search}%`]
    };
  }
  return { sql: '', params: [] };
};
