import React, { useState } from 'react';
import apiClient from '../../api/apiClient';

const CreateSkillForm = ({ onSkillCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await apiClient.post('/skills', { name, description });
      setSuccess(`Skill "${name}" created successfully!`);
      setName('');
      setDescription('');
      onSkillCreated(); // Notify parent to refetch skills
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create skill.');
    }
  };

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #555', borderRadius: '8px' }}>
      <h4>Create New Skill</h4>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Skill Name (e.g., JavaScript, Python)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (Optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: 'calc(100% - 20px)', minHeight: '60px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid var(--border-color)', backgroundColor: '#333', color: 'var(--text-color)', fontFamily: 'inherit'}}
        />
        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: '#4caf50' }}>{success}</p>}
        <button type="submit">Create Skill</button>
      </form>
    </div>
  );
};

export default CreateSkillForm;