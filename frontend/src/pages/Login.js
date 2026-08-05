import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

export const Login = () => {
  const [email, setEmail] = useState('admin@healthtrack.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = () => {
    setEmail('admin@healthtrack.com');
    setPassword('password123');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side Banner */}
        <div className="auth-card-side-text">
          <div className="side-hero-content">
            <span className="side-badge">ENTERPRISE PORTAL</span>
            <h2>Enterprise Health Platform</h2>
            <p>Real-time patient monitoring, medication adherence analytics, and healthcare record management.</p>
            
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Patient Directory & Vitals Tracking</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Medication Schedule & Adherence Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Real-Time Compliance Diagnostics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-wrapper">
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-brand-header">
              <div className="brand-logo-frame">
                <img src="/images/hospital-logo.jpg" alt="HealthTrack Logo" className="brand-logo-img" />
              </div>
              <div>
                <h1 className="auth-title">HealthTrack</h1>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@healthtrack.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>

            {/* Quick Autofill Demo Credentials */}
            <div className="demo-credentials-box">
              <div className="demo-header">
                <span>🔑 Quick Demo Credentials</span>
                <button type="button" className="btn-autofill" onClick={autofillDemo}>Auto-Fill</button>
              </div>
              <div className="demo-row">
                <span>Email: <strong>admin@healthtrack.com</strong></span>
                <span>Pass: <strong>password123</strong></span>
              </div>
            </div>

            <p className="auth-footer">
              Don't have an account? <a href="/register">Register here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
