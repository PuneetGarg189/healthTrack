import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Auth.css';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Left Side Banner */}
        <div className="auth-card-side-text">
          <div className="side-hero-content">
            <span className="side-badge">🏥 CLINICAL REGISTRATION</span>
            <h2>Join HealthTrack Portal</h2>
            <p>Start managing patient records, prescriptions, and health analytics with enterprise-grade security.</p>
            
            <div className="hero-features">
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>Secure Clinical Role Access</span>
              </div>
              <div className="feature-item">
                <span className="feature-dot"></span>
                <span>HIPAA & Compliance Diagnostics</span>
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
              <label>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Dr. Jane Doe"
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="doctor@hospital.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="6"
                required
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register Account'}
            </button>

            <p className="auth-footer">
              Already have an account? <a href="/login">Login here</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
