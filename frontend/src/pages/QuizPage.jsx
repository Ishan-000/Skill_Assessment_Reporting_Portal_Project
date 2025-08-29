import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';

const QuizPage = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await apiClient.get(`/skills/${skillId}/questions`);
        if (response.data.length === 0) {
            setError("No questions found for this skill yet.");
        } else {
            setQuestions(response.data);
        }
      } catch (err) {
        setError('Failed to load questions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [skillId]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    const submissionData = {
      skillId: parseInt(skillId),
      answers: Object.entries(answers).map(([questionId, selectedOptionIndex]) => ({
        questionId: parseInt(questionId),
        selectedOptionIndex,
      })),
    };
    
    try {
        const response = await apiClient.post('/quizzes/submit', submissionData);
        setScore(response.data.score);
        setQuizFinished(true);
    } catch (err) {
        setError('Failed to submit quiz.');
        console.error(err);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="error-message">{error}</p>;
  if (questions.length === 0) return null;

  if (quizFinished) {
    return (
      <div>
        <h2>Quiz Complete!</h2>
        <h3>Your Score: {score.toFixed(2)}%</h3>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div>
      <h2>Quiz Time!</h2>
      <h4>Question {currentQuestionIndex + 1} of {questions.length}</h4>
      <p style={{fontSize: '1.2rem'}}>{currentQuestion.question_text}</p>
      
      <div>
        {currentQuestion.options.map((option, index) => (
          <div key={index}>
            <button 
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                style={{
                    backgroundColor: answers[currentQuestion.id] === index ? '#646cff' : '#1a1a1a',
                    width: '80%'
                }}
            >
              {option}
            </button>
          </div>
        ))}
      </div>

      <div style={{marginTop: '2rem'}}>
        {currentQuestionIndex < questions.length - 1 ? (
          <button onClick={handleNext} disabled={answers[currentQuestion.id] === undefined}>Next Question</button>
        ) : (
          <button onClick={handleSubmit} disabled={Object.keys(answers).length !== questions.length}>Submit Quiz</button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;