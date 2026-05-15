import React, { useState, useRef, useCallback } from 'react';
import { createNews } from '../services/api';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

// ── Image Upload Widget ────────────────────────────────────────────────────────
function ImageUploader({ imageUrl, onUpload }) {
  const [isDragging,  setIsDragging]  = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Only image files are allowed.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image must be under 10 MB.');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await fetch(`${API_BASE}api/upload/article-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      onUpload(data.url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleRemove = () => { onUpload(''); setUploadError(''); };

  return (
    <div style={SECTION_STYLE}>
      <label style={LABEL_STYLE}>Article Image</label>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {imageUrl ? (
        <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,102,0,0.3)' }}>
          <img src={imageUrl} alt="Article preview" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px' }}>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.12em', color: '#22c55e', textTransform: 'uppercase' }}>✓ Uploaded to Cloud Storage</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,102,0,0.2)', border: '1px solid rgba(255,102,0,0.4)', color: '#ff6600', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Replace</button>
              <button type="button" onClick={handleRemove} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Remove</button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={() => setIsDragging(true)}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? '#ff6600' : 'rgba(255,102,0,0.25)'}`, borderRadius: 2, background: isDragging ? 'rgba(255,102,0,0.06)' : '#0d0d0d', padding: '28px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: isUploading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
        >
          {isUploading ? (
            <>
              <svg style={{ animation: 'spin 0.8s linear infinite', color: '#ff6600' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#ff6600' }}>Uploading to Cloud Storage…</span>
            </>
          ) : (
            <>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#ff6600' : '#555'} strokeWidth="1.5" style={{ transition: 'stroke 0.15s' }}>
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <div>
                <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: isDragging ? '#ff6600' : '#aaa', transition: 'color 0.15s' }}>
                  Drop image here or <span style={{ color: '#ff6600', textDecoration: 'underline' }}>Browse</span>
                </div>
                <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.72rem', color: '#555', marginTop: 4 }}>JPG, PNG, WEBP, GIF — max 10 MB</div>
              </div>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#ef4444', marginTop: 4 }}>⚠ {uploadError}</div>
      )}
    </div>
  );
}

// ── Main Form ──────────────────────────────────────────────────────────────────
export default function AddNewsForm({ onSuccess, onCancel }) {
  const [formData, setFormData] = useState({ title: '', summary: '', content: '', author: '', category: 'growth', status: 'draft', featured: false, image: '' });
  const [error,     setError]     = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        @keyframes spin   { to { transform: rotate(360deg); } }
        .anf-field:focus  { border-color: #ff6600 !important; }
        .anf-cancel:hover { background: rgba(255,102,0,0.08) !important; color: #f0f0f0 !important; border-color: rgba(255,102,0,0.4) !important; }
        .anf-submit:hover:not(:disabled) { background: #ff9944 !important; }
        .anf-submit:disabled { opacity: 0.5; cursor: not-allowed; }
        .anf-close:hover  { background: rgba(255,102,0,0.12) !important; color: #f0f0f0 !important; }
        .anf-overlay { animation: fadeIn 0.18s ease; }
      `}</style>

      <div className="anf-overlay" onClick={e => e.target === e.currentTarget && onCancel()} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' }}>
        <div style={{ background: '#111111', border: '1px solid rgba(255,102,0,0.25)', borderTop: '3px solid #ff6600', borderRadius: 2, width: '100%', maxWidth: 720, fontFamily: "'Oswald', sans-serif", overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ background: '#0a0a0a', borderBottom: '1px solid rgba(255,102,0,0.2)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#ff6600', marginBottom: 3 }}>Content Management</div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f0f0f0' }}>New Article</div>
            </div>
            <button className="anf-close" onClick={onCancel} style={{ background: 'transparent', border: '1px solid rgba(255,102,0,0.25)', color: '#888', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {error && (
            <div style={{ padding: '10px 24px', background: 'rgba(239,68,68,0.08)', borderBottom: '1px solid rgba(239,68,68,0.2)', borderLeft: '3px solid #ef4444', fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ef4444' }}>
              ⚠ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Title</label>
                <input className="anf-field" type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Article headline…" style={FIELD_STYLE} />
              </div>

              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Summary</label>
                <textarea className="anf-field" name="summary" value={formData.summary} onChange={handleChange} required rows={2} placeholder="Brief description shown in article cards…" style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Content</label>
                <textarea className="anf-field" name="content" value={formData.content} onChange={handleChange} required rows={8} placeholder="Full article body…" style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.75 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={SECTION_STYLE}>
                  <label style={LABEL_STYLE}>Author</label>
                  <input className="anf-field" type="text" name="author" value={formData.author} onChange={handleChange} required placeholder="Author name…" style={FIELD_STYLE} />
                </div>
                <div style={SECTION_STYLE}>
                  <label style={LABEL_STYLE}>Category</label>
                  <select className="anf-field" name="category" value={formData.category} onChange={handleChange} style={{ ...FIELD_STYLE, cursor: 'pointer' }}>
                    <option value="growth">Growth</option>
                    <option value="investment">Investment</option>
                    <option value="trade">Trade</option>
                    <option value="policy">Policy</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div style={SECTION_STYLE}>
                <label style={LABEL_STYLE}>Status</label>
                <select className="anf-field" name="status" value={formData.status} onChange={handleChange} style={{ ...FIELD_STYLE, cursor: 'pointer', maxWidth: 220 }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="review">Review</option>
                </select>
              </div>

              {/* ── GCS Image Upload ── */}
              <ImageUploader imageUrl={formData.image} onUpload={(url) => setFormData(prev => ({ ...prev, image: url }))} />

              {/* Featured toggle */}
              <div onClick={() => setFormData(p => ({ ...p, featured: !p.featured }))} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', background: formData.featured ? 'rgba(255,102,0,0.08)' : '#0d0d0d', border: `1px solid ${formData.featured ? 'rgba(255,102,0,0.35)' : 'rgba(255,102,0,0.15)'}`, borderRadius: 2, cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ width: 16, height: 16, borderRadius: 2, flexShrink: 0, border: `2px solid ${formData.featured ? '#ff6600' : 'rgba(255,102,0,0.3)'}`, background: formData.featured ? '#ff6600' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                  {formData.featured && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </div>
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: formData.featured ? '#ff6600' : '#888', transition: 'color 0.15s' }}>Featured Article</div>
                  <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.78rem', color: '#555', marginTop: 2 }}>Pinned to the top of the news feed</div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,102,0,0.15)', padding: '14px 24px', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button type="button" className="anf-cancel" onClick={onCancel} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,102,0,0.2)', color: '#666', padding: '9px 20px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s' }}>Cancel</button>
              <button type="submit" className="anf-submit" disabled={isLoading} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', background: '#ff6600', color: '#000', border: '1px solid #ff6600', padding: '9px 24px', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s' }}>
                {isLoading ? (
                  <><svg style={{ animation: 'spin 0.8s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Creating…</>
                ) : (
                  <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>Publish Article</>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </>
  );
}
