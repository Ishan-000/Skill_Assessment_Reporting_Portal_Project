const quizService = require('../services/quiz.service');

const submitQuiz = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await quizService.submit(userId, req.body);
        res.status(201).json({ message: 'Quiz submitted successfully', ...result });
    } catch (error) {
        next(error);
    }
};

module.exports = { submitQuiz };