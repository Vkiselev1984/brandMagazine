const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');

module.exports = {
  register(req, res) {
    const { firstName, lastName, gender, email, password } = req.body;
    if (!firstName || !email || !password) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }
    userModel.getUserByEmail(email, (err, user) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (user) return res.status(400).json({ error: 'Пользователь уже существует' });
      const hash = bcrypt.hashSync(password, 10);
      userModel.createUser({ firstName, lastName, gender, email, password: hash }, (err2, id) => {
        if (err2) return res.status(500).json({ error: 'DB error' });
        res.json({ success: true, id });
      });
    });
  },
  login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль' });
    }
    userModel.getUserByEmail(email, (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: 'Неверный email или пароль' });
      }
      bcrypt.compare(password, user.password, (err2, result) => {
        if (result) {
          // Не отправляй пароль клиенту!
          const { password, ...userData } = user;
          req.session.userId = user.id;
          console.log('LOGIN: session.userId set to', req.session.userId);
          res.json(userData);
        } else {
          res.status(401).json({ error: 'Неверный email или пароль' });
        }
      });
    });
    // Логирование для отладки
    console.log('LOGIN: session.userId set to', req.session.userId);
  },
  getMe(req, res) {
    console.log('GETME: session.userId =', req.session.userId);
    if (!req.session.userId) return res.json({ role: null });
    userModel.getUserById(req.session.userId, (err, user) => {
      if (err || !user) return res.json({ role: null });
      res.json({ firstName: user.firstName || user.name || user.username, role: user.role || 'user' });
    });
  }
};
