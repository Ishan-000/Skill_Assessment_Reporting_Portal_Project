const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { questionSchema } = require('../validators/question.validator');

// Admin route to create a question
router.post('/', [verifyToken, isAdmin], validate(questionSchema), questionController.createQuestion);

// User route to get questions for a quiz (Note: The route is on the skill, which is more RESTful)
// We will move this logic to skill.routes.js for better structure
// GET /api/skills/:skillId/questions

module.exports = router;