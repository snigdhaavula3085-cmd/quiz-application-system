import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

function Quiz() {
  const { subjectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/questions/subject/${subjectId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [subjectId, user, navigate]);

  const handleOptionSelect = (optionValue) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionValue
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Calculate correct answers
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    try {
      const response = await axios.post('http://localhost:8080/api/results', {
        userId: user.id,
        subjectId: parseInt(subjectId),
        correctAnswers: correctCount,
        totalQuestions: questions.length
      });
      // Navigate to results page with data
      navigate('/result', { state: { result: response.data } });
    } catch (error) {
      console.error('Error submitting quiz', error);
      alert('Failed to submit quiz.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading questions...</div>;
  if (questions.length === 0) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>No questions available for this subject.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px' }}>
        <div style={{ background: 'var(--primary-color)', height: '100%', width: `${progress}%`, borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
      </div>
      
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>{currentQuestion.text}</h2>
        
        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
          {['A', 'B', 'C', 'D'].map((opt) => {
            const optText = currentQuestion[`option${opt}`];
            const isSelected = selectedAnswers[currentQuestionIndex] === optText;
            
            return (
              <div 
                key={opt}
                onClick={() => handleOptionSelect(optText)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: isSelected ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: isSelected ? 'var(--primary-color)' : 'transparent',
                  border: isSelected ? 'none' : '1px solid var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isSelected ? 'white' : 'inherit'
                }}>
                  {opt}
                </div>
                <span>{optText}</span>
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            className="btn btn-secondary" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
            style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
          >
            Previous
          </button>
          
          {currentQuestionIndex === questions.length - 1 ? (
             <button className="btn btn-primary" onClick={handleSubmit}>Submit Quiz</button>
          ) : (
            <button className="btn btn-primary" onClick={handleNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quiz;
