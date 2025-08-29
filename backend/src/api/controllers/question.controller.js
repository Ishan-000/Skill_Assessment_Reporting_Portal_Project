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

module.exports = { createQuestion, getQuestionsBySkill };