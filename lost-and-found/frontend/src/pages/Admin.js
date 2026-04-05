import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Admin() {
  const [stats, setStats] = useState({});
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [filter, setFilter] = useState({ status: '', type: '' });

  const fetchStats = async () => {
    const { data } = await axios.get('/api/admin/stats');
    setStats(data);
  };

  const fetchItems = async () => {
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.type) params.set('type', filter.type);
    const { data } = await axios.get(`/api/admin/items?${params}&limit=50`);
    setItems(data.items);
  };

  const fetchUsers = async () => {
    const { data } = await axios.get('/api/admin/users');
    setUsers(data);
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchStats(), fetchItems(), fetchUsers()]);
      } catch (err) {
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [filter]);

  const handleVerify = async (id) => {
    try {
      await axios.patch(`/api/admin/items/${id}/verify`);
      setItems(prev => prev.map(i => i._id === id ? { ...i, isVerified: true } : i));
      toast.success('Item verified!');
    } catch { toast.error('Failed to verify'); }
  };

  const handleStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/items/${id}/status`, { status });
      setItems(prev => prev.map(i => i._id === id ? { ...i, status } : i));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this item?')) return;
    try {
      await axios.delete(`/api/admin/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px' }}>Admin Panel</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage all lost and found reports</p>
        </div>
        <span style={{ background: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
          🛡️ Admin
        </span>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['overview', 'items', 'users'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && (
        <div>
          <div className="admin-stats">
            {[
              { label: 'Total Items', value: stats.totalItems, icon: '📦' },
              { label: 'Active Lost', value: stats.lostItems, icon: '🔴' },
              { label: 'Active Found', value: stats.foundItems, icon: '🟢' },
              { label: 'Resolved', value: stats.resolvedItems, icon: '✅' },
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Pending Verify', value: stats.pendingVerification, icon: '⏳' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                <div className="stat-num">{s.value ?? 0}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 'var(--radius)', padding: '16px' }}>
            <p style={{ fontSize: '14px', color: '#92400e' }}>
              ⚠️ <strong>{stats.pendingVerification}</strong> item(s) waiting for verification. Go to the Items tab to review them.
            </p>
          </div>
        </div>
      )}

      {/* Items management */}
      {activeTab === 'items' && (
        <div>
          {/* Filters */}
          <div className="filters-bar" style={{ marginBottom: '16px' }}>
            <select className="form-select" style={{ width: 'auto' }} value={filter.status}
              onChange={e => setFilter(p => ({ ...p, status: e.target.value }))}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="removed">Removed</option>
            </select>
            <select className="form-select" style={{ width: 'auto' }} value={filter.type}
              onChange={e => setFilter(p => ({ ...p, type: e.target.value }))}>
              <option value="">All Types</option>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Reported By</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No items found</td></tr>
                  ) : items.map(item => (
                    <tr key={item._id}>
                      <td>
                        <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.title}</div>
                        {!item.isVerified && (
                          <span style={{ fontSize: '11px', background: '#fef3c7', color: '#92400e', padding: '2px 6px', borderRadius: '4px' }}>Unverified</span>
                        )}
                      </td>
                      <td><span className={`item-badge badge-${item.type}`}>{item.type}</span></td>
                      <td style={{ fontSize: '13px', textTransform: 'capitalize' }}>{item.category}</td>
                      <td style={{ fontSize: '13px' }}>{item.location}</td>
                      <td style={{ fontSize: '13px' }}>{item.reportedBy?.name || 'N/A'}</td>
                      <td>
                        <select value={item.status} onChange={e => handleStatus(item._id, e.target.value)}
                          style={{ fontSize: '12px', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: '6px', background: 'white' }}>
                          <option value="active">Active</option>
                          <option value="resolved">Resolved</option>
                          <option value="removed">Removed</option>
                        </select>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {!item.isVerified && (
                            <button onClick={() => handleVerify(item._id)} className="btn btn-success btn-sm">
                              ✓ Verify
                            </button>
                          )}
                          <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: '500' }}>{u.name}</td>
                    <td style={{ fontSize: '13px' }}>{u.email}</td>
                    <td style={{ fontSize: '13px' }}>{u.phone || '—'}</td>
                    <td>
                      <span style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: '600',
                        background: u.role === 'admin' ? '#fef3c7' : '#eff6ff',
                        color: u.role === 'admin' ? '#92400e' : '#1d4ed8'
                      }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
