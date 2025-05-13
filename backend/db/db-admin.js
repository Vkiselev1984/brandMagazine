const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Раздача статики для стилей админки
app.use('/admin-style.css', express.static(path.join(__dirname, 'views', 'admin-style.css')));

// Подключение маршрутов MVC
const adminRoutes = require('./routes/adminRoutes');
app.use('/', adminRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`DB Admin running at http://localhost:${PORT}/admin`);
});
