const cartModel = require('../models/cartModel');

module.exports = {
  getCart(req, res) {
    if (!req.session.userId) return res.json({ items: [] });
    cartModel.getCart(req.session.userId, (err, items) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ items });
    });
  },
  addToCart(req, res) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authorized' });
    cartModel.addToCart(req.session.userId, req.body, (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  },
  removeFromCart(req, res) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authorized' });
    cartModel.removeFromCart(req.session.userId, req.body.product_id, (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  },
  updateCart(req, res) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authorized' });
    cartModel.updateCart(req.session.userId, req.body.product_id, req.body.quantity, (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  },
  clearCart(req, res) {
    if (!req.session.userId) return res.status(401).json({ error: 'Not authorized' });
    cartModel.clearCart(req.session.userId, (err) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      res.json({ success: true });
    });
  }
};
