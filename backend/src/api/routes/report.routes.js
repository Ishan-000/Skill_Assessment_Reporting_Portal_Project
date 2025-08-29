const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/user/:userId', [verifyToken, isAdmin], reportController.getUserPerformance);
router.get('/me', verifyToken, reportController.getMyPerformance);
router.get('/skill-gap', [verifyToken, isAdmin], reportController.getSkillGapReport);

module.exports = router;