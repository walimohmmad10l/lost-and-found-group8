import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [recentItems, setRecentItems] = useState([]);
  const [stats, setStats] = useState({ lost: 0, found: 0, resolved: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/items?limit=6');
        setRecentItems(data.items);
        const lost = data.items.filter(i => i.type === 'lost').length;
        const found = data.items.filter(i => i.type === 'found').length;
        setStats({ lost, found, resolved: 0 });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { key: 'id-card', emoji: '🪪', label: 'ID Card' },
    { key: 'wallet', emoji: '👛', label: 'Wallet' },
    { key: 'phone', emoji: '📱', label: 'Phone' },
    { key: 'laptop', emoji: '💻', label: 'Laptop' },
    { key: 'keys', emoji: '🔑', label: 'Keys' },
    { key: 'bag', emoji: '🎒', label: 'Bag' },
    { key: 'books', emoji: '📚', label: 'Books' },
    { key: 'other', emoji: '📦', label: 'Other' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>Lost Something on Campus?</h1>
          <p>Report lost or found items and help reunite belongings with their owners.</p>
          <div className="hero-buttons">
            <Link to="/report" className="btn btn-primary" style={{ background: 'white', color: 'var(--primary)', padding: '12px 28px', fontSize: '15px' }}>
              📝 Report an Item
            </Link>
            <Link to="/items" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.4)', padding: '12px 28px', fontSize: '15px' }}>
              🔍 Browse Listings
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-num">{recentItems.length}+</div>
              <div className="hero-stat-label">Active Listings</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">Fast</div>
              <div className="hero-stat-label">Match & Notify</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">Free</div>
              <div className="hero-stat-label">For All Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '60px 0', background: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '28px', marginBottom: '40px' }}>How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { step: '1', icon: '📝', title: 'Report Your Item', desc: 'Fill in the details — what you lost or found, where, and when.' },
              { step: '2', icon: '🔍', title: 'Search Listings', desc: 'Browse all reported items and search by category or keyword.' },
              { step: '3', icon: '📞', title: 'Contact & Claim', desc: 'Reach out directly to the person who found your item.' },
              { step: '4', icon: '✅', title: 'Resolved!', desc: 'Mark the item as returned and help keep the system clean.' },
            ].map(s => (
              <div key={s.step} style={{ textAlign: 'center', padding: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>{s.step}</div>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by category */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '24px', marginBottom: '24px' }}>Browse by Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
            {categories.map(cat => (
              <button key={cat.key} onClick={() => navigate(`/items?category=${cat.key}`)}
                style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 12px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{cat.emoji}</div>
                <div style={{ fontSize: '13px', fontWeight: '500' }}>{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent listings */}
      <section style={{ padding: '48px 0', background: 'white' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px' }}>Recent Listings</h2>
            <Link to="/items" className="btn btn-secondary btn-sm">View All →</Link>
          </div>
          {recentItems.length > 0 ? (
            <div className="items-grid">
              {recentItems.map(item => <ItemCard key={item._id} item={item} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="emoji">📭</div>
              <h3>No listings yet</h3>
              <p>Be the first to report a lost or found item!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
