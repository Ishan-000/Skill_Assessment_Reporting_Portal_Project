import React, { useState } from 'react';
import apiClient from '../../api/apiClient';

const CreateQuestionForm = ({ skills }) => {
  const [skillId, setSkillId] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const resetForm = () => {
    setSkillId('');
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectOptionIndex(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (correctOptionIndex === null) {
        setError('Please select the correct answer.');
        return;
    }

    const questionData = {
        skill_id: parseInt(skillId),
        question_text: questionText,
        options: options.filter(opt => opt !== ''), // Only send non-empty options
        correct_option_index: correctOptionIndex,
    };

    try {
        await apiClient.post('/questions', questionData);
        setSuccess('Question created successfully!');
        resetForm();
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to create question.');
    }
  };

  return (
    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #555', borderRadius: '8px' }}>
      <h4>Create New Question</h4>
      <form onSubmit={handleSubmit}>
        <select value={skillId} onChange={(e) => setSkillId(e.target.value)} required style={{width: '100%', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid var(--border-color)', backgroundColor: '#333', color: 'var(--text-color)'}}>
            <option value="">Select a Skill</option>
            {skills.map(skill => (
                <option key={skill.id} value={skill.id}>{skill.name}</option>
            ))}
        </select>

        <textarea
          placeholder="Question Text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          style={{ width: 'calc(100% - 20px)', minHeight: '80px', padding: '10px', margin: '10px 0', borderRadius: '5px', border: '1px solid var(--border-color)', backgroundColor: '#333', color: 'var(--text-color)', fontFamily: 'inherit'}}
        />

        {options.map((option, index) => (
            <div key={index} style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                 <input
                    type="radio"
                    name="correct_option"
                    checked={correctOptionIndex === index}
                    onChange={() => setCorrectOptionIndex(index)}
                    style={{width: 'auto'}}
                />
                <input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                />
            </div>
        ))}

        {error && <p className="error-message">{error}</p>}
        {success && <p style={{ color: '#4caf50' }}>{success}</p>}
        <button type="submit">Create Question</button>
      </form>
    </div>
  );
};

export default CreateQuestionForm;