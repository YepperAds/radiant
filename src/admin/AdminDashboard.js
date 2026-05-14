// AdminDashboard.js — Cassette Futurism · Palanomic
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { getDashboardStats } from '../services/api';

const STAT_CARDS = [
  { key: 'totalArticles',     label: 'Total Articles', accent: '#ff6600', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  )},
  { key: 'publishedArticles', label: 'Published',      accent: '#22c55e', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )},
  { key: 'draftArticles',     label: 'Drafts',         accent: '#f59e0b', icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )},
];

const CAT_COLORS = {
  growth:     { bg: '#0f2a0f', text: '#6adf6a' },
  investment: { bg: '#0a1a2e', text: '#7ab8f5' },
  trade:      { bg: '#2a1200', text: '#ff8c3a' },
  policy:     { bg: '#1e0a2a', text: '#c87ae0' },
};

const STATUS_STYLE = {
  published: { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e', border: 'rgba(34,197,94,0.25)' },
  draft:     { bg: 'rgba(245,158,11,0.1)',  color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  review:    { bg: 'rgba(59,130,246,0.1)',  color: '#60a5fa', border: 'rgba(59,130,246,0.25)' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0, publishedArticles: 0, draftArticles: 0,
    categories: { growth: 0, investment: 0, trade: 0, policy: 0 },
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) { navigate('/login'); return; }

    (async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setError('Failed to fetch dashboard data');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [navigate]);

  const handleLogout = () => {
    ['authToken', 'userRole', 'userEmail', 'userName'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .skel {
          background: linear-gradient(90deg,#1e1e1e 25%,#2a2a2a 50%,#1e1e1e 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 2px;
        }
        @keyframes shimmer { 0%{background-position:200% 0}100%{background-position:-200% 0} }
        .stat-hover:hover { border-color: #ff6600 !important; }
        .activity-row:hover { background: rgba(255,102,0,0.04) !important; }
        .cat-block:hover { transform: translateY(-2px); }
        .cat-block { transition: transform 0.15s; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="dashboard" />

        <main style={{ flex: 1, padding: '28px 32px', maxWidth: '100%', overflow: 'hidden' }}>

          {/* Page header */}
          <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem',
                fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f0f0f0',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6600', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Admin Dashboard
              </div>
              <div style={{
                fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic',
                fontSize: '0.85rem', color: '#555555', marginTop: 4,
              }}>
                Overview of Palanomic content and metrics
              </div>
            </div>
            {/* Date */}
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem',
              letterSpacing: '0.14em', color: '#444444', textTransform: 'uppercase',
              border: '1px solid rgba(255,102,0,0.15)', padding: '6px 14px', borderRadius: 2,
            }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              marginBottom: 20, padding: '12px 16px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              borderLeft: '3px solid #ef4444', borderRadius: 2,
              fontFamily: "'Oswald', sans-serif", fontSize: '0.78rem',
              letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444',
            }}>
              ⚠ {error}
            </div>
          )}

          {isLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[...Array(3)].map((_, i) => <div key={i} className="skel" style={{ height: 100 }} />)}
              </div>
              <div className="skel" style={{ height: 200 }} />
              <div className="skel" style={{ height: 280 }} />
            </div>
          ) : (
            <>
              {/* ── Stat Cards ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 28 }}>
                {STAT_CARDS.map(card => (
                  <div
                    key={card.key}
                    className="stat-hover"
                    style={{
                      background: '#151515',
                      border: '1px solid rgba(255,102,0,0.15)',
                      borderRadius: 2,
                      padding: '18px 20px',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    {/* Top accent bar */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: card.accent }} />
                    {/* Corner tick */}
                    <div style={{ position: 'absolute', bottom: 8, right: 8, width: 12, height: 12, borderBottom: `2px solid ${card.accent}`, borderRight: `2px solid ${card.accent}`, opacity: 0.4 }} />

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem',
                          letterSpacing: '0.24em', textTransform: 'uppercase',
                          color: '#555555', marginBottom: 8,
                        }}>
                          {card.label}
                        </div>
                        <div style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: '2.2rem',
                          fontWeight: 700, color: card.accent, lineHeight: 1,
                        }}>
                          {stats[card.key]}
                        </div>
                      </div>
                      <div style={{ color: card.accent, opacity: 0.4, marginTop: 2 }}>
                        {card.icon}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Categories ── */}
              <div style={{ marginBottom: 28 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
                }}>
                  <div style={{ height: 1, flex: 1, background: 'rgba(255,102,0,0.15)' }} />
                  <span style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
                    letterSpacing: '0.24em', color: '#ff6600', textTransform: 'uppercase',
                  }}>Articles by Category</span>
                  <div style={{ height: 1, flex: 1, background: 'rgba(255,102,0,0.15)' }} />
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10,
                }}>
                  {Object.entries(stats.categories).map(([cat, count]) => {
                    const s = CAT_COLORS[cat] || { bg: '#1a1a1a', text: '#aaaaaa' };
                    return (
                      <div
                        key={cat}
                        className="cat-block"
                        style={{
                          background: s.bg,
                          border: `1px solid ${s.text}22`,
                          borderRadius: 2,
                          padding: '16px',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: '2rem',
                          fontWeight: 700, color: s.text, lineHeight: 1,
                        }}>
                          {count}
                        </div>
                        <div style={{
                          fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
                          letterSpacing: '0.2em', textTransform: 'uppercase',
                          color: s.text, opacity: 0.7, marginTop: 6,
                        }}>
                          {cat}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Recent Activity ── */}
              <div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
                }}>
                  <div style={{ height: 1, flex: 1, background: 'rgba(255,102,0,0.15)' }} />
                  <span style={{
                    fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem',
                    letterSpacing: '0.24em', color: '#ff6600', textTransform: 'uppercase',
                  }}>Recent Activity</span>
                  <div style={{ height: 1, flex: 1, background: 'rgba(255,102,0,0.15)' }} />
                </div>

                <div style={{ background: '#151515', border: '1px solid rgba(255,102,0,0.15)', borderRadius: 2, overflow: 'hidden' }}>
                  {/* Table head */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto',
                    padding: '10px 18px',
                    background: '#0a0a0a',
                    borderBottom: '1px solid #ff6600',
                    fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem',
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ff6600',
                    gap: 20,
                  }}>
                    <span>Title</span>
                    <span>Status</span>
                    <span>Updated</span>
                  </div>

                  {stats.recentActivity.length === 0 ? (
                    <div style={{
                      padding: '48px 20px', textAlign: 'center',
                      fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic',
                      color: '#444444', fontSize: '0.9rem',
                    }}>
                      No recent activity
                    </div>
                  ) : (
                    stats.recentActivity.map(activity => {
                      const ss = STATUS_STYLE[activity.status] || STATUS_STYLE.draft;
                      return (
                        <div
                          key={activity._id}
                          className="activity-row"
                          style={{
                            display: 'grid', gridTemplateColumns: '1fr auto auto',
                            padding: '12px 18px',
                            borderBottom: '1px solid rgba(255,102,0,0.07)',
                            alignItems: 'center', gap: 20,
                            transition: 'background 0.15s',
                          }}
                        >
                          <div style={{
                            fontFamily: "'Libre Baskerville', serif",
                            fontSize: '0.88rem', color: '#cccccc',
                            overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                          }}>
                            {activity.title}
                          </div>
                          <span style={{
                            fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem',
                            letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700,
                            padding: '3px 10px', borderRadius: 2,
                            background: ss.bg, color: ss.color,
                            border: `1px solid ${ss.border}`,
                            whiteSpace: 'nowrap',
                          }}>
                            {activity.status}
                          </span>
                          <span style={{
                            fontFamily: "'Oswald', sans-serif", fontSize: '0.68rem',
                            letterSpacing: '0.08em', color: '#444444', whiteSpace: 'nowrap',
                          }}>
                            {new Date(activity.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}