import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, questions, selectedAnswers } = location.state || {};
  const [showReview, setShowReview] = useState(false);

  if (!result) {
    return (
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        No results to display. 
        <div style={{ marginTop: '1rem' }}>
          <Link to="/subjects" className="btn btn-primary">Go to Subjects</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Score Card */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: showReview ? 'auto' : '60vh' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Quiz Completed!</h1>
          
          <div style={{ margin: '2rem 0' }}>
            <div style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%', 
              border: `10px solid ${result.scorePercentage >= 50 ? 'var(--success-color)' : 'var(--danger-color)'}`,
              display: 'flex', 
              alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
              margin: '0 auto',
              fontSize: '2.5rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'rgba(0,0,0,0.2)'
            }}>
              {Math.round(result.scorePercentage)}%
            </div>
          </div>
          
          <div style={{ 
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', 
            background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Correct Answers</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success-color)' }}>{result.correctAnswers}</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Questions</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{result.totalQuestions}</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/subjects')} className="btn btn-secondary" style={{ flex: 1 }}>
              Back to Subjects
            </button>
            {questions && selectedAnswers && (
              <button 
                onClick={() => setShowReview(!showReview)} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                {showReview ? 'Hide Results' : 'View Results'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Review Section */}
      {showReview && questions && (
        <div style={{ marginTop: '2rem', paddingBottom: '2rem' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '1.5rem', 
            fontSize: '1.8rem',
            background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Detailed Review
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const correctAnswer = question.correctAnswer;
              const isCorrect = userAnswer === correctAnswer;
              const isUnanswered = userAnswer === undefined || userAnswer === null;

              return (
                <div 
                  key={index} 
                  className="glass-card" 
                  style={{ 
                    borderLeft: `4px solid ${isUnanswered ? 'var(--text-muted)' : isCorrect ? 'var(--success-color)' : 'var(--danger-color)'}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Question Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ 
                      color: 'var(--text-muted)', 
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Question {index + 1}
                    </span>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      background: isUnanswered 
                        ? 'rgba(148, 163, 184, 0.15)' 
                        : isCorrect 
                          ? 'rgba(16, 185, 129, 0.15)' 
                          : 'rgba(239, 68, 68, 0.15)',
                      color: isUnanswered 
                        ? 'var(--text-muted)' 
                        : isCorrect 
                          ? 'var(--success-color)' 
                          : 'var(--danger-color)',
                      border: `1px solid ${isUnanswered ? 'rgba(148, 163, 184, 0.3)' : isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {isUnanswered ? '⊘ Skipped' : isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  </div>

                  {/* Question Text */}
                  <p style={{ fontSize: '1.1rem', fontWeight: '500', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {question.text}
                  </p>

                  {/* Answer Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {/* User's Answer */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      borderRadius: '8px',
                      background: isUnanswered 
                        ? 'rgba(148, 163, 184, 0.08)' 
                        : isCorrect 
                          ? 'rgba(16, 185, 129, 0.08)' 
                          : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${isUnanswered ? 'rgba(148, 163, 184, 0.15)' : isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    }}>
                      <span style={{ 
                        fontSize: '1.1rem',
                        width: '24px',
                        textAlign: 'center'
                      }}>
                        {isUnanswered ? '⊘' : isCorrect ? '✓' : '✗'}
                      </span>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                          Your Answer
                        </div>
                        <div style={{ 
                          fontWeight: '500',
                          color: isUnanswered ? 'var(--text-muted)' : isCorrect ? 'var(--success-color)' : 'var(--danger-color)'
                        }}>
                          {isUnanswered ? 'Not answered' : userAnswer}
                        </div>
                      </div>
                    </div>

                    {/* Correct Answer (shown only when wrong or skipped) */}
                    {!isCorrect && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}>
                        <span style={{ 
                          fontSize: '1.1rem',
                          width: '24px',
                          textAlign: 'center'
                        }}>
                          ✓
                        </span>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '2px' }}>
                            Correct Answer
                          </div>
                          <div style={{ fontWeight: '500', color: 'var(--success-color)' }}>
                            {correctAnswer}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Result;
