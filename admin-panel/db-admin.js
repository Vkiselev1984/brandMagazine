const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

const DB_PATH = path.join(__dirname, 'adminBrandShop.db');

// Главная страница админки: список таблиц
app.get('/admin', (req, res) => {
    const db = new sqlite3.Database(DB_PATH);
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
        db.close();
        if (err) return res.status(500).send('DB error');
        res.render('db-index', { tables });
    });
});

// Просмотр содержимого таблицы
app.get('/admin/table/:table', (req, res) => {
    const table = req.params.table;
    const db = new sqlite3.Database(DB_PATH);
    db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
            db.close();
            return res.status(500).send('DB error: ' + err.message);
        }
        db.all(`PRAGMA table_info(${table})`, (err2, columns) => {
            db.close();
            if (err2) return res.status(500).send('DB error: ' + err2.message);
            res.render('db-table', { table, columns, rows });
        });
    });
});

// Удаление строки
app.post('/admin/table/:table/delete/:id', (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    const db = new sqlite3.Database(DB_PATH);
    db.run(`DELETE FROM ${table} WHERE id = ?`, [id], function(err) {
        db.close();
        if (err) return res.status(500).send('DB error: ' + err.message);
        res.redirect(`/admin/table/${table}`);
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`DB Admin running at http://localhost:${PORT}/admin`);
});
