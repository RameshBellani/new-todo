// backend/controllers/userController.js
exports.getUserProfile = (req, res) => {
    const userId = req.user.id;
  
    db.get(`SELECT name, email FROM users WHERE id = ?`, [userId], (err, user) => {
      if (err || !user) return res.status(400).send('User not found');
      res.json(user);
    });
  };
  
  exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    const hashedPassword = password ? bcrypt.hashSync(password, 8) : null;
  
    db.run(`UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?`, 
      [name, email, hashedPassword, userId], (err) => {
      if (err) return res.status(500).send('Error updating profile');
      res.sendStatus(200);
    });
  };
  