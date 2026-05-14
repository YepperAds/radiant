import React, { useState } from 'react';
import { createNews } from '../services/api';

const FIELD_STYLE = {
  width: '100%',
  background: '#0d0d0d',
  border: '1px solid rgba(255,102,0,0.2)',
  borderRadius: 2,
  padding: '9px 12px',
  fontFamily: "'Libre Baskerville', serif",
  fontSize: '0.88rem',
  color: '#f0f0f0',
  outline: 'none',
  transition: 'border-color 0.15s',
  boxSizing: 'border-box',
};

const LABEL_STYLE = {
  display: 'block',
  fontFamily: "'Oswald', sans-serif",
  fontSize: '0.65rem',
  letterSpacing: '0.22em',
  textTransform: 'uppercase',
  color: '#ff6600',
  marginBottom: 6,
  fontWeight: 500,
};

const SECTION_STYLE = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

export default function AddNewsForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    author: '',
    category: 'growth',
    status: 'draft',
    featured: false,
    image: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await createNews(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create article.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:wght@400;700&display=swap');
        @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)} }
        .anf-field:focus { border-color: #ff6600 !important; }
        .anf-cancel:hover { background: rgba(255,102,0,0.08) !important; color: #f0f0f0 !important; border-color: rgba(255,102,0,0.4) !important; }
        .anf-submit:hover:not(:disabled) { background: #ff9944 !important; }
        .anf-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .anf-close:hover { background: rgba(255,102,0,0.12) !important; color: #f0f0f0 !important; }
        .anf-overlay { animation: fadeIn 0.18s ease; }
      `}</style>

      {/* Overlay */}
      <div
        className="anf-overlay"
        onClick={e => e.target === e.currentTarget && onCancel()}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.88)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '32px 16px', overflowY: 'auto',
        }}
      >
        <div style={{
          background: '#111111',
          border: '1px solid rgba(255,102,0,0.25)',
          borderTop: '3px solid #ff6600',
          borderRadius: 2,
          width: '100%',
          maxWidth: 720,
          fontFamily: "'Oswald', sans-serif",
          overflow: 'hidden',
        }}>

          {/* ── Header ── */}
          <div style={{
            background: '#0a0a0a',
            borderBottom: '1px solid rgba(255,102,0,0.2)',
            padding: '16px 24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <div style={{
                fontSize: '0.65rem', letterSpacing: '0.28em',
                textTransform: 'uppercase', color: '#ff6600',
                marginBottom: 3,
              }}>
                Content Management
              </div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: '1rem',
                fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: '#f0f0f0',
              }}>
                New Article
              </div>
            </div>
            <button
              className="anf-close"
              onClick={onCancel}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,102,0,0.25)',
                color: '#888',
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', borderRadius: 2,
                transition: 'all 0.15s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div style={{
              margin: '0', padding: '10px 24px',
              background: 'rgba(239,68,68,0.08)',
              borderBottom: '1px solid rgba(239,68,68,0.2)',
              borderLeft: '3px solid #ef4444',
              fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
              letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ef4444',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* ── Form body ── */}
          <form onSubmit={handleSubmit}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              {/* Title */}
              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Title</label>
                <input
                  className="anf-field"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Article headline…"
                  style={FIELD_STYLE}
                />
              </div>

              {/* Summary */}
              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Summary</label>
                <textarea
                  className="anf-field"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  required
                  rows={2}
                  placeholder="Brief description shown in article cards…"
                  style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.6 }}
                />
              </div>

              {/* Content */}
              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Content</label>
                <textarea
                  className="anf-field"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  placeholder="Full article body…"
                  style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.75 }}
                />
              </div>

              {/* Author + Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={SECTION_STYLE}>
                  <label style={LABEL_STYLE}>Author</label>
                  <input
                    className="anf-field"
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    placeholder="Author name…"
                    style={FIELD_STYLE}
                  />
                </div>
                <div style={SECTION_STYLE}>
                  <label style={LABEL_STYLE}>Category</label>
                  <select
                    className="anf-field"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ ...FIELD_STYLE, cursor: 'pointer' }}
                  >
                    <option value="growth">Growth</option>
                    <option value="investment">Investment</option>
                    <option value="trade">Trade</option>
                    <option value="policy">Policy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Status + Image URL */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={SECTION_STYLE}>
                  <label style={LABEL_STYLE}>Status</label>
                  <select
                    className="anf-field"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{ ...FIELD_STYLE, cursor: 'pointer' }}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div style={SECTION_STYLE}>
                  <label style={LABEL_STYLE}>Image URL</label>
                  <input
                    className="anf-field"
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://…"
                    style={FIELD_STYLE}
                  />
                </div>
              </div>

              {/* Featured toggle */}
              <div
                onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px',
                  background: formData.featured ? 'rgba(255,102,0,0.08)' : '#0d0d0d',
                  border: `1px solid ${formData.featured ? 'rgba(255,102,0,0.35)' : 'rgba(255,102,0,0.15)'}`,
                  borderRadius: 2, cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {/* Custom checkbox */}
                <div style={{
                  width: 16, height: 16, borderRadius: 2, flexShrink: 0,
                  border: `2px solid ${formData.featured ? '#ff6600' : 'rgba(255,102,0,0.3)'}`,
                  background: formData.featured ? '#ff6600' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {formData.featured && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: formData.featured ? '#ff6600' : '#888',
                    transition: 'color 0.15s',
                  }}>
                    Featured Article
                  </div>
                  <div style={{
                    fontFamily: "'Libre Baskerville', serif", fontSize: '0.78rem',
                    color: '#555', marginTop: 2,
                  }}>
                    Pinned to the top of the news feed
                  </div>
                </div>
              </div>

            </div>

            {/* ── Footer ── */}
            <div style={{
              background: '#0a0a0a',
              borderTop: '1px solid rgba(255,102,0,0.15)',
              padding: '14px 24px',
              display: 'flex', justifyContent: 'flex-end', gap: 10,
            }}>
              <button
                type="button"
                className="anf-cancel"
                onClick={onCancel}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: 'transparent',
                  border: '1px solid rgba(255,102,0,0.2)',
                  color: '#666', padding: '9px 20px',
                  cursor: 'pointer', borderRadius: 2,
                  transition: 'all 0.15s',
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="anf-submit"
                disabled={isLoading}
                style={{
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
                  fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase',
                  background: '#ff6600', color: '#000',
                  border: '1px solid #ff6600',
                  padding: '9px 24px',
                  cursor: 'pointer', borderRadius: 2,
                  display: 'flex', alignItems: 'center', gap: 8,
                  transition: 'background 0.15s',
                }}
              >
                {isLoading ? (
                  <>
                    <svg style={{ animation: 'spin 0.8s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Publish Article
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}