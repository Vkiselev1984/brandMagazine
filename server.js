const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const app = express();
const port = 5500;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));
app.use(session({
    secret: 'brandshop_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- API для получения товаров ---
app.get('/products', (req, res) => {
    const db = new sqlite3.Database('users.db');
    let sql = 'SELECT * FROM products WHERE 1=1';
    let countSql = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
    const params = [];
    const countParams = [];

    // --- Фильтрация ---
    if (req.query.category) {
        sql += ' AND category = ?';
        countSql += ' AND category = ?';
        params.push(req.query.category);
        countParams.push(req.query.category);
    }
    if (req.query.brand) {
        sql += ' AND brand = ?';
        countSql += ' AND brand = ?';
        params.push(req.query.brand);
        countParams.push(req.query.brand);
    }
    // Тренды (несколько через запятую)
    if (req.query.trends) {
        const trends = req.query.trends.split(',').map(s => s.trim()).filter(Boolean);
        if (trends.length) {
            sql += ` AND (${trends.map(() => 'trend = ?').join(' OR ')})`;
            countSql += ` AND (${trends.map(() => 'trend = ?').join(' OR ')})`;
            params.push(...trends);
            countParams.push(...trends);
        }
    }
    // Размеры (несколько через запятую)
    if (req.query.sizes) {
        const sizes = req.query.sizes.split(',').map(s => s.trim()).filter(Boolean);
        if (sizes.length) {
            sql += ` AND (${sizes.map(() => 'size = ?').join(' OR ')})`;
            countSql += ` AND (${sizes.map(() => 'size = ?').join(' OR ')})`;
            params.push(...sizes);
            countParams.push(...sizes);
        }
    }
    if (req.query.search) {
        sql += ' AND (title LIKE ? OR description LIKE ?)';
        countSql += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${req.query.search}%`, `%${req.query.search}%`);
        countParams.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }

    // --- Пагинация ---
    const limit = parseInt(req.query.limit) || 9;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Сначала считаем total
    db.get(countSql, countParams, (err, row) => {
        if (err) {
            db.close();
            return res.status(500).json({ error: 'DB error (count)' });
        }
        const total = row.count;
        // Затем получаем товары
        db.all(sql, params, (err, products) => {
            db.close();
            if (err) {
                return res.status(500).json({ error: 'DB error (products)' });
            }
            res.json({ products, total });
        });
    });
});

// --- АВТОРИЗАЦИЯ ---
const bcrypt = require('bcryptjs');

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const db = new sqlite3.Database('users.db');
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        db.close();
        if (err) {
            return res.status(500).json({ errors: [{ msg: 'DB error' }] });
        }
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Неверный email или пароль' }] });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ errors: [{ msg: 'Ошибка сравнения паролей' }] });
            }
            if (!result) {
                return res.status(400).json({ errors: [{ msg: 'Неверный email или пароль' }] });
            }
            // Сохраняем userId в сессии для корзины
            req.session.userId = user.id;
            res.json({
                firstName: user.firstName || user.name || user.username,
                role: user.role || 'user'
            });
        });
    });
});

// --- КОРЗИНА ДЛЯ АВТОРИЗОВАННЫХ ПОЛЬЗОВАТЕЛЕЙ ---

// Получить корзину пользователя
app.get('/cart', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const db = new sqlite3.Database('users.db');
    db.all('SELECT * FROM user_cart WHERE user_id = ?', [userId], (err, rows) => {
        db.close();
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json(rows);
    });
});

// Добавить/обновить товар в корзине
app.post('/cart', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const { product_id, title, description, image, price, quantity } = req.body;
    const db = new sqlite3.Database('users.db');
    db.run(
        `INSERT INTO user_cart (user_id, product_id, title, description, image, price, quantity)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + ?`,
        [userId, product_id, title, description, image, price, quantity, quantity],
        function (err) {
            db.close();
            if (err) return res.status(500).json({ error: 'DB error' });
            res.json({ success: true });
        }
    );
});

// Уменьшить количество или удалить товар
app.post('/cart/decrease', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const { product_id } = req.body;
    const db = new sqlite3.Database('users.db');
    db.get('SELECT quantity FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, product_id], (err, row) => {
        if (err) { db.close(); return res.status(500).json({ error: 'DB error' }); }
        if (!row) { db.close(); return res.status(404).json({ error: 'Not found' }); }
        if (row.quantity > 1) {
            db.run('UPDATE user_cart SET quantity = quantity - 1 WHERE user_id = ? AND product_id = ?', [userId, product_id], function (err) {
                db.close();
                if (err) return res.status(500).json({ error: 'DB error' });
                res.json({ success: true });
            });
        } else {
            db.run('DELETE FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, product_id], function (err) {
                db.close();
                if (err) return res.status(500).json({ error: 'DB error' });
                res.json({ success: true });
            });
        }
    });
});

// Удалить товар из корзины
app.post('/cart/remove', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const { product_id } = req.body;
    const db = new sqlite3.Database('users.db');
    db.run('DELETE FROM user_cart WHERE user_id = ? AND product_id = ?', [userId, product_id], function (err) {
        db.close();
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ success: true });
    });
});

// Очистить корзину
app.post('/cart/clear', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Not authorized' });
    const db = new sqlite3.Database('users.db');
    db.run('DELETE FROM user_cart WHERE user_id = ?', [userId], function (err) {
        db.close();
        if (err) return res.status(500).json({ error: 'DB error' });
        res.json({ success: true });
    });
});

// ... (остальной код, другие маршруты)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
