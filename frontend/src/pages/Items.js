import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

const CATEGORIES = [
  { key: '', label: 'All Categories' },
  { key: 'id-card', label: '🪪 ID Card' },
  { key: 'wallet', label: '👛 Wallet' },
  { key: 'phone', label: '📱 Phone' },
  { key: 'laptop', label: '💻 Laptop' },
  { key: 'keys', label: '🔑 Keys' },
  { key: 'bag', label: '🎒 Bag' },
  { key: 'books', label: '📚 Books' },
  { key: 'jewelry', label: '💍 Jewelry' },
  { key: 'clothing', label: '👕 Clothing' },
  { key: 'other', label: '📦 Other' },
];

export default function Items() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (type) params.set('type', type);
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await axios.get(`/api/items?${params}`);
      setItems(data.items);
      setTotal(data.total);
      setPages(data.pages);
      setCurrentPage(data.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type, category, search]);

  useEffect(() => {
    fetchItems(1);
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(1);
  };

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '48px' }}>
      <div className="page-header" style={{ paddingTop: 0 }}>
        <h1>Browse All Items</h1>
        <p>{total} item{total !== 1 ? 's' : ''} found</p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="form-input search-input"
            placeholder="Search by title, description, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {/* Type filter */}
      <div className="filters-bar">
        {[{ value: '', label: 'All Items' }, { value: 'lost', label: '🔴 Lost' }, { value: 'found', label: '🟢 Found' }].map(t => (
          <button key={t.value} className={`filter-btn ${type === t.value ? 'active' : ''}`}
            onClick={() => setType(t.value)}>
            {t.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <select className="form-select" style={{ width: 'auto' }} value={category} onChange={e => setCategory(e.target.value)}>
          {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
      </div>

      {/* Items grid */}
      {loading ? (
        <div className="loading-center"><div className="spinner"></div></div>
      ) : items.length > 0 ? (
        <>
          <div className="items-grid">
            {items.map(item => <ItemCard key={item._id} item={item} />)}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => fetchItems(p)}
                  className={`btn ${p === currentPage ? 'btn-primary' : 'btn-secondary'} btn-sm`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div className="emoji">🔍</div>
          <h3>No items found</h3>
          <p>Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
