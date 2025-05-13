const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend/public')));
app.use(session({
    secret: 'brandshop_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// API routes
app.use(require('./routes/productRoutes'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/cartRoutes'));

// Админка (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'admin-panel/views'));
app.use('/admin-style.css', express.static(path.join(__dirname, 'admin-panel/views', 'admin-style.css')));
app.use('/', require('./db/routes/adminRoutes'));

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
