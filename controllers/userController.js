const bcrypt = require('bcrypt');
const db = require('../config/database'); // Ensure you have your database configuration here

// Get user profile
exports.getUserProfile = (req, res) => {
    const userId = req.user.id;

    db.get(`SELECT name, email FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err) return res.status(500).json({ error: 'Internal server error' });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    });
};

// Update user profile
exports.updateUserProfile = (req, res) => {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    
    // Initialize the update fields
    const fields = [name, email];
    let sql = `UPDATE users SET name = ?, email = ?`;

    // Check if password is provided
    if (password) {
        const hashedPassword = bcrypt.hashSync(password, 8);
        sql += `, password = ?`;
        fields.push(hashedPassword);
    }

    sql += ` WHERE id = ?`;
    fields.push(userId);

    db.run(sql, fields, function(err) {
        if (err) return res.status(500).json({ error: 'Error updating profile' });
        res.status(200).json({ message: 'Profile updated successfully' });
    });
};
