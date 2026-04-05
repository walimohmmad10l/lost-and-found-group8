import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🔍 Campus Lost & Found</h1>
          <p>Create your account</p>
        </div>
        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input name="name" className="form-input" placeholder="Your full name"
                  value={form.name} onChange={handleChange} required autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input name="email" type="email" className="form-input" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number (optional)</label>
                <input name="phone" type="tel" className="form-input" placeholder="+91 98765 43210"
                  value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                  value={form.password} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}
                style={{ padding: '12px', fontSize: '15px', marginTop: '8px' }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
