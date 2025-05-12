// Скрипт для добавления поля role и создания тестового админа
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const db = new sqlite3.Database('adminBrandShop.db');

const adminEmail = 'admin@brandshop.local';
const adminPassword = 'admin123';
const adminRole = 'admin';

// Добавляем поле role, если его нет
const alterTable = `ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`;

db.serialize(() => {
    db.run(alterTable, err => {
        if (err && !/duplicate column name/i.test(err.message)) {
            console.error('Ошибка при добавлении поля role:', err.message);
        } else {
            console.log('Поле role добавлено или уже существует.');
        }
    });

    // Проверяем, есть ли уже админ
    db.get('SELECT * FROM users WHERE email = ?', [adminEmail], (err, row) => {
        if (err) {
            console.error('Ошибка поиска админа:', err.message);
            db.close();
            return;
        }
        if (row) {
            console.log('Админ уже существует.');
            db.close();
        } else {
            bcrypt.hash(adminPassword, 10, (err, hash) => {
                if (err) {
                    console.error('Ошибка хеширования пароля:', err.message);
                    db.close();
                    return;
                }
                db.run(
                    'INSERT INTO users (firstName, lastName, gender, email, password, role) VALUES (?, ?, ?, ?, ?, ?)',
                    ['Admin', 'Admin', 'other', adminEmail, hash, adminRole],
                    function (err) {
                        if (err) {
                            console.error('Ошибка создания админа:', err.message);
                        } else {
                            console.log('Тестовый админ создан:', adminEmail, adminPassword);
                        }
                        db.close();
                    }
                );
            });
        }
    });
});
