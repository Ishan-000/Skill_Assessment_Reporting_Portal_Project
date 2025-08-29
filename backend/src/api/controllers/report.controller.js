const reportService = require('../services/report.service');

const getUserPerformance = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const report = await reportService.fetchUserPerformance(userId);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

const getMyPerformance = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const report = await reportService.fetchUserPerformance(userId);
      res.json(report);
    } catch (error) {
      next(error);
    }
  };


const getSkillGapReport = async (req, res, next) => {
  try {
    const { period } = req.query; 
    const report = await reportService.calculateSkillGaps(period);
    res.json(report);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserPerformance, getMyPerformance, getSkillGapReport };