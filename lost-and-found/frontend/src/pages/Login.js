import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async e => {
    e.preventDefault();
    setForgotLoading(true);
    setResetLink('');
    try {
      const { data } = await axios.post('/api/password/forgot', { email: forgotEmail });
      setResetLink(data.resetLink || '');
      toast.success('Reset link generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setForgotLoading(false);
    }
  };

  const closeForgot = () => {
    setShowForgot(false);
    setForgotEmail('');
    setResetLink('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🔍 Campus Lost & Found</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input name="email" type="email" className="form-input"
                  placeholder="you@example.com" value={form.email}
                  onChange={handleChange} required autoFocus />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Password</label>
                  <button type="button" onClick={() => setShowForgot(true)}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}>
                    Forgot password?
                  </button>
                </div>
                <input name="password" type="password" className="form-input"
                  placeholder="••••••••" value={form.password}
                  onChange={handleChange} required />
              </div>

              <button type="submit" className="btn btn-primary btn-full" disabled={loading}
                style={{ padding: '12px', fontSize: '15px', marginTop: '8px' }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>Register here</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div onClick={closeForgot}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Reset Password</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Enter your email to get a reset link.</p>
              </div>
              <button onClick={closeForgot}
                style={{ background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#94a3b8', lineHeight: 1 }}>×</button>
            </div>

            {!resetLink ? (
              <form onSubmit={handleForgotSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Email Address</label>
                  <input type="email" className="form-input" placeholder="you@example.com"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required autoFocus />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={forgotLoading} style={{ padding: '12px' }}>
                  {forgotLoading ? 'Generating...' : '🔑 Generate Reset Link'}
                </button>
              </form>
            ) : (
              <div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '13px', color: '#15803d', marginBottom: '10px', fontWeight: '500' }}>
                    ✅ Reset link generated! Click it to set a new password:
                  </p>
                  <a href={resetLink}
                    style={{ display: 'block', wordBreak: 'break-all', fontSize: '13px', color: 'var(--primary)', background: 'white', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    {resetLink}
                  </a>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>⏰ This link expires in 1 hour.</p>
                <button onClick={closeForgot} className="btn btn-secondary btn-full">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
