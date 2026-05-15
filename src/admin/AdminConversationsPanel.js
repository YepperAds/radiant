// src/admin/AdminConversationsPanel.js — Cassette Futurism · Palanomic
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { adminGetConversations } from '../services/api';

const fmt = (d) =>
  d ? new Date(d).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }) : '—';

const MKT_COLORS = { stocks: '#f59e0b', forex: '#a78bfa', goods: '#fb7185' };

const STATUS_STYLE = {
  published: { bg: 'rgba(34,197,94,0.1)',  color: '#22c55e', border: 'rgba(34,197,94,0.25)' },
  draft:     { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  review:    { bg: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

const CHG_COLORS = { up: '#22c55e', dn: '#ef4444', nt: '#888' };

function Skel({ w = '100%', h = 11, mb = 8 }) {
  return <div className="skel" style={{ width: w, height: h, marginBottom: mb, borderRadius: 2 }} />;
}

function SourceBadge({ ctx }) {
  if (!ctx) return null;
  if (ctx.type === 'news') {
    const s = STATUS_STYLE[ctx.status] || STATUS_STYLE.draft;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '2px 7px', borderRadius: 2,
          background: 'rgba(96,165,250,0.1)', color: '#60a5fa',
          border: '1px solid rgba(96,165,250,0.25)',
          fontFamily: "'Oswald', sans-serif",
        }}>News</span>
        {ctx.category && (
          <span style={{ fontSize: '0.65rem', color: '#555', textTransform: 'capitalize', letterSpacing: '0.06em' }}>
            {ctx.category}
          </span>
        )}
        {ctx.status && (
          <span style={{
            fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
            padding: '1px 6px', borderRadius: 2,
            background: s.bg, color: s.color, border: `1px solid ${s.border}`,
            fontFamily: "'Oswald', sans-serif",
          }}>{ctx.status}</span>
        )}
      </div>
    );
  }
  const mktColor = MKT_COLORS[ctx.marketType] || '#aaa';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
        padding: '2px 7px', borderRadius: 2,
        background: 'rgba(34,197,94,0.08)', color: '#22c55e',
        border: '1px solid rgba(34,197,94,0.2)',
        fontFamily: "'Oswald', sans-serif",
      }}>Market</span>
      <span style={{ fontSize: '0.7rem', color: mktColor, fontWeight: 600, letterSpacing: '0.1em' }}>
        {ctx.marketType?.toUpperCase()} · {ctx.sym}
      </span>
      {ctx.name && ctx.name !== ctx.sym && (
        <span style={{ fontSize: '0.65rem', color: '#555' }}>{ctx.name}</span>
      )}
      {ctx.price && (
        <span style={{ fontSize: '0.68rem', color: CHG_COLORS[ctx.chgDir] || '#888', marginLeft: 2 }}>
          {ctx.price}
        </span>
      )}
    </div>
  );
}

export default function AdminConversationsPanel() {
  const navigate = useNavigate();

  const [comments, setComments]   = useState([]);
  const [pagination, setPag]      = useState({ current: 1, total: 1, count: 0 });
  const [sourceType, setSourceType] = useState('all');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const [expanded, setExpanded]   = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminGetConversations({ sourceType, search, page, limit: 30 });
      setComments(data.comments);
      setPag(data.pagination);
    } catch {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [sourceType, search, page]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    load();
  }, [navigate, load]);

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
        .conv-row { transition: background 0.12s; }
        .conv-row:hover { background: rgba(255,102,0,0.03) !important; }
        .filter-btn { transition: color 0.15s, border-color 0.15s, background 0.15s; cursor: pointer; }
        .page-btn:hover:not(:disabled) { background: rgba(255,102,0,0.12) !important; color: #ff6600 !important; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="conversations" />

        <main style={{ flex: 1, padding: '28px 32px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: 6 }}>
              Admin · Activity
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.06em', margin: 0, color: '#f0f0f0' }}>
              CONVERSATIONS
            </h1>
            <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 4 }}>
              {pagination.count} total comments
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            {/* Source type filter */}
            {['all', 'news', 'market'].map(t => {
              const active = sourceType === t;
              return (
                <button
                  key={t}
                  className="filter-btn"
                  onClick={() => { setSourceType(t); setPage(1); }}
                  style={{
                    background: active ? 'rgba(255,102,0,0.12)' : 'transparent',
                    border: `1px solid ${active ? '#ff6600' : 'rgba(255,255,255,0.1)'}`,
                    color: active ? '#ff6600' : '#555',
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding: '5px 14px',
                    borderRadius: 2,
                  }}
                >{t}</button>
              );
            })}

            <input
              type="text"
              placeholder="Search comments…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                background: '#181818',
                border: '1px solid rgba(255,102,0,0.2)',
                borderRadius: 2,
                padding: '6px 12px',
                color: '#f0f0f0',
                fontFamily: "'Oswald', sans-serif",
                fontSize: '0.74rem',
                letterSpacing: '0.05em',
                width: 220,
                outline: 'none',
                marginLeft: 'auto',
              }}
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: 16 }}>{error}</div>}

          {/* Comment list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Skel w="40%" mb={8} />
                    <Skel w="80%" mb={6} />
                    <Skel w="60%" h={9} mb={0} />
                  </div>
                ))
              : comments.length === 0
                ? <div style={{ padding: '40px 0', textAlign: 'center', color: '#333', fontSize: '0.82rem' }}>
                    No conversations found.
                  </div>
                : comments.map(c => {
                    const isOpen = expanded === c._id;
                    return (
                      <div
                        key={c._id}
                        className="conv-row"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          padding: '14px 0',
                        }}
                      >
                        {/* Source context */}
                        <div style={{ marginBottom: 7 }}>
                          <SourceBadge ctx={c.sourceContext} />
                        </div>

                        {/* Title line */}
                        {c.sourceContext?.type === 'news' && c.sourceContext?.title && (
                          <div style={{
                            fontSize: '0.78rem',
                            color: '#aaa',
                            marginBottom: 6,
                            fontStyle: 'italic',
                            fontFamily: "'Libre Baskerville', serif",
                            lineHeight: 1.4,
                          }}>
                            "{c.sourceContext.title}"
                          </div>
                        )}

                        {/* Comment body */}
                        <div style={{ fontSize: '0.82rem', color: '#ddd', lineHeight: 1.6, marginBottom: 8 }}>
                          {c.text}
                        </div>

                        {/* Meta row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '0.65rem', color: '#444' }}>
                          <span style={{ color: '#666', fontWeight: 500 }}>{c.userName}</span>
                          <span>{fmt(c.createdAt)}</span>
                          {c.likes?.length > 0 && (
                            <span style={{ color: '#ff6600' }}>♥ {c.likes.length}</span>
                          )}
                          {c.replies?.length > 0 && (
                            <button
                              onClick={() => setExpanded(isOpen ? null : c._id)}
                              style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                color: '#555', fontFamily: "'Oswald', sans-serif",
                                fontSize: '0.65rem', letterSpacing: '0.1em',
                                textTransform: 'uppercase', padding: 0,
                              }}
                            >
                              {isOpen ? '▲' : '▼'} {c.replies.length} {c.replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                          )}
                        </div>

                        {/* Replies expanded */}
                        {isOpen && c.replies?.map((r, ri) => (
                          <div key={r._id || ri} style={{
                            marginTop: 8,
                            marginLeft: 20,
                            paddingLeft: 14,
                            borderLeft: '2px solid rgba(255,102,0,0.2)',
                          }}>
                            <div style={{ fontSize: '0.78rem', color: '#bbb', lineHeight: 1.55, marginBottom: 4 }}>
                              {r.text}
                            </div>
                            <div style={{ fontSize: '0.63rem', color: '#444' }}>
                              {r.userName} · {fmt(r.createdAt)}
                              {r.likes?.length > 0 && <span style={{ color: '#ff6600', marginLeft: 8 }}>♥ {r.likes.length}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })
            }
          </div>

          {/* Pagination */}
          {pagination.total > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 20 }}>
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                style={{
                  background: 'transparent', border: '1px solid rgba(255,102,0,0.2)',
                  color: '#555', padding: '5px 12px', borderRadius: 2, cursor: 'pointer',
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em',
                }}
              >← PREV</button>
              <span style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '0.1em' }}>
                {page} / {pagination.total}
              </span>
              <button
                className="page-btn"
                disabled={page >= pagination.total}
                onClick={() => setPage(p => p + 1)}
                style={{
                  background: 'transparent', border: '1px solid rgba(255,102,0,0.2)',
                  color: '#555', padding: '5px 12px', borderRadius: 2, cursor: 'pointer',
                  fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em',
                }}
              >NEXT →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}