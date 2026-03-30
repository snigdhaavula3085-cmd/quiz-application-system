import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to={user ? "/subjects" : "/login"} className="navbar-brand">
        ⚡ QuizMaster
      </Link>
      <div className="navbar-nav">
        {user ? (
          <>
            <span style={{ color: "var(--text-muted)" }}>Welcome, {user.username}</span>
            <Link to="/subjects" className="nav-link">Subjects</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="nav-link" style={{ color: "var(--secondary-color)" }}>Admin</Link>
            )}
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: "0.4rem 1rem", fontSize: "0.9rem" }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
