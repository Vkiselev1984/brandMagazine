const tableModel = require('../models/tableModel');

module.exports = {
  showTables(req, res) {
    tableModel.getTables((err, tables) => {
      if (err) return res.status(500).send('DB error');
      res.render('db-index', { tables });
    });
  },

  showTable(req, res) {
    const table = req.params.table;
    tableModel.getTableRows(table, (err, rows) => {
      if (err) return res.status(500).send('DB error');
      tableModel.getTableColumns(table, (err2, columns) => {
        if (err2) return res.status(500).send('DB error');
        res.render('db-table', { table, rows, columns });
      });
    });
  },

  deleteRow(req, res) {
    const table = req.params.table;
    const id = req.params.id;
    tableModel.deleteRow(table, id, (err) => {
      if (err) return res.status(500).send('DB error: ' + err.message);
      res.redirect(`/admin/table/${table}`);
    });
  },

  showAddForm(req, res) {
    const table = req.params.table;
    tableModel.getTableColumns(table, (err, columns) => {
      if (err) return res.status(500).send('DB error');
      res.render('db-form', { table, columns, row: null });
    });
  },

  addRow(req, res) {
    const table = req.params.table;
    const data = req.body;
    tableModel.getTableColumns(table, (err, columns) => {
      if (err) return res.status(500).send('DB error');
      const cols = columns.filter(col => col.name !== 'id').map(col => col.name);
      tableModel.addRow(table, data, cols, (err2) => {
        if (err2) return res.status(500).send('DB error: ' + err2.message);
        res.redirect(`/admin/table/${table}`);
      });
    });
  },

  showEditForm(req, res) {
    const table = req.params.table;
    const id = req.params.id;
    tableModel.getTableColumns(table, (err, columns) => {
      if (err) return res.status(500).send('DB error');
      tableModel.getRowById(table, id, (err2, row) => {
        if (err2) return res.status(500).send('DB error');
        res.render('db-form', { table, columns, row });
      });
    });
  },

  editRow(req, res) {
    const table = req.params.table;
    const id = req.params.id;
    const data = req.body;
    tableModel.getTableColumns(table, (err, columns) => {
      if (err) return res.status(500).send('DB error');
      const cols = columns.filter(col => col.name !== 'id').map(col => col.name);
      tableModel.updateRow(table, data, cols, id, (err2) => {
        if (err2) return res.status(500).send('DB error: ' + err2.message);
        res.redirect(`/admin/table/${table}`);
      });
    });
  }
};
