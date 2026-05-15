// AdminSidebar.js — Cassette Futurism · Palanomic
import React from 'react';
import { Link } from 'react-router-dom';

const NAV = [
  {
    section: 'Navigation',
    items: [
      {
        page: 'dashboard',
        label: 'Dashboard',
        to: '/',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        page: 'news',
        label: 'News Articles',
        to: '/admin/news',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        page: 'market',
        label: 'Market Data',
        to: '/admin/market',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
    ],
  },
  {
    section: 'Insights',
    items: [
      {
        page: 'users',
        label: 'Users',
        to: '/admin/users',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 00-3-3.87" />
            <path d="M16 3.13a4 4 0 010 7.75" />
          </svg>
        ),
      },
      {
        page: 'conversations',
        label: 'Conversations',
        to: '/admin/conversations',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        ),
      },
      {
        page: 'history',
        label: 'History',
        to: '/admin/history',
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
            <polyline points="12 8 12 12 14 14" />
            <path d="M3.05 11a9 9 0 1 0 .5-4M3 3v5h5" />
          </svg>
        ),
      },
    ],
  },
];

function AdminSidebar({ activePage }) {
  return (
    <>
      <style>{`
        .sidebar-nav-item { transition: background 0.15s, color 0.15s, border-left-color 0.15s; }
        .sidebar-nav-item:hover:not(.active-nav) {
          background: rgba(255,255,255,0.03) !important;
          color: #aaaaaa !important;
        }
      `}</style>

      <nav
        style={{
          width: 210,
          background: '#0d0d0d',
          borderRight: '1px solid rgba(255,102,0,0.15)',
          minHeight: 'calc(100vh - 57px)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 0',
          flexShrink: 0,
        }}
      >
        {NAV.map((group, gi) => (
          <div key={group.section}>
            <div
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: '0.6rem',
                letterSpacing: '0.28em',
                color: '#444444',
                textTransform: 'uppercase',
                padding: '10px 18px 6px',
                borderTop: gi > 0 ? '1px solid rgba(255,102,0,0.1)' : 'none',
                marginTop: gi > 0 ? 10 : 0,
              }}
            >
              {group.section}
            </div>

            {group.items.map(item => {
              const isActive = activePage === item.page;
              return (
                <Link
                  key={item.page}
                  to={item.to}
                  className={`sidebar-nav-item${isActive ? ' active-nav' : ''}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 18px',
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '0.78rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? '#ff6600' : '#555555',
                    borderLeft: `2px solid ${isActive ? '#ff6600' : 'transparent'}`,
                    background: isActive ? 'rgba(255,102,0,0.08)' : 'transparent',
                    position: 'relative',
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      right: 10, top: '50%',
                      transform: 'translateY(-50%)',
                      width: 5, height: 5,
                      background: '#ff6600',
                      borderRadius: '50%',
                    }} />
                  )}
                  <span style={{ color: isActive ? '#ff6600' : '#444444', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}

        {/* Bottom branding */}
        <div style={{ marginTop: 'auto', padding: '16px 18px', borderTop: '1px solid rgba(255,102,0,0.1)' }}>
          <div style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.18em',
            color: '#ffffff',
            textTransform: 'uppercase',
            lineHeight: 1.8,
          }}>
            <div>Palanomic</div>
          </div>
        </div>
      </nav>
    </>
  );
}

export default AdminSidebar;