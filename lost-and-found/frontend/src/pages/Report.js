import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { key: 'id-card', label: 'ID Card', emoji: '🪪' },
  { key: 'wallet', label: 'Wallet', emoji: '👛' },
  { key: 'phone', label: 'Phone', emoji: '📱' },
  { key: 'laptop', label: 'Laptop', emoji: '💻' },
  { key: 'keys', label: 'Keys', emoji: '🔑' },
  { key: 'bag', label: 'Bag', emoji: '🎒' },
  { key: 'books', label: 'Books', emoji: '📚' },
  { key: 'jewelry', label: 'Jewelry', emoji: '💍' },
  { key: 'clothing', label: 'Clothing', emoji: '👕' },
  { key: 'other', label: 'Other', emoji: '📦' },
];

export default function Report() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [form, setForm] = useState({
    type: 'lost',
    title: '',
    description: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== '') formData.append(k, v);
      });

      const { data } = await axios.post('/api/items', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Item reported successfully!');
      navigate(`/items/${data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px', maxWidth: '680px' }}>
      <div className="page-header" style={{ paddingTop: 0 }}>
        <h1>Report an Item</h1>
        <p>Fill in the details about the item you lost or found.</p>
      </div>

      <form onSubmit={handleSubmit} className="card">
        <div className="card-body">

          {/* Type selector */}
          <div className="form-group">
            <label className="form-label">I want to report a...</label>
            <div className="type-selector">
              <div className={`type-option ${form.type === 'lost' ? 'selected-lost' : ''}`}
                onClick={() => setForm(p => ({ ...p, type: 'lost' }))}>
                <div className="type-icon">😢</div>
                <h3>Lost Item</h3>
                <p>I lost something and need help finding it</p>
              </div>
              <div className={`type-option ${form.type === 'found' ? 'selected-found' : ''}`}
                onClick={() => setForm(p => ({ ...p, type: 'found' }))}>
                <div className="type-icon">😊</div>
                <h3>Found Item</h3>
                <p>I found something and want to return it</p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Item Title *</label>
            <input name="title" className="form-input" placeholder="e.g. Black leather wallet, Samsung phone" value={form.title} onChange={handleChange} required />
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label">Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
              {CATEGORIES.map(cat => (
                <button type="button" key={cat.key}
                  onClick={() => setForm(p => ({ ...p, category: cat.key }))}
                  style={{
                    padding: '10px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid',
                    borderColor: form.category === cat.key ? 'var(--primary)' : 'var(--border)',
                    background: form.category === cat.key ? '#f0f0ff' : 'white',
                    color: form.category === cat.key ? 'var(--primary)' : 'var(--text)',
                    fontSize: '12px', fontWeight: '500', textAlign: 'center', cursor: 'pointer'
                  }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{cat.emoji}</div>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea name="description" className="form-textarea" placeholder="Describe the item in detail — color, brand, any unique features..." value={form.description} onChange={handleChange} required />
          </div>

          {/* Location and Date row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input name="location" className="form-input" placeholder="e.g. Library, Block A, Canteen" value={form.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input name="date" type="date" className="form-input" value={form.date} onChange={handleChange} required />
            </div>
          </div>

          {/* Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input name="contactEmail" type="email" className="form-input" placeholder="your@email.com" value={form.contactEmail} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input name="contactPhone" type="tel" className="form-input" placeholder="+91 98765 43210" value={form.contactPhone} onChange={handleChange} />
            </div>
          </div>

          {/* Image upload */}
          <div className="form-group">
            <label className="form-label">Photo (optional)</label>
            <label className="upload-area">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="upload-preview" />
              ) : (
                <>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Click to upload a photo</p>
                  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>JPEG, PNG up to 5MB</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ padding: '14px', fontSize: '15px' }}>
            {loading ? 'Submitting...' : `📝 Submit ${form.type === 'lost' ? 'Lost' : 'Found'} Item Report`}
          </button>
        </div>
      </form>
    </div>
  );
}
