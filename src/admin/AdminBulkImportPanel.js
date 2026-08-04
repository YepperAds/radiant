// AdminBulkImportPanel.js — Cassette Futurism · Palanomic
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import ArticleEditModal from './ArticleEditModal';
import { bulkImport, generateAIDraft, getNewsById } from '../services/api';

const EXAMPLE = `{
  "articles": [
    { "title": "", "summary": "", "content": "", "author": "", "category": "growth", "featured": false, "image": "" }
  ],
  "stocks": [
    { "sym": "", "name": "", "sector": "", "price": "", "raw": 0, "change": "", "chgNum": 0, "chgDir": "up", "explain": "", "eli5": "", "metadataOnly": false }
  ],
  "forex": [
    { "sym": "", "name": "", "flag": "", "price": "", "raw": 0, "change": "", "chgNum": 0, "chgDir": "up", "explain": "", "eli5": "", "metadataOnly": false }
  ],
  "goods": [
    { "sym": "", "name": "", "sector": "", "price": "", "raw": 0, "change": "", "chgNum": 0, "chgDir": "up", "explain": "", "eli5": "", "metadataOnly": false }
  ]
}`;

const CATEGORY_LABELS = { articles: 'Articles', stocks: 'Stocks', forex: 'Forex', goods: 'Goods' };

const ACTION_STYLE = {
  created:   { color: '#22c55e', label: 'Created' },
  'new-data': { color: '#5b8fc8', label: 'New Data' },
  edit:      { color: '#f59e0b', label: 'Edited' },
};

const labelStyle = {
  display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
  letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666666', marginBottom: 8,
};

export default function AdminBulkImportPanel() {
  const [rawInput,   setRawInput]   = useState('');
  const [drafting,   setDrafting]   = useState(false);
  const [draftError, setDraftError] = useState('');
  const [raw,        setRaw]        = useState('');
  const [parseError, setParseError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [response,   setResponse]   = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [reviewIds,   setReviewIds]   = useState([]);
  const [reviewItem,  setReviewItem]  = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviewError, setReviewError] = useState('');
  const navigate = useNavigate();

  const showNextReview = async (ids) => {
    if (!ids.length) { setReviewItem(null); setReviewIds([]); return; }
    const [id, ...rest] = ids;
    try {
      const item = await getNewsById(id);
      setReviewItem(item);
      setReviewIds(rest);
    } catch {
      setReviewError('Could not load one of the created articles — skipped it.');
      await showNextReview(rest);
    }
  };

  const handleReviewDone = () => { showNextReview(reviewIds); };

  const handleDraft = async () => {
    setDraftError('');
    setResponse(null);
    setDrafting(true);
    try {
      const data = await generateAIDraft(rawInput);
      setRaw(data.json);
      setParseError('');
    } catch (err) {
      setDraftError(err.response?.data?.message || 'Drafting failed');
    } finally {
      setDrafting(false);
    }
  };

  const handleLogout = () => {
    ['authToken', 'userRole', 'userEmail', 'userName'].forEach((k) => localStorage.removeItem(k));
    navigate('/login');
  };

  const handleSubmit = async () => {
    setParseError('');
    setSubmitError('');
    setReviewError('');
    setResponse(null);

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      setParseError(`Invalid JSON: ${err.message}`);
      return;
    }

    setSubmitting(true);
    try {
      const data = await bulkImport(payload);
      setResponse(data);
      const createdArticleIds = (data.results?.articles || [])
        .filter((r) => r.ok && r.id)
        .map((r) => r.id);
      if (createdArticleIds.length) {
        setReviewCount(createdArticleIds.length);
        showNextReview(createdArticleIds);
      }
    } catch (err) {
      setSubmitError(err.response?.data?.message || err.response?.data?.error || 'Bulk import failed');
    } finally {
      setSubmitting(false);
    }
  };

  const loadExample = () => setRaw(EXAMPLE);

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .bi-btn-primary:hover:not(:disabled) { background: #ff9944 !important; }
        .bi-btn-ghost:hover { border-color: #ff6600 !important; color: #ff6600 !important; }
        .bi-textarea:focus { border-color: #ff6600 !important; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="bulk-import" />

        <main style={{ flex: 1, padding: '28px 32px' }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f0f0f0',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6600', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Bulk Import
              </div>
              <div style={{
                fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem',
                color: '#666666', marginTop: 6, maxWidth: 560,
              }}>
                Paste JSON from the Palanomic drafting project. Articles land as drafts for review.
                Stocks/Forex/Goods publish immediately as "New Data" unless marked <code>metadataOnly</code>.
              </div>
            </div>
            <button className="bi-btn-ghost" onClick={loadExample} style={{
              fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.14em',
              textTransform: 'uppercase', background: 'transparent', border: '1px solid rgba(255,102,0,0.25)',
              color: '#888888', padding: '9px 16px', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
            }}>
              Load Contract Template
            </button>
          </div>

          {/* AI Draft */}
          <div style={{
            marginBottom: 24, padding: '16px 18px', background: '#151515',
            border: '1px solid rgba(255,102,0,0.15)', borderRadius: 2,
          }}>
            <label style={labelStyle}>Draft With Claude</label>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.78rem', color: '#666666', marginBottom: 10 }}>
              Paste a post, a topic, or a price list. Claude researches (with web search), drafts the bulk import JSON below, and you review before submitting.
            </div>
            <textarea
              className="bi-textarea"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="e.g. Bank of Kigali just posted this on X: ... draft an article on it."
              style={{
                width: '100%', minHeight: 100, padding: '12px 14px', background: '#0d0d0d',
                border: '1px solid rgba(255,102,0,0.2)', borderRadius: 2, color: '#f0f0f0',
                fontFamily: "'Libre Baskerville', serif", fontSize: '0.85rem', lineHeight: 1.5,
                outline: 'none', resize: 'vertical', boxSizing: 'border-box', marginBottom: 10,
              }}
            />
            <button
              className="bi-btn-ghost"
              onClick={handleDraft}
              disabled={drafting || !rawInput.trim()}
              style={{
                fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em',
                textTransform: 'uppercase', background: drafting ? 'rgba(255,102,0,0.15)' : '#ff6600',
                color: drafting ? '#a86' : '#000', border: 'none', padding: '9px 20px',
                cursor: drafting || !rawInput.trim() ? 'not-allowed' : 'pointer', borderRadius: 2,
                opacity: !rawInput.trim() ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {drafting && (
                <span style={{
                  width: 12, height: 12, border: '2px solid rgba(0,0,0,0.3)',
                  borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block',
                }} />
              )}
              {drafting ? 'Drafting… (can take a minute)' : 'Draft With Claude'}
            </button>
            {draftError && (
              <div style={{ marginTop: 10, fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#ef4444' }}>
                ⚠ {draftError}
              </div>
            )}
          </div>

          {/* Textarea */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Bulk Import JSON</label>
            <textarea
              className="bi-textarea"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder='{ "articles": [], "stocks": [], "forex": [], "goods": [] }'
              spellCheck={false}
              style={{
                width: '100%', minHeight: 360, padding: '14px 16px', background: '#0d0d0d',
                border: `1px solid ${parseError ? '#ef4444' : 'rgba(255,102,0,0.2)'}`,
                borderRadius: 2, color: '#f0f0f0', fontFamily: "'Courier New', monospace",
                fontSize: '0.82rem', lineHeight: 1.5, outline: 'none', resize: 'vertical', boxSizing: 'border-box',
              }}
            />
            {parseError && (
              <div style={{ marginTop: 8, fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#ef4444' }}>
                ⚠ {parseError}
              </div>
            )}
          </div>

          <button
            className="bi-btn-primary"
            onClick={handleSubmit}
            disabled={submitting || !raw.trim()}
            style={{
              fontFamily: "'Oswald', sans-serif", fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              background: '#ff6600', color: '#000', border: 'none',
              padding: '11px 24px', cursor: submitting || !raw.trim() ? 'not-allowed' : 'pointer',
              borderRadius: 2, opacity: submitting || !raw.trim() ? 0.5 : 1,
              display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.15s',
            }}
          >
            {submitting && (
              <span style={{
                width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)',
                borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block',
              }} />
            )}
            {submitting ? 'Submitting…' : 'Submit Bulk Import'}
          </button>

          {submitError && (
            <div style={{
              marginTop: 16, padding: '10px 16px',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
              borderLeft: '3px solid #ef4444', borderRadius: 2,
              fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', color: '#ef4444',
            }}>
              ⚠ {submitError}
            </div>
          )}

          {response && (
            <div style={{ marginTop: 28 }}>
              <div style={{
                fontFamily: "'Oswald', sans-serif", fontSize: '0.85rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f0f0f0', marginBottom: 14,
              }}>
                Results
              </div>

              {/* Summary tiles */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {Object.entries(response.summary).map(([key, s]) => (
                  <div key={key} style={{
                    background: '#151515', border: '1px solid rgba(255,102,0,0.15)',
                    borderRadius: 2, padding: '14px 16px',
                  }}>
                    <div style={labelStyle}>{CATEGORY_LABELS[key] || key}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#22c55e' }}>{s.ok}</span>
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#666' }}>/ {s.total} ok</span>
                    </div>
                    {s.failed > 0 && (
                      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', color: '#ef4444', marginTop: 4 }}>
                        {s.failed} failed
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Per-item results */}
              {Object.entries(response.results).map(([key, items]) => (
                items.length > 0 && (
                  <div key={key} style={{ marginBottom: 18 }}>
                    <div style={{
                      fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem', letterSpacing: '0.18em',
                      textTransform: 'uppercase', color: '#666666', marginBottom: 8,
                    }}>
                      {CATEGORY_LABELS[key] || key}
                    </div>
                    <div style={{ background: '#151515', border: '1px solid rgba(255,102,0,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                      {items.map((item, i) => (
                        <div key={i} style={{
                          padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10,
                          borderBottom: i < items.length - 1 ? '1px solid rgba(255,102,0,0.08)' : 'none',
                        }}>
                          <span style={{
                            fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', fontWeight: 700,
                            color: item.ok ? (ACTION_STYLE[item.action]?.color || '#22c55e') : '#ef4444',
                            border: `1px solid ${item.ok ? (ACTION_STYLE[item.action]?.color || '#22c55e') : '#ef4444'}`,
                            borderRadius: 2, padding: '2px 8px', textTransform: 'uppercase', flexShrink: 0,
                          }}>
                            {item.ok ? (ACTION_STYLE[item.action]?.label || item.action) : 'Error'}
                          </span>
                          <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem', color: item.ok ? '#ccc' : '#ef4444' }}>
                            {item.ok
                              ? (item.title || item.sym)
                              : `${item.error}${item.input?.sym ? ` (${item.input.sym})` : item.input?.title ? ` (${item.input.title})` : ''}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {reviewError && (
            <div style={{ marginTop: 16, fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#ef4444' }}>
              ⚠ {reviewError}
            </div>
          )}

        </main>
      </div>

      {reviewItem && (
        <ArticleEditModal
          item={reviewItem}
          progressLabel={`${reviewCount - reviewIds.length} of ${reviewCount}`}
          onSuccess={handleReviewDone}
          onCancel={handleReviewDone}
        />
      )}
    </div>
  );
}
