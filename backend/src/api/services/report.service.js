const pool = require('../../config/db');

const fetchUserPerformance = async (userId) => {
  const [attempts] = await pool.query(
    `SELECT a.id, s.name as skill_name, a.score, a.completed_at 
     FROM quiz_attempts a
     JOIN skills s ON a.skill_id = s.id
     WHERE a.user_id = ?
     ORDER BY a.completed_at DESC`,
    [userId]
  );
  return attempts;
};

const calculateSkillGaps = async (period = 'all') => {
  let dateFilter = '';
  
  if (period === 'week') {
    dateFilter = 'WHERE a.completed_at >= NOW() - INTERVAL 1 WEEK';
  } else if (period === 'month') {
    dateFilter = 'WHERE a.completed_at >= NOW() - INTERVAL 1 MONTH';
  }

  const query = `
    SELECT 
      s.id AS skill_id,
      s.name AS skill_name,
      AVG(a.score) AS average_score
    FROM skills s
    LEFT JOIN quiz_attempts a ON s.id = a.skill_id
    ${dateFilter}
    GROUP BY s.id, s.name
    HAVING AVG(a.score) IS NOT NULL
    ORDER BY average_score ASC;
  `;
  
  const [results] = await pool.query(query);
  return results;
};

module.exports = { fetchUserPerformance, calculateSkillGaps };