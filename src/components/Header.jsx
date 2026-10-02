import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header({ searchVal = '', onSearchChange, onSearchSubmit }) {
  const { auth, logout, savedPostIds } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit(searchVal);
    }
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Left: Logo */}
        <Link to="/" className="brand-logo" title="BookMySeva Home">
          <span style={{ fontSize: '1.5rem' }}>🎗️</span>
          <span>Book<span className="highlight">MySeva</span></span>
        </Link>

        {/* Center: Search Box */}
        {onSearchChange ? (
          <div className="header-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search verified causes, food drives, NGOs..."
              value={searchVal}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        ) : (
          <div style={{ flex: 1 }}></div>
        )}

        {/* Right: Actions */}
        <div className="header-actions">
          {savedPostIds.length > 0 && (
            <Link
              to="/?saved=true"
              className="btn-link"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              title="Saved Causes"
            >
              <span>❤️</span>
              <span>Saved ({savedPostIds.length})</span>
            </Link>
          )}

          {auth?.role === 'ADMIN' ? (
            <>
              <Link to="/admin" className="btn-link" style={{ color: 'var(--saffron-main)' }}>
                🛡️ Admin Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                Logout
              </button>
            </>
          ) : auth?.role === 'NGO' ? (
            <>
              <Link to="/ngo" className="btn-link" style={{ color: 'var(--emerald-main)' }}>
                🏢 NGO Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login?role=ngo" className="btn-link">
                Login as NGO
              </Link>
              <Link to="/login?role=admin" className="btn-link">
                Admin
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
