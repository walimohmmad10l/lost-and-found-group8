import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          🔍 <span>Campus</span> Lost & Found
        </Link>
        <div className="navbar-links">
          <Link to="/items" className={isActive('/items')}>
            <span>Browse</span>
          </Link>
          {user ? (
            <>
              <Link to="/report" className={isActive('/report')}>
                <span>Report Item</span>
              </Link>
              <Link to="/dashboard" className={isActive('/dashboard')}>
                <span>My Items</span>
              </Link>
              {isAdmin && (
                <Link to="/admin" className={isActive('/admin')}>
                  <span>Admin</span>
                </Link>
              )}
              <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
