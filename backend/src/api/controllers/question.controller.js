const questionService = require('../services/question.service');

const createQuestion = async (req, res, next) => {
    try {
        const question = await questionService.create(req.body);
        res.status(201).json(question);
    } catch (error) {
        next(error);
    }
};

const getQuestionsBySkill = async (req, res, next) => {
    try {
        const questions = await questionService.findBySkill(req.params.skillId);
        res.json(questions);
    } catch (error) {
        next(error);
    }
};
const deleteQuestion = async (req, res, next) => {
    try {
        const affectedRows = await questionService.deleteById(req.params.id);
        if (affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        // Use 204 No Content for successful deletions, as there's no body to return.
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { createQuestion, getQuestionsBySkill ,deleteQuestion };