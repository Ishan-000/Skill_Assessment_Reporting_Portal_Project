const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../config/db');
const AppError = require('../../utils/AppError');

const register = async (userData) => {
  const { username, email, password } = userData;

  const [existingUsers] = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
  if (existingUsers.length > 0) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
    [username, email, password_hash]
  );
  
  const [newUser] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [result.insertId]);
  return newUser[0];
};

const login = async (loginData) => {
  const { email, password } = loginData;

  const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (users.length === 0) {
    throw new AppError('Invalid credentials', 401);
  }

  const user = users[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
  return { token };
};

module.exports = { register, login };