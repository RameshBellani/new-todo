const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
require('dotenv').config();

// User Signup
exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  const userId = uuidv4();

  db.run(`INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)`, 
    [userId, name, email, hashedPassword], (err) => {
    if (err) {
      console.error('Error registering user:', err.message); // Log the error message
      return res.status(500).send('Error registering user');
    }
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};

// User Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('All fields are required');
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) {
      console.error('User not found:', err);
      return res.status(400).send('User not found');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).send('Invalid password');
    }
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};
