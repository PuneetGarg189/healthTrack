import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

export const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" />
        </svg>
      )
    },
    {
      label: 'Patients Directory',
      path: '/patients',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      label: 'Medications Tracker',
      path: '/medications',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      )
    },
    {
      label: 'Health Logs',
      path: '/health-logs',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    {
      label: 'Medicine Schedule',
      path: '/medicine-schedule',
      svg: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    }
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="mobile-header">
        <div className="mobile-brand" onClick={() => { navigate('/dashboard'); closeMenu(); }}>
          <img src="/images/hospital-logo.jpg" alt="Hospital Logo" className="mobile-logo-img" />
          <span className="brand-title">HealthTrack</span>
        </div>
        <button
          className="mobile-toggle-btn"
          onClick={toggleMenu}
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? '✕' : '☰'}
        </button>
      </header>

      {/* Backdrop Overlay for Mobile Drawer */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeMenu} />
      )}

      {/* Main Sidebar Navigation */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-wrapper" onClick={() => navigate('/dashboard')}>
            <div className="brand-badge-box">
              <div className="brand-logo-frame">
                <img src="/images/hospital-logo.jpg" alt="Hospital Logo" className="brand-logo-img" />
              </div>
              <div>
                <h1 className="sidebar-title">HealthTrack</h1>
              </div>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={closeMenu} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* User Card */}
        <div className="sidebar-user-card">
          <div className="user-avatar-badge">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Dr. John Smith'}</span>
            <span className="user-role-tag">{user?.role === 'admin' ? 'System Administrator' : 'Clinical Officer'}</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  closeMenu();
                }}
              >
                <span className="nav-icon-wrapper">{item.svg}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Footer Logout (NO door emoji, clean icon & text) */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
