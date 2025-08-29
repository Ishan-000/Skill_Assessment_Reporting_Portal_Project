import React, { useState, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import SkillGapReport from '../components/admin/skillGapReport';
import CreateSkillForm from '../components/admin/CreateSkillForm';
import CreateQuestionForm from '../components/admin/CreateQuestionForm';
import Loader from '../components/common/Loader';
import AdminQuestionList from '../components/admin/AdminQuestionList';

const AdminPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSkills = useCallback(async () => {
    try {
        const response = await apiClient.get('/skills');
        setSkills(response.data);
    } catch (err) {
        setError('Failed to fetch skills.');
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);


  if (loading) return <Loader />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div>
      <h2>Admin Panel</h2>
      <p>Here you can manage skills, questions, and view aggregated reports.</p>
      <hr />
      
      <h3>Content Management</h3>
      <div style={{display: 'flex', gap: '2rem', textAlign: 'left'}}>
        <div style={{flex: 1}}>
            <CreateSkillForm onSkillCreated={fetchSkills} />
        </div>
        <div style={{flex: 2}}>
            <CreateQuestionForm skills={skills} />
        </div>
      </div>
      <AdminQuestionList skills={skills} />
      <hr />

      <h3>Reporting</h3>
      <SkillGapReport />
    </div>
  );
};

export default AdminPage;