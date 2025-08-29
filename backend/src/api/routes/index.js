const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const skillRoutes = require('./skill.routes');
const questionRoutes = require('./question.routes');
const quizRoutes = require('./quiz.routes');
const reportRoutes = require('./report.routes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/questions', questionRoutes);
router.use('/quizzes', quizRoutes);
router.use('/reports', reportRoutes);

module.exports = router;