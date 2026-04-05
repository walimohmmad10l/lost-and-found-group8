import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/password/reset', { token, password: form.password });
      setDone(true);
      toast.success('Password reset successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🔍 Campus Lost & Found</h1>
          <p>Set a new password</p>
        </div>

        <div className="card">
          <div className="card-body">
            {done ? (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
                <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Password Updated!</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
                  Your password has been changed successfully.
                </p>
                <button onClick={() => navigate('/login')} className="btn btn-primary btn-full" style={{ padding: '12px' }}>
                  Go to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" placeholder="Min. 6 characters"
                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    required autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" placeholder="Repeat new password"
                    value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                    required />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}
                  style={{ padding: '12px', fontSize: '15px' }}>
                  {loading ? 'Resetting...' : '🔒 Reset Password'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <Link to="/login" style={{ color: 'var(--primary)' }}>← Back to login</Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
