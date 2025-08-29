const pool = require('../../config/db');
const AppError = require('../../utils/AppError');

const create = async (skillData) => {
    const { name, description } = skillData;
    const [result] = await pool.query(
        'INSERT INTO skills (name, description) VALUES (?, ?)',
        [name, description]
    );
    return { id: result.insertId, ...skillData };
};

const findAll = async () => {
    const [skills] = await pool.query('SELECT * FROM skills ORDER BY name ASC');
    return skills;
};

module.exports = { create, findAll };