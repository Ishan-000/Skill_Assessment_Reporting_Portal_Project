const pool = require('../../config/db');
const AppError = require('../../utils/AppError');

const create = async (questionData) => {
    const { skill_id, question_text, options, correct_option_index } = questionData;
    const optionsJson = JSON.stringify(options);

    const [result] = await pool.query(
        'INSERT INTO questions (skill_id, question_text, options, correct_option_index) VALUES (?, ?, ?, ?)',
        [skill_id, question_text, optionsJson, correct_option_index]
    );
    return { id: result.insertId, ...questionData };
};

const findBySkill = async (skillId) => {
    // We don't send the correct_option_index to the client taking the quiz
    const [questions] = await pool.query(
        'SELECT id, skill_id, question_text, options FROM questions WHERE skill_id = ?',
        [skillId]
    );
    return questions;
};

const deleteById = async (id) => {
    const [result] = await pool.query('DELETE FROM questions WHERE id = ?', [id]);
    // The `affectedRows` property will be 1 if a row was deleted, 0 otherwise.
    return result.affectedRows;
};

module.exports = { create, findBySkill, deleteById };