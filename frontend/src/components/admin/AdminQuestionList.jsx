import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

const AdminQuestionList = ({ skills }) => {
    const [selectedSkill, setSelectedSkill] = useState('');
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!selectedSkill) {
            setQuestions([]);
            return;
        }

        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const response = await apiClient.get(`/skills/${selectedSkill}/questions`);
                setQuestions(response.data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [selectedSkill]);
    
    const handleDelete = async (questionId) => {
        // Simple confirmation before deleting
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await apiClient.delete(`/questions/${questionId}`);
                // Refresh the list by filtering out the deleted question
                setQuestions(questions.filter(q => q.id !== questionId));
            } catch (error) {
                alert('Failed to delete question.');
            }
        }
    };

    return (
        <div style={{ padding: '1rem', border: '1px solid #555', borderRadius: '8px' }}>
            <h4>Manage Questions</h4>
             <select onChange={(e) => setSelectedSkill(e.target.value)} value={selectedSkill} style={{width: '100%', padding: '10px', margin: '10px 0'}}>
                <option value="">Select a Skill to view its Questions</option>
                {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                ))}
            </select>

            {loading && <p>Loading questions...</p>}
            
            {questions.length > 0 && (
                <ul style={{listStyle: 'none', padding: 0}}>
                    {questions.map(q => (
                        <li key={q.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem', borderBottom: '1px solid #444'}}>
                            <span>{q.question_text.substring(0, 50)}...</span>
                            <button onClick={() => handleDelete(q.id)} style={{backgroundColor: '#ff6b6b', color: 'white'}}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AdminQuestionList;