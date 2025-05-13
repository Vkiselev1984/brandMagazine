module.exports = function brandFilter(brand) {
  if (brand && brand !== 'all') {
    return { sql: 'brand = ?', params: [brand] };
  }
  return { sql: '', params: [] };
};
