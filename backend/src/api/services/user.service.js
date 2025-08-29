const pool = require('../../config/db');

const findAll = async () => {
    const [users] = await pool.query('SELECT id, username, email, role, created_at FROM users');
    return users;
};

const findById = async (id) => {
    const [users] = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [id]);
    return users[0];
};

module.exports = { findAll, findById };