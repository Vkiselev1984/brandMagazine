const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');

// Главная страница админки: список таблиц
router.get('/admin', tableController.showTables);
// Просмотр содержимого таблицы
router.get('/admin/table/:table', tableController.showTable);
// Удаление строки
router.post('/admin/table/:table/delete/:id', tableController.deleteRow);
// Форма добавления
router.get('/admin/table/:table/add', tableController.showAddForm);
// Обработка добавления
router.post('/admin/table/:table/add', tableController.addRow);
// Форма редактирования
router.get('/admin/table/:table/edit/:id', tableController.showEditForm);
// Обработка редактирования
router.post('/admin/table/:table/edit/:id', tableController.editRow);

module.exports = router;
