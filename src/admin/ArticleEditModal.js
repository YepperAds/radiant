// ArticleEditModal.js — Cassette Futurism · Palanomic
// Shared article edit modal — used by AdminNewsPanel (manual edit) and
// AdminBulkImportPanel (auto-opened review-after-import).
import React, { useState, useRef, useCallback } from 'react';
import { updateNews } from '../services/api';

const API_BASE = process.env.REACT_APP_API_URL || 'https://palanomic-backend.onrender.com';

async function uploadImageFile(file) {
  if (!file.type.startsWith('image/')) throw new Error('Only image files are allowed.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Image must be under 10 MB.');
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/api/upload/article-image`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data.url;
}

// ── Block-based content editor ──────────────────────────────────────────────
// Sub-headers and images render as real, styled elements while editing — no
// markdown syntax is ever shown. Internally still serializes to the same
// "## text" / "![image](url)" plain-text format the public site and the AI
// drafting pipeline already parse, so nothing else has to change.

let blockIdCounter = 0;
const nextBlockId = () => `blk-${++blockIdCounter}`;

const SUBHEADER_RE = /##\s+([^.!?\n]{1,80}?)(?=\s{2,}|[.!?]|\n|!\[image\]\(|##\s|$)|!\[image\]\((\S+?)\)/g;

function parseContentToBlocks(content) {
  const blocks = [];
  if (!content) return blocks;

  const pushParagraphs = (text) => {
    text.split(/\n{2,}/).map((t) => t.trim()).filter(Boolean).forEach((t) => {
      blocks.push({ id: nextBlockId(), type: 'paragraph', text: t });
    });
  };

  let lastIndex = 0;
  let match;
  const re = new RegExp(SUBHEADER_RE);
  while ((match = re.exec(content)) !== null) {
    pushParagraphs(content.slice(lastIndex, match.index));
    if (match[1] !== undefined) {
      blocks.push({ id: nextBlockId(), type: 'subheader', text: match[1].trim() });
    } else if (match[2] !== undefined) {
      const url = match[2].trim();
      blocks.push({ id: nextBlockId(), type: 'image', url: url === 'placeholder' ? '' : url });
    }
    lastIndex = re.lastIndex;
  }
  pushParagraphs(content.slice(lastIndex));

  return blocks;
}

function serializeBlocksToContent(blocks) {
  return blocks
    .map((b) => {
      if (b.type === 'subheader') return b.text.trim() ? `## ${b.text.trim()}` : null;
      if (b.type === 'image') return b.url ? `![image](${b.url})` : null;
      return b.text.trim() || null;
    })
    .filter(Boolean)
    .join('\n\n');
}

function BlockControls({ onMoveUp, onMoveDown, onRemove, isFirst, isLast }) {
  const btn = {
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#777', width: 22, height: 22, borderRadius: 2, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', padding: 0,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0 }}>
      <button type="button" onClick={onMoveUp} disabled={isFirst} style={{ ...btn, opacity: isFirst ? 0.3 : 1 }} title="Move up">↑</button>
      <button type="button" onClick={onMoveDown} disabled={isLast} style={{ ...btn, opacity: isLast ? 0.3 : 1 }} title="Move down">↓</button>
      <button type="button" onClick={onRemove} style={{ ...btn, color: '#ef4444', borderColor: 'rgba(239,68,68,0.35)' }} title="Remove">×</button>
    </div>
  );
}

function InlineImageBlock({ url, onChange }) {
  const [isDragging,  setIsDragging]  = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const doUpload = async (file) => {
    setIsUploading(true); setError('');
    try {
      const uploadedUrl = await uploadImageFile(file);
      onChange(uploadedUrl);
    } catch (err) {
      setError(err.message || 'Upload failed.');
    } finally { setIsUploading(false); }
  };

  const handleDrop = (e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) doUpload(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    e.target.value = '';
  };

  if (url) {
    return (
      <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,102,0,0.3)' }}>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        <img src={url} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'flex-end', gap: 6, padding: '6px 10px' }}>
          <button type="button" onClick={() => fileInputRef.current?.click()} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,102,0,0.2)', border: '1px solid rgba(255,102,0,0.4)', color: '#ff6600', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Replace</button>
          <button type="button" onClick={() => onChange('')} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Remove</button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragEnter={() => setIsDragging(true)}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !isUploading && fileInputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? '#ff6600' : 'rgba(255,102,0,0.3)'}`, borderRadius: 2,
        background: isDragging ? 'rgba(255,102,0,0.06)' : '#0d0d0d', padding: '18px 14px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        cursor: isUploading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', textAlign: 'center',
      }}
    >
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
      {isUploading ? (
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ff6600' }}>Uploading…</span>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#ff6600' : '#666'} strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.66rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: isDragging ? '#ff6600' : '#777' }}>
            Image goes here — drop or <span style={{ color: '#ff6600', textDecoration: 'underline' }}>browse</span>
          </span>
        </>
      )}
      {error && <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', color: '#ef4444' }}>⚠ {error}</span>}
    </div>
  );
}

function BlockRow({ block, isFirst, isLast, onChange, onRemove, onMoveUp, onMoveDown }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: block.type === 'paragraph' ? 'flex-start' : 'center', gap: 8 }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {block.type === 'paragraph' && (
          <textarea
            value={block.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Write a paragraph…"
            rows={3}
            style={{
              width: '100%', padding: '10px 12px', background: '#0d0d0d',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2,
              fontFamily: "'Libre Baskerville', serif", fontSize: '0.88rem', lineHeight: 1.6,
              color: '#e0e0e0', outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            }}
          />
        )}
        {block.type === 'subheader' && (
          <input
            value={block.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Sub-header…"
            style={{
              width: '100%', padding: '10px 12px', background: '#0d0d0d',
              border: 'none', borderLeft: '3px solid #ff6600', borderRadius: 2,
              fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: '1.05rem',
              letterSpacing: '0.02em', color: '#f5efe0', outline: 'none', boxSizing: 'border-box',
            }}
          />
        )}
        {block.type === 'image' && (
          <InlineImageBlock url={block.url} onChange={(url) => onChange({ url })} />
        )}
      </div>
      <div style={{ opacity: hover ? 1 : 0.15, transition: 'opacity 0.1s', paddingTop: block.type === 'paragraph' ? 8 : 0 }}>
        <BlockControls onMoveUp={onMoveUp} onMoveDown={onMoveDown} onRemove={onRemove} isFirst={isFirst} isLast={isLast} />
      </div>
    </div>
  );
}

function AddBlockButton({ label, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.12em',
      textTransform: 'uppercase', background: 'rgba(255,102,0,0.06)',
      border: '1px dashed rgba(255,102,0,0.3)', color: '#ff6600',
      padding: '9px 14px', cursor: 'pointer', borderRadius: 2, flex: 1,
    }}>
      {label}
    </button>
  );
}

function ContentBlockEditor({ value, onChange, L }) {
  const [blocks, setBlocks] = useState(() => {
    const parsed = parseContentToBlocks(value);
    return parsed.length ? parsed : [{ id: nextBlockId(), type: 'paragraph', text: '' }];
  });

  const emit = (next) => {
    setBlocks(next);
    onChange(serializeBlocksToContent(next));
  };

  const updateBlock = (id, patch) => emit(blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBlock = (id) => emit(blocks.length > 1 ? blocks.filter((b) => b.id !== id) : blocks);
  const moveBlock = (id, dir) => {
    const idx = blocks.findIndex((b) => b.id === id);
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= blocks.length) return;
    const next = [...blocks];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    emit(next);
  };
  const addBlock = (type) => {
    const block = type === 'image' ? { id: nextBlockId(), type: 'image', url: '' }
      : type === 'subheader' ? { id: nextBlockId(), type: 'subheader', text: '' }
      : { id: nextBlockId(), type: 'paragraph', text: '' };
    emit([...blocks, block]);
  };

  const emptyImageCount = blocks.filter((b) => b.type === 'image' && !b.url).length;

  return (
    <div>
      <label style={L}>Content *</label>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {blocks.map((block, i) => (
          <BlockRow
            key={block.id}
            block={block}
            isFirst={i === 0}
            isLast={i === blocks.length - 1}
            onChange={(patch) => updateBlock(block.id, patch)}
            onRemove={() => removeBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, -1)}
            onMoveDown={() => moveBlock(block.id, 1)}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <AddBlockButton label="+ Paragraph" onClick={() => addBlock('paragraph')} />
        <AddBlockButton label="+ Sub-header" onClick={() => addBlock('subheader')} />
        <AddBlockButton label="+ Image" onClick={() => addBlock('image')} />
      </div>

      {emptyImageCount > 0 && (
        <div style={{ marginTop: 8, fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.1em', color: '#f59e0b' }}>
          ⚠ {emptyImageCount} image slot{emptyImageCount > 1 ? 's' : ''} still empty — left out of the article if you save without filling them.
        </div>
      )}
    </div>
  );
}

// ── Shared Image Upload Widget (article cover image) ───────────────────────────
function ImageUploader({ imageUrl, onUpload }) {
  const [isDragging,  setIsDragging]  = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true); setUploadError('');
    try {
      const url = await uploadImageFile(file);
      onUpload(url);
    } catch (err) {
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally { setIsUploading(false); }
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const F_LABEL = { display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#ff6600', marginBottom: 5, fontWeight: 500 };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={F_LABEL}>Article Image</label>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {imageUrl ? (
        <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,102,0,0.3)' }}>
          <img src={imageUrl} alt="Article preview" style={{ width: '100%', maxHeight: 180, objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 10px' }}>
            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.12em', color: '#22c55e', textTransform: 'uppercase' }}>✓ Cloud Storage</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(255,102,0,0.2)', border: '1px solid rgba(255,102,0,0.4)', color: '#ff6600', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Replace</button>
              <button type="button" onClick={() => { onUpload(''); setUploadError(''); }} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Remove</button>
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
          style={{ border: `2px dashed ${isDragging ? '#ff6600' : 'rgba(255,102,0,0.25)'}`, borderRadius: 2, background: isDragging ? 'rgba(255,102,0,0.06)' : '#0d0d0d', padding: '22px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: isUploading ? 'not-allowed' : 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
        >
          {isUploading ? (
            <>
              <svg style={{ animation: 'spin 0.8s linear infinite', color: '#ff6600' }} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ff6600' }}>Uploading…</span>
            </>
          ) : (
            <>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={isDragging ? '#ff6600' : '#555'} strokeWidth="1.5" style={{ transition: 'stroke 0.15s' }}>
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: isDragging ? '#ff6600' : '#888' }}>
                Drop image or <span style={{ color: '#ff6600', textDecoration: 'underline' }}>Browse</span>
              </div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.7rem', color: '#555' }}>JPG, PNG, WEBP, GIF — max 10 MB</div>
            </>
          )}
        </div>
      )}

      {uploadError && <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', color: '#ef4444', marginTop: 4 }}>⚠ {uploadError}</div>}
    </div>
  );
}

export default function ArticleEditModal({ item, onSuccess, onCancel, progressLabel }) {
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
      const payload = { ...form, image: form.imageUrl };
      await updateNews(item._id, payload);
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
            ✏ Edit Article{progressLabel ? ` — ${progressLabel}` : ''}
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
          <ContentBlockEditor value={form.content} onChange={(val) => setForm(p => ({ ...p, content: val }))} L={L} />

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
          </div>

          {/* ── GCS Image Upload ── */}
          <ImageUploader
            imageUrl={form.imageUrl}
            onUpload={(url) => setForm(p => ({ ...p, imageUrl: url }))}
          />

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
            {progressLabel ? 'Skip' : 'Cancel'}
          </button>
          <button onClick={handleSubmit} disabled={saving} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: saving ? '#333' : '#ff6600', color: saving ? '#666' : '#000', border: 'none', padding: '9px 24px', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
            {saving ? 'Saving…' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
