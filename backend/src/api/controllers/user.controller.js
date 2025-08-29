const userService = require('../services/user.service');

const getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllUsers, getUserById };