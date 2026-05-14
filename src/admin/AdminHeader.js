// AdminHeader.js — Cassette Futurism · Palanomic
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../icons/Frame 624.png';

function AdminHeader({ onLogout }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&display=swap');
        .admin-header-root { font-family: 'Oswald', sans-serif; }
        .ah-view-site:hover { color: #ff9944 !important; }
        .ah-avatar:hover { background: rgba(255,102,0,0.15) !important; }
        .ah-logout:hover { background: rgba(239,68,68,0.1) !important; color: #ef4444 !important; }
        .ah-dropdown { display: none; }
        .ah-dropdown-wrap:hover .ah-dropdown { display: block; }
        .stripe-rule {
          height: 3px;
          background: repeating-linear-gradient(to right,#ff6600 0,#ff6600 12px,#0d0d0d 12px,#0d0d0d 18px);
        }
      `}</style>

      <header
        className="admin-header-root"
        style={{
          background: '#0a0a0a',
          borderBottom: '2px solid #ff6600',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 54,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <img style={{ height: '26px', width: '26px' }} src={Icon} alt="" />
            </div>
            <span style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 600,
              fontSize: '1.2rem',
              letterSpacing: '0.08em',
              lineHeight: '1',
              color: '#f0f0f0',
              textTransform: 'uppercase',
            }}>
              Palanomic
            </span>
          </Link>
          <span style={{
            fontFamily: "'Oswald', sans-serif",
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            color: '#ff6600',
            border: '1px solid rgba(255,102,0,0.3)',
            padding: '2px 8px',
            borderRadius: 2,
            background: 'rgba(255,102,0,0.07)',
            textTransform: 'uppercase',
          }}>
            Admin Panel
          </span>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <Link
            to="/"
            className="ah-view-site"
            style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: '0.72rem',
              letterSpacing: '0.16em',
              color: '#666666',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              transition: 'color 0.15s',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            View Site
          </Link>

          {/* Avatar dropdown */}
          <div className="ah-dropdown-wrap" style={{ position: 'relative' }}>
            <div
              className="ah-avatar"
              style={{
                width: 32, height: 32,
                border: '1px solid #ff6600',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Oswald', sans-serif",
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#ff6600',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              A
            </div>

            <div
              className="ah-dropdown"
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                width: 180,
                background: '#0d0d0d',
                border: '1px solid #ff6600',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                zIndex: 200,
              }}
            >
              {[
                { label: 'Your Profile', to: '/admin/profile' },
                { label: 'Settings',     to: '/admin/settings' },
              ].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontFamily: "'Oswald', sans-serif",
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#aaaaaa',
                    textDecoration: 'none',
                    borderBottom: '1px solid rgba(255,102,0,0.1)',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseOver={e => { e.currentTarget.style.color = '#ff9944'; e.currentTarget.style.background = 'rgba(255,102,0,0.07)'; }}
                  onMouseOut={e => { e.currentTarget.style.color = '#aaaaaa'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={onLogout}
                className="ah-logout"
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 16px',
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: '0.75rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: '#aaaaaa',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'color 0.15s, background 0.15s',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stripe rule under header */}
      <div className="stripe-rule" />
    </>
  );
}

export default AdminHeader;