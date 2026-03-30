import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { result } = location.state || {};

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
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
        
        <button onClick={() => navigate('/subjects')} className="btn btn-primary" style={{ width: '100%' }}>
          Back to Subjects
        </button>
      </div>
    </div>
  );
}

export default Result;
