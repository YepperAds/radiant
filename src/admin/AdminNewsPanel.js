// AdminNewsPanel.js — Cassette Futurism · Palanomic
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import AddNewsForm from './AddNewsForm';
import { getNews, deleteNews, updateNews } from '../services/api';

const CAT_BADGES = {
  growth:     { bg: '#0f2a0f', text: '#6adf6a' },
  investment: { bg: '#0a1a2e', text: '#7ab8f5' },
  trade:      { bg: '#2a1200', text: '#ff8c3a' },
  policy:     { bg: '#1e0a2a', text: '#c87ae0' },
  other:      { bg: '#1a1a1a', text: '#aaaaaa' },
};

const STATUS_STYLE = {
  published: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.25)'  },
  draft:     { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  review:    { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

export default function AdminNewsPanel() {
  const [newsItems,       setNewsItems]       = useState([]);
  const [isLoading,       setIsLoading]       = useState(true);
  const [searchTerm,      setSearchTerm]      = useState('');
  const [filterStatus,    setFilterStatus]    = useState('all');
  const [filterCategory,  setFilterCategory]  = useState('all');
  const [currentPage,     setCurrentPage]     = useState(1);
  const [totalPages,      setTotalPages]      = useState(1);
  const [selectedItems,   setSelectedItems]   = useState([]);
  const [showAddForm,     setShowAddForm]     = useState(false);
  const [editItem,        setEditItem]        = useState(null);
  const [error,           setError]           = useState('');
  const navigate = useNavigate();
  const itemsPerPage = 10;

  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNews({
        page: currentPage, limit: itemsPerPage, search: searchTerm,
        status:   filterStatus   === 'all' ? undefined : filterStatus,
        category: filterCategory === 'all' ? undefined : filterCategory,
      });
      setNewsItems(response.news);
      setTotalPages(response.pagination.total);
    } catch {
      setError('Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, filterStatus, filterCategory]);

  useEffect(() => { fetchNews(); }, [fetchNews]);

  const handleDeleteSelected = async () => {
    if (!window.confirm('Delete selected articles? This cannot be undone.')) return;
    try {
      await Promise.all(selectedItems.map(id => deleteNews(id)));
      setSelectedItems([]);
      fetchNews();
    } catch { setError('Failed to delete'); }
  };

  const handleDeleteSingle = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    try { await deleteNews(id); fetchNews(); }
    catch { setError('Failed to delete'); }
  };

  const handleSelectAll = (e) =>
    setSelectedItems(e.target.checked ? newsItems.map(i => i._id) : []);

  const handleSelectItem = (id) =>
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleLogout = () => {
    ['authToken', 'userRole', 'userEmail', 'userName'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const TH_STYLE = {
    background: '#0a0a0a',
    borderBottom: '1px solid #ff6600',
    padding: '10px 14px',
    fontFamily: "'Oswald', sans-serif",
    fontSize: '0.62rem',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#ff6600',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    fontWeight: 500,
  };

  const TD_STYLE = {
    padding: '12px 14px',
    borderBottom: '1px solid rgba(255,102,0,0.07)',
    verticalAlign: 'middle',
    color: '#aaaaaa',
  };

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        .skel {
          background: linear-gradient(90deg,#1e1e1e 25%,#2a2a2a 50%,#1e1e1e 75%);
          background-size: 200% 100%; animation: shimmer 1.4s infinite; border-radius: 2px;
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
        .news-row:hover td { background: rgba(255,102,0,0.04) !important; }
        .filter-select:focus { border-color: #ff6600 !important; outline: none; }
        .search-inp:focus { border-color: #ff6600 !important; outline: none; }
        .add-btn:hover { background: #ff9944 !important; }
        .act-edit:hover { background: rgba(255,102,0,0.12) !important; }
        .act-del:hover  { background: rgba(239,68,68,0.1) !important; }
        .page-btn-item:hover:not(.active-page) { border-color: #ff6600 !important; color: #ff6600 !important; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="news" />

        <main style={{ flex: 1, padding: '28px 32px', overflow: 'hidden' }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f0f0f0',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6600', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                News Articles
              </div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '0.85rem', color: '#555555', marginTop: 4 }}>
                Create, edit, and manage economic news content
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="add-btn"
              style={{
                fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                background: '#ff6600', color: '#000', border: 'none',
                padding: '10px 20px', cursor: 'pointer', borderRadius: 2,
                display: 'flex', alignItems: 'center', gap: 7,
                transition: 'background 0.15s',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Article
            </button>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 16, padding: '10px 16px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderLeft: '3px solid #ef4444', borderRadius: 2,
              fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Filters */}
          <div style={{
            background: '#151515', border: '1px solid rgba(255,102,0,0.15)',
            borderRadius: 2, padding: '14px 18px', marginBottom: 18,
            display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 10, alignItems: 'center',
          }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#444444' }}
                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                className="search-inp"
                type="text"
                placeholder="Search articles…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: '#0d0d0d', border: '1px solid rgba(255,102,0,0.2)', borderRadius: 2,
                  padding: '8px 12px 8px 32px',
                  fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem',
                  color: '#f0f0f0', transition: 'border-color 0.15s',
                }}
              />
            </div>

            {[
              { value: filterStatus, onChange: setFilterStatus, options: [
                ['all','All Status'],['published','Published'],['draft','Draft'],['review','In Review'],
              ]},
              { value: filterCategory, onChange: setFilterCategory, options: [
                ['all','All Categories'],['growth','Growth'],['investment','Investment'],
                ['trade','Trade'],['policy','Policy'],['other','Other'],
              ]},
            ].map((sel, i) => (
              <select
                key={i}
                className="filter-select"
                value={sel.value}
                onChange={e => sel.onChange(e.target.value)}
                style={{
                  background: '#0d0d0d', border: '1px solid rgba(255,102,0,0.2)', borderRadius: 2,
                  padding: '8px 12px',
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: '#aaaaaa', transition: 'border-color 0.15s', cursor: 'pointer',
                }}
              >
                {sel.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            ))}
          </div>

          {/* Bulk delete bar */}
          {selectedItems.length > 0 && (
            <div style={{
              marginBottom: 12, padding: '10px 16px',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              borderLeft: '3px solid #ef4444', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ef4444' }}>
                {selectedItems.length} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  background: '#ef4444', color: '#fff', border: 'none',
                  padding: '5px 14px', cursor: 'pointer', borderRadius: 2,
                }}
              >
                Delete Selected
              </button>
            </div>
          )}

          {/* Table */}
          <div style={{ background: '#151515', border: '1px solid rgba(255,102,0,0.15)', borderRadius: 2, overflow: 'hidden' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <div style={{
                  width: 36, height: 36, border: '3px solid #1e1e1e',
                  borderTopColor: '#ff6600', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            ) : (
              <>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr>
                        <th style={{ ...TH_STYLE, width: 40 }}>
                          <input
                            type="checkbox"
                            style={{ accentColor: '#ff6600', width: 13, height: 13, cursor: 'pointer' }}
                            onChange={handleSelectAll}
                            checked={selectedItems.length === newsItems.length && newsItems.length > 0}
                          />
                        </th>
                        {['Title', 'Author', 'Category', 'Status', 'Date', 'Actions'].map(h => (
                          <th key={h} style={TH_STYLE}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {newsItems.map((item, i) => {
                        const cs = CAT_BADGES[item.category] || CAT_BADGES.other;
                        const ss = STATUS_STYLE[item.status]  || STATUS_STYLE.draft;
                        return (
                          <tr key={item._id} className="news-row">
                            <td style={{ ...TD_STYLE, width: 40 }}>
                              <input
                                type="checkbox"
                                style={{ accentColor: '#ff6600', width: 13, height: 13, cursor: 'pointer' }}
                                checked={selectedItems.includes(item._id)}
                                onChange={() => handleSelectItem(item._id)}
                              />
                            </td>
                            <td style={TD_STYLE}>
                              <div style={{
                                fontFamily: "'Libre Baskerville', serif", fontWeight: 700,
                                fontSize: '0.88rem', color: '#e0e0e0', lineHeight: 1.3,
                                maxWidth: 280, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                              }}>
                                {item.title}
                              </div>
                              <div style={{
                                fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic',
                                fontSize: '0.75rem', color: '#444444', marginTop: 2,
                                maxWidth: 280, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                              }}>
                                {item.summary?.substring(0, 70)}…
                              </div>
                            </td>
                            <td style={{ ...TD_STYLE, whiteSpace: 'nowrap' }}>
                              <span style={{
                                fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem',
                                letterSpacing: '0.06em', color: '#888888',
                              }}>{item.author}</span>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem',
                                letterSpacing: '0.14em', fontWeight: 600, textTransform: 'uppercase',
                                padding: '2px 8px', borderRadius: 2,
                                background: cs.bg, color: cs.text,
                              }}>
                                {item.category}
                              </span>
                            </td>
                            <td style={TD_STYLE}>
                              <span style={{
                                fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem',
                                letterSpacing: '0.14em', fontWeight: 700, textTransform: 'uppercase',
                                padding: '3px 10px', borderRadius: 2,
                                background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
                              }}>
                                {item.status}
                              </span>
                            </td>
                            <td style={{ ...TD_STYLE, whiteSpace: 'nowrap' }}>
                              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.08em', color: '#555555' }}>
                                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            </td>
                            <td style={{ ...TD_STYLE, whiteSpace: 'nowrap' }}>
                              <button
                                className="act-edit"
                                onClick={() => setEditItem(item)}
                                style={{
                                  fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
                                  letterSpacing: '0.12em', textTransform: 'uppercase',
                                  background: 'none', border: '1px solid rgba(255,153,68,0.2)',
                                  color: '#ff9944', padding: '4px 10px', cursor: 'pointer',
                                  borderRadius: 2, marginRight: 6, transition: 'background 0.15s',
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="act-del"
                                onClick={() => handleDeleteSingle(item._id)}
                                style={{
                                  fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
                                  letterSpacing: '0.12em', textTransform: 'uppercase',
                                  background: 'none', border: '1px solid rgba(239,68,68,0.2)',
                                  color: '#ef4444', padding: '4px 10px', cursor: 'pointer',
                                  borderRadius: 2, transition: 'background 0.15s',
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{
                    padding: '14px 18px', background: '#0d0d0d',
                    borderTop: '1px solid rgba(255,102,0,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#444444' }}>
                      Page {currentPage} of {totalPages}
                    </span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button
                        className="page-btn-item"
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                          background: 'none', border: '1px solid rgba(255,102,0,0.2)', color: '#555555',
                          padding: '5px 14px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
                          opacity: currentPage === 1 ? 0.3 : 1,
                        }}
                      >
                        ← Prev
                      </button>
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.1em',
                            background: currentPage === page ? '#ff6600' : 'none',
                            border: `1px solid ${currentPage === page ? '#ff6600' : 'rgba(255,102,0,0.2)'}`,
                            color: currentPage === page ? '#000' : '#555555',
                            padding: '5px 10px', cursor: 'pointer', borderRadius: 2,
                            fontWeight: currentPage === page ? 700 : 400,
                          }}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        className="page-btn-item"
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                          background: 'none', border: '1px solid rgba(255,102,0,0.2)', color: '#555555',
                          padding: '5px 14px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
                          opacity: currentPage === totalPages ? 0.3 : 1,
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {showAddForm && (
        <AddNewsForm
          onSuccess={() => { setShowAddForm(false); fetchNews(); }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editItem && (
        <EditNewsModal
          item={editItem}
          onSuccess={() => { setEditItem(null); fetchNews(); }}
          onCancel={() => setEditItem(null)}
        />
      )}
    </div>
  );
}

// ─── Edit News Modal ───────────────────────────────────────────────────────────
function EditNewsModal({ item, onSuccess, onCancel }) {
  const [form, setForm] = useState({
    title:    item.title    || '',
    summary:  item.summary  || '',
    content:  item.content  || '',
    author:   item.author   || '',
    category: item.category || 'growth',
    status:   item.status   || 'draft',
    featured: item.featured || false,
    imageUrl: item.imageUrl || item.image || '',
    editNote: '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const F = {
    width: '100%', padding: '9px 12px', background: '#0d0d0d',
    border: '1px solid rgba(255,102,0,0.2)', borderRadius: 2,
    fontFamily: "'Libre Baskerville', serif", fontSize: '0.85rem',
    color: '#f0f0f0', outline: 'none', boxSizing: 'border-box',
  };
  const L = {
    display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
    letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff6600',
    marginBottom: 5, fontWeight: 500,
  };

  const isPublished = item.status === 'published' || form.status === 'published';

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.'); return;
    }
    setSaving(true); setError('');
    try {
      await updateNews(item._id, form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={e => e.target === e.currentTarget && onCancel()}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' }}
    >
      <div style={{ background: '#151515', border: '2px solid #ff6600', borderRadius: 2, width: '100%', maxWidth: 720, boxShadow: '0 24px 64px rgba(0,0,0,0.7)', overflow: 'hidden' }}>

        {/* Header */}
        <div style={{ background: '#0a0a0a', padding: '14px 22px', borderBottom: '1px solid #ff6600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ff6600' }}>
            ✏ Edit Article
          </span>
          <button onClick={onCancel} style={{ background: 'transparent', border: '1px solid #ff6600', color: '#ff6600', width: 30, height: 30, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Article identity banner */}
        <div style={{ background: 'rgba(255,102,0,0.04)', borderBottom: '1px solid rgba(255,102,0,0.1)', padding: '10px 22px' }}>
          <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem', color: '#888', fontStyle: 'italic', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
            {item.title}
          </div>
        </div>

        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderLeft: '3px solid #ef4444', borderRadius: 2, padding: '10px 14px', fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.08em', color: '#ef4444' }}>
              ⚠ {error}
            </div>
          )}

          <div><label style={L}>Title *</label><input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={F} /></div>
          <div><label style={L}>Summary</label><textarea value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} rows={2} style={{ ...F, resize: 'vertical' }} /></div>
          <div><label style={L}>Content *</label><textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={9} style={{ ...F, resize: 'vertical' }} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={L}>Author</label><input value={form.author} onChange={e => setForm(p => ({ ...p, author: e.target.value }))} style={F} /></div>
            <div>
              <label style={L}>Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={{ ...F, cursor: 'pointer' }}>
                {['growth','investment','trade','policy','other'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={L}>Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={{ ...F, cursor: 'pointer' }}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="review">In Review</option>
              </select>
            </div>
            <div><label style={L}>Image URL</label><input value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://…" style={F} /></div>
          </div>

          {/* Edit note — only relevant for published articles */}
          {isPublished && (
            <div>
              <label style={{ ...L, color: '#f59e0b' }}>
                Edit Note&nbsp;
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: '0.7rem', color: '#666' }}>(optional — shown as "UPDATED" badge to users)</span>
              </label>
              <textarea
                value={form.editNote}
                onChange={e => setForm(p => ({ ...p, editNote: e.target.value }))}
                placeholder="e.g. Corrected Q2 figures · Updated with central bank comment"
                rows={2}
                maxLength={500}
                style={{ ...F, resize: 'vertical', border: '1px solid rgba(245,158,11,0.3)' }}
              />
              <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', color: '#f59e0b', marginTop: 5 }}>
                ⚠ Saving will mark this article as UPDATED for all readers
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,102,0,0.15)', padding: '14px 22px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onCancel} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,102,0,0.2)', color: '#666', padding: '9px 20px', cursor: 'pointer', borderRadius: 2 }}>
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: saving ? '#333' : '#ff6600', color: saving ? '#666' : '#000', border: 'none', padding: '9px 24px', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
            {saving ? 'Saving…' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}