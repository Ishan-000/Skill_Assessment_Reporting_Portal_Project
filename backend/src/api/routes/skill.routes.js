const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const questionController = require('../controllers/question.controller'); // Import question controller
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { skillSchema } = require('../validators/skill.validator');

router.post('/', [verifyToken, isAdmin], validate(skillSchema), skillController.createSkill);
router.get('/', verifyToken, skillController.getAllSkills);

// Nested route to get questions for a specific skill
router.get('/:skillId/questions', verifyToken, questionController.getQuestionsBySkill);

module.exports = router;