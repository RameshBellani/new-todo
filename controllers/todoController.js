// backend/controllers/todoController.js
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');

exports.getTodos = (req, res) => {
  const userId = req.user.id;
  
  db.all(`SELECT * FROM todos WHERE userId = ?`, [userId], (err, rows) => {
    if (err) {
      console.error('Error fetching todos:', err.message);
      return res.status(500).send('Error fetching todos');
    }
    res.json(rows);
  });
};

exports.addTodo = (req, res) => {
  const { task, status } = req.body;
  const todoId = uuidv4();
  const userId = req.user.id;

  db.run(`INSERT INTO todos (id, userId, task, status) VALUES (?, ?, ?, ?)`, 
    [todoId, userId, task, status], (err) => {
    if (err) {
      console.error('Error adding todo:', err.message);
      return res.status(500).send('Error adding todo');
    }
    res.json({ id: todoId, task, status });
  });
};

exports.updateTodo = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.run(`UPDATE todos SET status = ? WHERE id = ?`, [status, id], (err) => {
    if (err) return res.status(500).send('Error updating todo');
    res.sendStatus(200);
  });
};

exports.deleteTodo = (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM todos WHERE id = ?`, [id], (err) => {
    if (err) return res.status(500).send('Error deleting todo');
    res.sendStatus(200);
  });
};
