// src/admin/AdminUsersPanel.js — Cassette Futurism · Palanomic
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { adminGetUsers, adminGetUserDetail } from '../services/api';

const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const SOURCE_COLORS = {
  news:   { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  market: { bg: 'rgba(34,197,94,0.10)',  text: '#22c55e', border: 'rgba(34,197,94,0.22)' },
};

const MKT_COLORS = {
  stocks: '#f59e0b',
  forex:  '#a78bfa',
  goods:  '#fb7185',
};

function Pill({ label, color }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '1px 7px',
      fontSize: '0.6rem',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      borderRadius: 2,
      background: color.bg,
      color: color.text,
      border: `1px solid ${color.border}`,
      fontFamily: "'Oswald', sans-serif",
    }}>{label}</span>
  );
}

function Skeleton({ w = '100%', h = 12, mb = 6 }) {
  return (
    <div className="skel" style={{ width: w, height: h, marginBottom: mb, borderRadius: 2 }} />
  );
}

export default function AdminUsersPanel() {
  const navigate = useNavigate();

  // list state
  const [users, setUsers]         = useState([]);
  const [pagination, setPag]      = useState({ current: 1, total: 1, count: 0 });
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  // detail drawer
  const [detail, setDetail]       = useState(null);
  const [detailLoading, setDL]    = useState(false);
  const [activeTab, setActiveTab] = useState('comments'); // 'comments' | 'replied'

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminGetUsers({ search, page, limit: 20 });
      setUsers(data.users);
      setPag(data.pagination);
    } catch {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }
    load();
  }, [navigate, load]);

  const openDetail = async (userId) => {
    setDetail(null);
    setDL(true);
    setActiveTab('comments');
    try {
      const data = await adminGetUserDetail(userId);
      setDetail(data);
    } catch {
      setDetail({ error: true });
    } finally {
      setDL(false);
    }
  };

  const handleLogout = () => {
    ['authToken', 'userRole', 'userEmail', 'userName'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  // ── render helpers ──────────────────────────────────────────────────────────
  const renderComment = (c, idx) => {
    const isNews   = c.sourceType === 'news';
    const col      = SOURCE_COLORS[c.sourceType] || SOURCE_COLORS.news;
    const mktColor = MKT_COLORS[c.marketType] || '#aaa';

    return (
      <div key={c._id || idx} style={{
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '10px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
          <Pill label={c.sourceType} color={col} />
          {isNews ? (
            <span style={{ fontSize: '0.7rem', color: '#888', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.04em' }}>
              {c.newsTitle || 'Unknown Article'}
            </span>
          ) : (
            <span style={{ fontSize: '0.7rem', color: mktColor, fontFamily: "'Oswald', sans-serif", letterSpacing: '0.08em' }}>
              {c.marketType?.toUpperCase()} · {c.sym}
            </span>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '0.65rem', color: '#444' }}>{fmt(c.createdAt)}</span>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#ccc', lineHeight: 1.55, paddingLeft: 2 }}>
          {c.text}
        </div>
        {c.replies?.length > 0 && (
          <div style={{ fontSize: '0.65rem', color: '#555', marginTop: 4 }}>
            {c.replies.length} {c.replies.length === 1 ? 'reply' : 'replies'}
          </div>
        )}
      </div>
    );
  };

  // ── main render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        .skel {
          background: linear-gradient(90deg,#1e1e1e 25%,#2a2a2a 50%,#1e1e1e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
        .user-row:hover { background: rgba(255,102,0,0.04) !important; cursor: pointer; }
        .tab-btn { transition: color 0.15s, border-color 0.15s; cursor: pointer; }
        .tab-btn:hover { color: #ff6600 !important; }
        .page-btn:hover:not(:disabled) { background: rgba(255,102,0,0.15) !important; color: #ff6600 !important; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="users" />

        <main style={{ flex: 1, padding: '28px 32px', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', color: '#444', textTransform: 'uppercase', marginBottom: 6 }}>
              Admin · Users
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.06em', margin: 0, color: '#f0f0f0' }}>
              REGISTERED USERS
            </h1>
            <div style={{ fontSize: '0.7rem', color: '#555', marginTop: 4 }}>
              {pagination.count} total accounts
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              style={{
                background: '#181818',
                border: '1px solid rgba(255,102,0,0.2)',
                borderRadius: 2,
                padding: '8px 14px',
                color: '#f0f0f0',
                fontFamily: "'Oswald', sans-serif",
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                width: 280,
                outline: 'none',
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: 16 }}>{error}</div>
          )}

          {/* Table */}
          <div style={{ border: '1px solid rgba(255,102,0,0.12)', borderRadius: 3, overflow: 'hidden' }}>

            {/* Table head */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.4fr 80px 90px 110px',
              padding: '8px 16px',
              background: '#161616',
              borderBottom: '1px solid rgba(255,102,0,0.12)',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#444',
            }}>
              <span>Name</span>
              <span>Email</span>
              <span style={{ textAlign: 'center' }}>Comments</span>
              <span style={{ textAlign: 'center' }}>Role</span>
              <span style={{ textAlign: 'right' }}>Joined</span>
            </div>

            {/* Rows */}
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <Skeleton w="60%" h={11} mb={0} />
                </div>
              ))
            ) : users.length === 0 ? (
              <div style={{ padding: '32px 16px', textAlign: 'center', color: '#444', fontSize: '0.78rem' }}>
                No users found
              </div>
            ) : users.map(u => (
              <div
                key={u._id}
                className="user-row"
                onClick={() => openDetail(u._id)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1.4fr 80px 90px 110px',
                  padding: '11px 16px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: '0.82rem', color: '#e0e0e0', fontWeight: 500, letterSpacing: '0.04em' }}>{u.name}</span>
                <span style={{ fontSize: '0.72rem', color: '#666', letterSpacing: '0.02em' }}>{u.email}</span>
                <span style={{ textAlign: 'center', fontSize: '0.82rem', color: u.commentCount > 0 ? '#ff6600' : '#444', fontWeight: 600 }}>
                  {u.commentCount}
                </span>
                <span style={{ textAlign: 'center' }}>
                  <span style={{
                    fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 2,
                    background: 'rgba(255,255,255,0.05)', color: '#777',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>{u.role}</span>
                </span>
                <span style={{ textAlign: 'right', fontSize: '0.68rem', color: '#444' }}>{fmt(u.createdAt)}</span>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
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

      {/* ── Detail drawer ──────────────────────────────────────────────────── */}
      {(detail !== null || detailLoading) && (
        <div
          onClick={() => setDetail(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            zIndex: 200,
            display: 'flex', justifyContent: 'flex-end',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: 480, maxWidth: '90vw',
              background: '#141414',
              borderLeft: '1px solid rgba(255,102,0,0.2)',
              height: '100vh',
              overflowY: 'auto',
              padding: '24px 24px 40px',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setDetail(null)}
              style={{
                background: 'transparent', border: 'none', color: '#555',
                cursor: 'pointer', fontSize: '1.1rem', marginBottom: 20, padding: 0,
              }}
            >✕</button>

            {detailLoading && (
              <>
                <Skeleton w="50%" h={16} mb={12} />
                <Skeleton w="70%" h={11} mb={8} />
                <Skeleton w="40%" h={11} mb={24} />
                {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} w="100%" h={11} mb={8} />)}
              </>
            )}

            {detail?.error && (
              <div style={{ color: '#ef4444', fontSize: '0.78rem' }}>Failed to load user detail.</div>
            )}

            {detail && !detail.error && !detailLoading && (() => {
              const u = detail.user;
              const s = detail.stats;
              return (
                <>
                  {/* User card */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.06em', color: '#f0f0f0', marginBottom: 4 }}>
                      {u.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#666', marginBottom: 12 }}>{u.email}</div>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {[
                        ['Comments', s.totalComments,    '#ff6600'],
                        ['On News',  s.newsComments,     '#60a5fa'],
                        ['On Market',s.marketComments,   '#22c55e'],
                        ['Threads',  s.repliedInThreads, '#a78bfa'],
                      ].map(([label, val, color]) => (
                        <div key={label} style={{
                          background: '#1a1a1a',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: 3,
                          padding: '7px 14px',
                          textAlign: 'center',
                          minWidth: 64,
                        }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{val}</div>
                          <div style={{ fontSize: '0.58rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginTop: 2 }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#444', marginTop: 10, letterSpacing: '0.06em' }}>
                      Joined {fmt(u.createdAt)}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 16 }}>
                    {[
                      ['comments', `Comments (${detail.comments.length})`],
                      ['replied',  `In Threads (${detail.repliedThreads.length})`],
                    ].map(([tab, label]) => (
                      <button
                        key={tab}
                        className="tab-btn"
                        onClick={() => setActiveTab(tab)}
                        style={{
                          background: 'none', border: 'none',
                          borderBottom: activeTab === tab ? '2px solid #ff6600' : '2px solid transparent',
                          color: activeTab === tab ? '#ff6600' : '#555',
                          fontFamily: "'Oswald', sans-serif",
                          fontSize: '0.68rem',
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          padding: '8px 14px 6px',
                          cursor: 'pointer',
                          marginBottom: -1,
                        }}
                      >{label}</button>
                    ))}
                  </div>

                  {/* Content */}
                  {activeTab === 'comments' && (
                    detail.comments.length === 0
                      ? <div style={{ color: '#444', fontSize: '0.78rem' }}>No comments yet.</div>
                      : detail.comments.map(renderComment)
                  )}
                  {activeTab === 'replied' && (
                    detail.repliedThreads.length === 0
                      ? <div style={{ color: '#444', fontSize: '0.78rem' }}>No threads participated in.</div>
                      : detail.repliedThreads.map(renderComment)
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}