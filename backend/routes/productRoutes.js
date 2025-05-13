const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/api/products', productController.getAll);
router.get('/api/products/:id', productController.getById);

module.exports = router;
