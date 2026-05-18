// src/admin/AdminHistoryPanel.js — Cassette Futurism · Palanomic
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { adminGetNewsHistory, adminGetMarketHistory } from '../services/api';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// ── shared styles ─────────────────────────────────────────────────────────────
const STATUS_STYLE = {
  published: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.25)' },
  draft:     { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  review:    { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

const CAT_COLORS = {
  growth:     { bg: '#0f2a0f', text: '#6adf6a' },
  investment: { bg: '#0a1a2e', text: '#7ab8f5' },
  trade:      { bg: '#2a1200', text: '#ff8c3a' },
  policy:     { bg: '#1e0a2a', text: '#c87ae0' },
  other:      { bg: '#1c1c1c', text: '#888888' },
};

const MKT_COLORS = { stocks: '#f59e0b', forex: '#a78bfa', goods: '#fb7185' };
const CHG_COLORS = { up: '#22c55e', dn: '#ef4444', nt: '#888' };

function Skel({ w = '100%', h = 11, mb = 8 }) {
  return <div className="skel" style={{ width: w, height: h, marginBottom: mb, borderRadius: 2 }} />;
}

// ── News History sub-panel ────────────────────────────────────────────────────
function NewsHistory() {
  const [articles, setArticles]   = useState([]);
  const [pagination, setPag]      = useState({ current: 1, total: 1, count: 0 });
  const [summary, setSummary]     = useState(null);
  const [status, setStatus]       = useState('all');
  const [category, setCategory]   = useState('all');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await adminGetNewsHistory({ status, category, search, page, limit: 20 });
      setArticles(data.articles);
      setPag(data.pagination);
      setSummary(data.summary);
    } catch { setError('Failed to load news history'); }
    finally { setLoading(false); }
  }, [status, category, search, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      {/* Summary bar */}
      {summary && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            ['Total',     summary.total,                    '#ff6600'],
            ['Published', summary.byStatus.published || 0,  '#22c55e'],
            ['Draft',     summary.byStatus.draft     || 0,  '#f59e0b'],
            ['Review',    summary.byStatus.review    || 0,  '#60a5fa'],
          ].map(([label, val, color]) => (
            <div key={label} style={{
              background: '#181818', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 3, padding: '7px 16px', textAlign: 'center', minWidth: 72,
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{val}</div>
              <div style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Status */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'published', 'draft', 'review'].map(s => {
            const active = status === s;
            const sc = STATUS_STYLE[s];
            return (
              <button key={s} onClick={() => { setStatus(s); setPage(1); }}
                style={{
                  background: active ? (sc?.bg || 'rgba(255,102,0,0.12)') : 'transparent',
                  border: `1px solid ${active ? (sc?.border || '#ff6600') : 'rgba(255,255,255,0.1)'}`,
                  color: active ? (sc?.color || '#ff6600') : '#555',
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  padding: '4px 12px', borderRadius: 2, cursor: 'pointer',
                }}
              >{s}</button>
            );
          })}
        </div>

        {/* Category */}
        <select
          value={category}
          onChange={e => { setCategory(e.target.value); setPage(1); }}
          style={{
            background: '#181818', border: '1px solid rgba(255,102,0,0.2)',
            color: '#888', fontFamily: "'Oswald', sans-serif",
            fontSize: '0.7rem', letterSpacing: '0.08em',
            padding: '5px 10px', borderRadius: 2, outline: 'none',
          }}
        >
          {['all', 'growth', 'investment', 'trade', 'policy', 'other'].map(c => (
            <option key={c} value={c}>{c.toUpperCase()}</option>
          ))}
        </select>

        <input
          type="text" placeholder="Search articles…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{
            background: '#181818', border: '1px solid rgba(255,102,0,0.2)',
            borderRadius: 2, padding: '5px 12px', color: '#f0f0f0',
            fontFamily: "'Oswald', sans-serif", fontSize: '0.74rem',
            letterSpacing: '0.05em', width: 210, outline: 'none',
          }}
        />
      </div>

      {error && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: 14 }}>{error}</div>}

      {/* Table */}
      <div style={{ border: '1px solid rgba(255,102,0,0.12)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 80px 100px 80px 90px 100px',
          padding: '7px 14px', background: '#161616',
          borderBottom: '1px solid rgba(255,102,0,0.12)',
          fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#444',
        }}>
          <span>Title</span><span>Status</span><span>Category</span>
          <span style={{ textAlign: 'center' }}>Comments</span>
          <span style={{ textAlign: 'center' }}>Edited</span>
          <span style={{ textAlign: 'right' }}>Date</span>
        </div>

        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <Skel w="65%" mb={0} />
              </div>
            ))
          : articles.length === 0
            ? <div style={{ padding: '32px 14px', textAlign: 'center', color: '#333', fontSize: '0.78rem' }}>No articles found.</div>
            : articles.map(a => {
                const ss = STATUS_STYLE[a.status] || STATUS_STYLE.draft;
                const cc = CAT_COLORS[a.category]  || CAT_COLORS.other;
                return (
                  <div key={a._id} style={{
                    display: 'grid', gridTemplateColumns: '2fr 80px 100px 80px 90px 100px',
                    padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: '#e0e0e0', fontWeight: 500, letterSpacing: '0.02em', marginBottom: 2 }}>
                        {a.title}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#555' }}>{a.author}</div>
                    </div>
                    <span>
                      <span style={{
                        fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '2px 6px', borderRadius: 2, background: ss.bg, color: ss.color,
                        border: `1px solid ${ss.border}`, fontFamily: "'Oswald', sans-serif",
                      }}>{a.status}</span>
                    </span>
                    <span>
                      <span style={{
                        fontSize: '0.6rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                        padding: '2px 6px', borderRadius: 2, background: cc.bg, color: cc.text,
                        fontFamily: "'Oswald', sans-serif",
                      }}>{a.category}</span>
                    </span>
                    <span style={{ textAlign: 'center', fontSize: '0.82rem', color: a.commentCount > 0 ? '#ff6600' : '#333', fontWeight: 600 }}>
                      {a.commentCount}
                    </span>
                    <span style={{ textAlign: 'center' }}>
                      {a.wasEdited
                        ? <span style={{ fontSize: '0.6rem', color: '#f59e0b', letterSpacing: '0.08em' }}>✎ EDITED</span>
                        : <span style={{ fontSize: '0.6rem', color: '#333' }}>—</span>
                      }
                    </span>
                    <span style={{ textAlign: 'right', fontSize: '0.68rem', color: '#444' }}>{fmt(a.createdAt)}</span>
                  </div>
                );
              })
        }
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="page-btn"
            style={{ background: 'transparent', border: '1px solid rgba(255,102,0,0.2)', color: '#555', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}>
            ← PREV
          </button>
          <span style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.1em' }}>{page} / {pagination.total}</span>
          <button disabled={page >= pagination.total} onClick={() => setPage(p => p + 1)} className="page-btn"
            style={{ background: 'transparent', border: '1px solid rgba(255,102,0,0.2)', color: '#555', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}>
            NEXT →
          </button>
        </div>
      )}
    </>
  );
}

// ── Market History sub-panel ──────────────────────────────────────────────────
function MarketHistory() {
  const [items, setItems]         = useState([]);
  const [pagination, setPag]      = useState({ current: 1, total: 1, count: 0 });
  const [summary, setSummary]     = useState(null);
  const [type, setType]           = useState('all');
  const [includeArchived, setIA]  = useState(true);
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await adminGetMarketHistory({ type, includeArchived, search, page, limit: 30 });
      setItems(data.items);
      setPag(data.pagination);
      setSummary(data.summary);
    } catch { setError('Failed to load market history'); }
    finally { setLoading(false); }
  }, [type, includeArchived, search, page]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      {/* Summary bar */}
      {summary && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {['stocks', 'forex', 'goods'].map(t => {
            const s = summary[t] || {};
            const color = MKT_COLORS[t];
            return (
              <div key={t} style={{
                background: '#181818', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 3, padding: '7px 16px', minWidth: 110,
              }}>
                <div style={{ fontSize: '0.6rem', color, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>{t}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#22c55e' }}>{s.live || 0}</div>
                    <div style={{ fontSize: '0.56rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#555' }}>{s.archived || 0}</div>
                    <div style={{ fontSize: '0.56rem', color: '#444', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Archived</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {['all', 'stocks', 'forex', 'goods'].map(t => {
          const active = type === t;
          const color  = MKT_COLORS[t] || '#ff6600';
          return (
            <button key={t} onClick={() => { setType(t); setPage(1); }}
              style={{
                background: active ? `rgba(${t === 'all' ? '255,102,0' : t === 'stocks' ? '245,158,11' : t === 'forex' ? '167,139,250' : '251,113,133'},0.12)` : 'transparent',
                border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
                color: active ? color : '#555',
                fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '4px 12px', borderRadius: 2, cursor: 'pointer',
              }}
            >{t}</button>
          );
        })}

        <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
          <input
            type="checkbox" checked={includeArchived}
            onChange={e => { setIA(e.target.checked); setPage(1); }}
            style={{ accentColor: '#ff6600' }}
          />
          <span style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', fontFamily: "'Oswald', sans-serif" }}>
            Include archived
          </span>
        </label>

        <input
          type="text" placeholder="Search symbol or name…" value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{
            background: '#181818', border: '1px solid rgba(255,102,0,0.2)',
            borderRadius: 2, padding: '5px 12px', color: '#f0f0f0',
            fontFamily: "'Oswald', sans-serif", fontSize: '0.74rem',
            letterSpacing: '0.05em', width: 200, outline: 'none', marginLeft: 'auto',
          }}
        />
      </div>

      {error && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: 14 }}>{error}</div>}

      {/* Table */}
      <div style={{ border: '1px solid rgba(255,102,0,0.12)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '70px 90px 1.4fr 90px 90px 80px 90px 100px',
          padding: '7px 14px', background: '#161616',
          borderBottom: '1px solid rgba(255,102,0,0.12)',
          fontSize: '0.58rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#444',
        }}>
          <span>Type</span><span>Symbol</span><span>Name</span>
          <span style={{ textAlign: 'right' }}>Price</span>
          <span style={{ textAlign: 'right' }}>Change</span>
          <span style={{ textAlign: 'center' }}>Comments</span>
          <span style={{ textAlign: 'center' }}>Status</span>
          <span style={{ textAlign: 'right' }}>Updated</span>
        </div>

        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{ padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <Skel w="50%" mb={0} />
              </div>
            ))
          : items.length === 0
            ? <div style={{ padding: '32px 14px', textAlign: 'center', color: '#333', fontSize: '0.78rem' }}>No items found.</div>
            : items.map(item => {
                const mktColor = MKT_COLORS[item._type] || '#888';
                const isArchived = item.archived;
                return (
                  <div key={item._id} style={{
                    display: 'grid', gridTemplateColumns: '70px 90px 1.4fr 90px 90px 80px 90px 100px',
                    padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                    alignItems: 'center',
                    opacity: isArchived ? 0.55 : 1,
                  }}>
                    <span style={{ fontSize: '0.6rem', color: mktColor, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Oswald', sans-serif" }}>
                      {item._type}
                    </span>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e0e0e0', letterSpacing: '0.06em' }}>
                      {item.sym}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: '#999' }}>{item.name}</span>
                    <span style={{ textAlign: 'right', fontSize: '0.78rem', color: '#e0e0e0', fontWeight: 500 }}>
                      {item.price}
                    </span>
                    <span style={{ textAlign: 'right', fontSize: '0.78rem', color: CHG_COLORS[item.chgDir] || '#888', fontWeight: 500 }}>
                      {item.change}
                    </span>
                    <span style={{ textAlign: 'center', fontSize: '0.82rem', color: item.commentCount > 0 ? '#ff6600' : '#333', fontWeight: 600 }}>
                      {item.commentCount}
                    </span>
                    <span style={{ textAlign: 'center' }}>
                      {isArchived
                        ? <span style={{ fontSize: '0.6rem', color: '#444', letterSpacing: '0.08em', fontFamily: "'Oswald', sans-serif" }}>ARCHIVED</span>
                        : <span style={{ fontSize: '0.6rem', color: '#22c55e', letterSpacing: '0.08em', fontFamily: "'Oswald', sans-serif" }}>LIVE</span>
                      }
                    </span>
                    <span style={{ textAlign: 'right', fontSize: '0.65rem', color: '#444' }}>
                      {fmt(item.updatedAt)}
                    </span>
                  </div>
                );
              })
        }
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="page-btn"
            style={{ background: 'transparent', border: '1px solid rgba(255,102,0,0.2)', color: '#555', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}>
            ← PREV
          </button>
          <span style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.1em' }}>{page} / {pagination.total}</span>
          <button disabled={page >= pagination.total} onClick={() => setPage(p => p + 1)} className="page-btn"
            style={{ background: 'transparent', border: '1px solid rgba(255,102,0,0.2)', color: '#555', padding: '5px 12px', borderRadius: 2, cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em' }}>
            NEXT →
          </button>
        </div>
      )}
    </>
  );
}

// ── Main Panel (tabbed) ───────────────────────────────────────────────────────
export default function AdminHistoryPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    ['authToken', 'userRole', 'userEmail', 'userName'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        .skel { background: linear-gradient(90deg,#1e1e1e 25%,#2a2a2a 50%,#1e1e1e 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
        .page-btn:hover:not(:disabled) { background: rgba(255,102,0,0.12) !important; color: #ff6600 !important; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="history" />

        <main style={{ flex: 1, padding: '28px 32px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: 6 }}>
              Admin · Records
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.06em', margin: 0, color: '#f0f0f0' }}>
              HISTORY
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 22 }}>
            {[
              ['news',   'News Articles'],
              ['market', 'Market Data'],
            ].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '2px solid #ff6600' : '2px solid transparent',
                  color: activeTab === tab ? '#ff6600' : '#555',
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                  padding: '10px 18px 8px', cursor: 'pointer', marginBottom: -1,
                  transition: 'color 0.15s',
                }}
              >{label}</button>
            ))}
          </div>

          {activeTab === 'news'   && <NewsHistory />}
          {activeTab === 'market' && <MarketHistory />}
        </main>
      </div>
    </div>
  );
}