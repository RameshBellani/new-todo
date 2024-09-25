const express = require('express');
const todoController = require('../controllers/todoController');
const authenticateToken = require('../middleware/authMiddleware'); // Import your middleware

const router = express.Router();

// Apply the middleware to the routes that require authentication
router.get('/', authenticateToken, todoController.getTodos);
router.post('/', authenticateToken, todoController.addTodo);
router.put('/:id', authenticateToken, todoController.updateTodo);
router.delete('/:id', authenticateToken, todoController.deleteTodo);

module.exports = router;
