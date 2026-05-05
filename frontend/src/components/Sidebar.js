import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

export const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Medications', path: '/medications', icon: '💊' },
    { label: 'Health Logs', path: '/health-logs', icon: '📝' },
    { label: 'Medicine Schedule', path: '/medicine-schedule', icon: '⏰' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">🏥 HealthTrack</h1>
        <p className="sidebar-subtitle">Analytics System</p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <a
            key={item.path}
            href={item.path}
            className="nav-item"
            onClick={(e) => {
              e.preventDefault();
              navigate(item.path);
            }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>

      <button onClick={handleLogout} className="logout-btn">
        🚪 Logout
      </button>
    </aside>
  );
};
