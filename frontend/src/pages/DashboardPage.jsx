import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

const DashboardPage = () => {
  const [skills, setSkills] = useState([]);
  const [pastAttempts, setPastAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [skillsRes, attemptsRes] = await Promise.all([
          apiClient.get('/skills'),
          apiClient.get('/reports/me')
        ]);
        setSkills(skillsRes.data);
        setPastAttempts(attemptsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h2>User Dashboard</h2>
      <hr/>
      <h3>Take a New Quiz</h3>
      <div>
        {skills.map(skill => (
          <Link key={skill.id} to={`/quiz/${skill.id}`}>
            <button>{skill.name}</button>
          </Link>
        ))}
      </div>
      <hr/>
      <h3>Past Performance</h3>
      {pastAttempts.length > 0 ? (
        <table style={{width: '100%', marginTop: '1rem'}}>
          <thead>
            <tr>
              <th>Skill</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {pastAttempts.map(attempt => (
              <tr key={attempt.id}>
                <td>{attempt.skill_name}</td>
                <td>{attempt.score}%</td>
                <td>{new Date(attempt.completed_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You haven't taken any quizzes yet.</p>
      )}
    </div>
  );
};

export default DashboardPage;