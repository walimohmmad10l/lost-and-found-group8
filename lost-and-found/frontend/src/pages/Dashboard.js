import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const categoryEmoji = {
  'id-card': '🪪', wallet: '👛', phone: '📱', laptop: '💻',
  keys: '🔑', bag: '🎒', books: '📚', jewelry: '💍', clothing: '👕', other: '📦'
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        const { data } = await axios.get('/api/items/user/my-items');
        setItems(data);
      } catch (err) {
        toast.error('Failed to load your items');
      } finally {
        setLoading(false);
      }
    };
    fetchMyItems();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`/api/items/${id}`);
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filteredItems = items.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'lost') return item.type === 'lost';
    if (activeTab === 'found') return item.type === 'found';
    if (activeTab === 'resolved') return item.status === 'resolved';
    return true;
  });

  const counts = {
    all: items.length,
    lost: items.filter(i => i.type === 'lost').length,
    found: items.filter(i => i.type === 'found').length,
    resolved: items.filter(i => i.status === 'resolved').length,
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
      {/* Profile header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '700', flexShrink: 0 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{user?.email}</p>
          </div>
          <Link to="/report" className="btn btn-primary">+ Report Item</Link>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total', count: counts.all, color: 'var(--primary)' },
          { label: 'Lost', count: counts.lost, color: 'var(--lost)' },
          { label: 'Found', count: counts.found, color: 'var(--found)' },
          { label: 'Resolved', count: counts.resolved, color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: s.color, fontFamily: 'Sora, sans-serif' }}>{s.count}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['all', 'lost', 'found', 'resolved'].map(tab => (
          <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Items list */}
      {loading ? (
        <div className="loading-center"><div className="spinner"></div></div>
      ) : filteredItems.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredItems.map(item => (
            <div key={item._id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/items/${item._id}`)}>
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '36px', flexShrink: 0 }}>{categoryEmoji[item.category] || '📦'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span className={`item-badge badge-${item.type}`}>{item.type}</span>
                    {item.status === 'resolved' && (
                      <span className="item-badge" style={{ background: '#f0fdf4', color: '#15803d' }}>resolved</span>
                    )}
                    {item.isVerified && <span className="item-badge badge-verified">verified</span>}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{item.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    📍 {item.location} · 📅 {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={(e) => handleDelete(item._id, e)} className="btn btn-secondary btn-sm" style={{ flexShrink: 0 }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="emoji">📭</div>
          <h3>No items here</h3>
          <p>You haven't reported any {activeTab !== 'all' ? activeTab : ''} items yet.</p>
          <Link to="/report" className="btn btn-primary" style={{ marginTop: '16px' }}>Report an Item</Link>
        </div>
      )}
    </div>
  );
}
