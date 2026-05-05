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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-side-text">
          <h2>Your Health,<br/>Our Priority</h2>
          <p>Track your wellness journey and manage your health analytics with HealthTrack</p>
        </div>

        <form onSubmit={handleSubmit}>
          <h1 className="auth-title">🏥 HealthTrack</h1>
          <p className="auth-subtitle">Personal Health Analytics System</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-credentials">
          <p className="demo-title">📧 Demo Credentials:</p>
          <p>Email: <strong>admin@healthtrack.com</strong></p>
          <p>Password: <strong>password123</strong></p>
        </div>

        <p className="auth-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};
