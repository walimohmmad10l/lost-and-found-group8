import React from 'react';
import { useNavigate } from 'react-router-dom';

const categoryEmoji = {
  'id-card': '🪪', wallet: '👛', phone: '📱', laptop: '💻',
  keys: '🔑', bag: '🎒', books: '📚', jewelry: '💍',
  clothing: '👕', other: '📦'
};

export default function ItemCard({ item }) {
  const navigate = useNavigate();
  const emoji = categoryEmoji[item.category] || '📦';

  return (
    <div className="item-card" onClick={() => navigate(`/items/${item._id}`)}>
      <div className="item-card-img">
        {item.image
          ? <img src={`http://localhost:5000${item.image}`} alt={item.title} />
          : <span>{emoji}</span>
        }
      </div>
      <div className="item-card-body">
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className={`item-badge badge-${item.type}`}>
            {item.type === 'lost' ? '🔴' : '🟢'} {item.type}
          </span>
          {item.isVerified && <span className="item-badge badge-verified">✓ Verified</span>}
        </div>
        <h3 className="item-title">{item.title}</h3>
        <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {item.description}
        </p>
        <div className="item-meta">
          <span>📍 {item.location}</span>
          <span>📅 {new Date(item.date).toLocaleDateString()}</span>
        </div>
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
          By {item.reportedBy?.name || 'Unknown'}
        </div>
      </div>
    </div>
  );
}
