import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const { data } = await axios.get(`/api/items/${id}`);
        setItem(data);
      } catch {
        toast.error('Item not found');
        navigate('/items');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/items/${id}`);
      toast.success('Item deleted');
      navigate('/items');
    } catch {
      toast.error('Failed to delete');
      setDeleting(false);
    }
  };

  const handleMarkResolved = async () => {
    try {
      await axios.put(`/api/items/${id}`, { status: 'resolved' });
      setItem(prev => ({ ...prev, status: 'resolved' }));
      toast.success('Marked as resolved!');
    } catch {
      toast.error('Failed to update');
    }
  };

  if (loading) return <div className="loading-center"><div className="spinner"></div></div>;
  if (!item) return null;

  const isOwner = user && item.reportedBy?._id === user.id;
  const canModify = isOwner || isAdmin;

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px', maxWidth: '860px' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm" style={{ marginBottom: '24px' }}>
        ← Back
      </button>

      <div className="card">
        {/* Image */}
        {item.image ? (
          <img src={`http://localhost:5000${item.image}`} alt={item.title} className="detail-img" />
        ) : (
          <div style={{ height: '240px', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
            {({ 'id-card': '🪪', wallet: '👛', phone: '📱', laptop: '💻', keys: '🔑', bag: '🎒', books: '📚', jewelry: '💍', clothing: '👕' })[item.category] || '📦'}
          </div>
        )}

        <div className="card-body">
          {/* Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className={`item-badge badge-${item.type}`} style={{ fontSize: '13px', padding: '5px 14px' }}>
              {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
            </span>
            {item.isVerified && <span className="item-badge badge-verified" style={{ fontSize: '13px', padding: '5px 14px' }}>✓ Verified</span>}
            {item.status === 'resolved' && (
              <span className="item-badge" style={{ background: '#f0fdf4', color: '#15803d', fontSize: '13px', padding: '5px 14px' }}>✅ Resolved</span>
            )}
          </div>

          <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>{item.title}</h1>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>{item.description}</p>

          {/* Details grid */}
          <div className="detail-grid">
            <div className="detail-field">
              <label>📍 Location</label>
              <p>{item.location}</p>
            </div>
            <div className="detail-field">
              <label>📅 Date</label>
              <p>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="detail-field">
              <label>🏷️ Category</label>
              <p style={{ textTransform: 'capitalize' }}>{item.category.replace('-', ' ')}</p>
            </div>
            <div className="detail-field">
              <label>📆 Reported On</label>
              <p>{new Date(item.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Contact info */}
          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '20px', marginTop: '24px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Contact Information</h3>
            <p style={{ fontSize: '14px', marginBottom: '8px' }}>
              <strong>Reported by:</strong> {item.reportedBy?.name || 'Unknown'}
            </p>
            {user ? (
              <>
                {item.contactEmail && (
                  <p style={{ fontSize: '14px', marginBottom: '8px' }}>
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${item.contactEmail}`} style={{ color: 'var(--primary)' }}>{item.contactEmail}</a>
                  </p>
                )}
                {item.contactPhone && (
                  <p style={{ fontSize: '14px' }}>
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${item.contactPhone}`} style={{ color: 'var(--primary)' }}>{item.contactPhone}</a>
                  </p>
                )}
              </>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                <a href="/login" style={{ color: 'var(--primary)' }}>Log in</a> to see contact details.
              </p>
            )}
          </div>

          {/* Action buttons */}
          {canModify && item.status === 'active' && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              <button onClick={handleMarkResolved} className="btn btn-success">
                ✅ Mark as Resolved
              </button>
              <button onClick={handleDelete} className="btn btn-danger" disabled={deleting}>
                {deleting ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
