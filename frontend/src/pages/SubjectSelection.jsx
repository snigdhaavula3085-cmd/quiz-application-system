import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../AuthContext';

function SubjectSelection() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/subjects');
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user, navigate]);

  const handleStartQuiz = (subjectId) => {
    navigate(`/quiz/${subjectId}`);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Loading subjects...</div>;

  return (
    <div>
      <h1 className="text-center" style={{ textAlign: 'center', marginBottom: '3rem' }}>Select a Quiz Subject</h1>
      
      {subjects.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          No subjects available yet.
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {subjects.map(subject => (
            <div key={subject.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <h3 style={{ color: 'var(--primary-color)' }}>{subject.name}</h3>
              <p style={{ color: 'var(--text-muted)', flex: 1, marginBottom: '1.5rem' }}>
                {subject.description || 'Test your knowledge.'}
              </p>
              <button 
                className="btn btn-primary" 
                onClick={() => handleStartQuiz(subject.id)}
                style={{ width: '100%' }}
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SubjectSelection;
