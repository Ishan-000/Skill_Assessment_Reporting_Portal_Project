const skillService = require('../services/skill.service');

const createSkill = async (req, res, next) => {
    try {
        const skill = await skillService.create(req.body);
        res.status(201).json(skill);
    } catch (error) {
        next(error);
    }
};

const getAllSkills = async (req, res, next) => {
    try {
        const skills = await skillService.findAll();
        res.json(skills);
    } catch (error) {
        next(error);
    }
};

module.exports = { createSkill, getAllSkills };