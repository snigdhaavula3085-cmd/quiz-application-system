import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../AuthContext';

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', description: '' });
  
  const [questions, setQuestions] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  
  const [newQuestion, setNewQuestion] = useState({
    text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: ''
  });

  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, [user]);

  const fetchSubjects = async () => {
    try {
      const response = await api.get('/api/subjects');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects', error);
    }
  };

  const fetchQuestions = async (subjectId) => {
    try {
      const response = await api.get(`/api/questions/subject/${subjectId}`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions', error);
    }
  };

  const handleSubjectChange = (e) => {
    const subjId = e.target.value;
    setSelectedSubjectId(subjId);
    setEditingQuestion(null);
    if (subjId) {
      fetchQuestions(subjId);
    } else {
      setQuestions([]);
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/subjects', newSubject, {
        headers: { 'X-Role': user.role }
      });
      setNewSubject({ name: '', description: '' });
      fetchSubjects();
      alert('Subject created successfully!');
    } catch (error) {
      alert('Failed to create subject');
    }
  };

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      alert('Please select a subject first');
      return;
    }
    try {
      const config = { headers: { 'X-Role': user.role } };
      if (editingQuestion) {
        await api.put(`/api/questions/${editingQuestion.id}`, newQuestion, config);
        setEditingQuestion(null);
      } else {
        await api.post(`/api/questions/subject/${selectedSubjectId}`, newQuestion, config);
      }
      setNewQuestion({ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' });
      fetchQuestions(selectedSubjectId);
      alert(editingQuestion ? 'Question updated!' : 'Question created!');
    } catch (error) {
      alert('Operation failed');
    }
  };

  const handleDeleteSubject = async (id) => {
    if (window.confirm("Are you sure? This deletes all questions inside it too.")) {
      try {
        await api.delete(`/api/subjects/${id}`, {
          headers: { 'X-Role': user.role }
        });
        fetchSubjects();
        if (selectedSubjectId === id.toString()) {
          setSelectedSubjectId('');
          setQuestions([]);
        }
      } catch (error) {
        alert("Failed to delete subject");
      }
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm("Delete this question?")) {
      try {
        await api.delete(`/api/questions/${id}`, {
          headers: { 'X-Role': user.role }
        });
        fetchQuestions(selectedSubjectId);
      } catch (error) {
        alert("Delete failed");
      }
    }
  };

  const startEditQuestion = (q) => {
    setEditingQuestion(q);
    setNewQuestion({ 
      text: q.text, optionA: q.optionA, optionB: q.optionB, 
      optionC: q.optionC, optionD: q.optionD, correctAnswer: q.correctAnswer 
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      <h1 style={{ marginBottom: '2rem' }}>⚙️ Admin Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Subject Management */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary-light)' }}>Create Subject</h2>
          
          <form style={{ marginBottom: '2rem' }} onSubmit={handleCreateSubject}>
            <div className="form-group">
              <input 
                type="text" className="form-control" placeholder="Subject Name" required
                value={newSubject.name} onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <textarea 
                className="form-control" placeholder="Description" rows="2"
                value={newSubject.description} onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Subject</button>
          </form>

          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Existing Subjects</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {subjects.map(sub => (
                <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '8px', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500' }}>{sub.name}</span>
                  <button onClick={() => handleDeleteSubject(sub.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'rgba(255,0,0,0.1)', color: '#ff4d4d', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Question Management */}
        <div className="glass-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: 'var(--primary-light)' }}>
            {editingQuestion ? 'Edit Question' : 'Add Question'}
          </h2>
          
          <div className="form-group">
            <label style={{ fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>Subject</label>
            <select className="form-control" value={selectedSubjectId} onChange={handleSubjectChange}>
              <option value="">-- Select Subject --</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>

          <form onSubmit={handleCreateQuestion} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <textarea 
                className="form-control" placeholder="Question Text" required rows="2"
                value={newQuestion.text} onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
              ></textarea>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
              <input required type="text" className="form-control" placeholder="A" value={newQuestion.optionA} onChange={(e) => setNewQuestion({...newQuestion, optionA: e.target.value})} />
              <input required type="text" className="form-control" placeholder="B" value={newQuestion.optionB} onChange={(e) => setNewQuestion({...newQuestion, optionB: e.target.value})} />
              <input required type="text" className="form-control" placeholder="C" value={newQuestion.optionC} onChange={(e) => setNewQuestion({...newQuestion, optionC: e.target.value})} />
              <input required type="text" className="form-control" placeholder="D" value={newQuestion.optionD} onChange={(e) => setNewQuestion({...newQuestion, optionD: e.target.value})} />
            </div>
            <div className="form-group">
              <input required type="text" className="form-control" placeholder="Correct Answer text" value={newQuestion.correctAnswer} onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                {editingQuestion ? 'Update' : 'Create'}
              </button>
              {editingQuestion && (
                <button type="button" onClick={() => { setEditingQuestion(null); setNewQuestion({ text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctAnswer: '' }); }} style={{ background: '#444', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Question List View */}
      {selectedSubjectId && questions.length > 0 && (
        <div className="glass-card" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Questions in {subjects.find(s => s.id.toString() === selectedSubjectId)?.name}</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {questions.map(q => (
              <div key={q.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ margin: 0, fontWeight: '500' }}>{q.text}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEditQuestion(q)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Edit</button>
                    <button onClick={() => handleDeleteQuestion(q.id)} style={{ background: 'rgba(255,0,0,0.2)', color: '#ff4d4d', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <div>A: {q.optionA}</div>
                  <div>B: {q.optionB}</div>
                  <div>C: {q.optionC}</div>
                  <div>D: {q.optionD}</div>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#10b981', fontWeight: 'bold' }}>✓ {q.correctAnswer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
