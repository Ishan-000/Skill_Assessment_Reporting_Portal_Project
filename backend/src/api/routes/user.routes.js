const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/', [verifyToken, isAdmin], userController.getAllUsers);
router.get('/:id', [verifyToken, isAdmin], userController.getUserById);

module.exports = router;