import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

export const Sidebar = () => {
  const { logout } = useContext(AuthContext);
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
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Medications', path: '/medications', icon: '💊' },
    { label: 'Health Logs', path: '/health-logs', icon: '📝' },
    { label: 'Medicine Schedule', path: '/medicine-schedule', icon: '⏰' }
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="mobile-header">
        <div className="mobile-brand" onClick={() => { navigate('/dashboard'); closeMenu(); }}>
          <span className="brand-icon">🏥</span>
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
          <div className="sidebar-brand-wrapper">
            <h1 className="sidebar-title">🏥 HealthTrack</h1>
            <p className="sidebar-subtitle">Analytics System</p>
          </div>
          <button className="sidebar-close-btn" onClick={closeMenu} aria-label="Close menu">
            ✕
          </button>
        </div>

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
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          🚪 Logout
        </button>
      </aside>
    </>
  );
};
