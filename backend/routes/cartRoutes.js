const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/api/cart', cartController.getCart);
router.post('/api/cart/add', cartController.addToCart);
router.post('/api/cart/remove', cartController.removeFromCart);
router.post('/api/cart/update', cartController.updateCart);
router.post('/api/cart/clear', cartController.clearCart);

module.exports = router;
