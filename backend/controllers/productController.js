const productModel = require('../models/productModel');

module.exports = {
  getAll(req, res) {
    // Получаем фильтры из query
    const { category, brand, trend, size, priceMin, priceMax, search, page = 1, limit = 9 } = req.query;
    productModel.getAllProductsFiltered(
      { category, brand, trend, size, priceMin, priceMax, search, page: Number(page), limit: Number(limit) },
      (err, products, total) => {
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ products, total });
      }
    );
  },
  getById(req, res) {
    const id = req.params.id;
    productModel.getProductById(id, (err, product) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (!product) return res.status(404).json({ error: 'Not found' });
      res.json(product);
    });
  }
};
