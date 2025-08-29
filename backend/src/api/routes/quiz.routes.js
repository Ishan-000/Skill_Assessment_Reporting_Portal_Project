const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quiz.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

router.post('/submit', verifyToken, quizController.submitQuiz);

module.exports = router;