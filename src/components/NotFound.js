// components/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      fontFamily: "'Libre Baskerville','Georgia',serif",
      background: '#f7f7f7',
      minHeight: '100vh',
      color: '#0d0d0d',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
    }}>

      {/* Outer frame */}
      <div style={{
        position: 'relative',
        background: '#ffffff',
        border: '2px solid #ff6600',
        borderRadius: 4,
        padding: '56px 60px 48px',
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
      }}>

        {/* Corner accents — all four corners */}
        {[
          { top: 10, left: 10 },
          { top: 10, right: 10 },
          { bottom: 10, left: 10 },
          { bottom: 10, right: 10 },
        ].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: 16,
            height: 16,
            borderTop:    (pos.top    !== undefined) ? '2px solid #ff6600' : 'none',
            borderBottom: (pos.bottom !== undefined) ? '2px solid #ff6600' : 'none',
            borderLeft:   (pos.left   !== undefined) ? '2px solid #ff6600' : 'none',
            borderRight:  (pos.right  !== undefined) ? '2px solid #ff6600' : 'none',
            ...pos,
          }} />
        ))}

        {/* Label */}
        <p style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: '0.72rem',
          letterSpacing: '0.24em',
          color: '#ff9944',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}>
          Signal Lost
        </p>

        {/* 404 */}
        <h1 style={{
          fontFamily: "'Oswald', sans-serif",
          fontSize: 'clamp(4rem, 14vw, 7rem)',
          fontWeight: 700,
          color: '#ff6600',
          lineHeight: 1,
          margin: '0 0 4px',
          letterSpacing: '0.04em',
        }}>
          404
        </h1>

        {/* Divider rule */}
        <div style={{
          width: 48,
          height: 2,
          background: '#ff6600',
          margin: '20px auto',
          opacity: 0.5,
        }} />

        {/* Headline */}
        <h2 style={{
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
          fontWeight: 700,
          color: '#0d0d0d',
          lineHeight: 1.25,
          margin: '0 0 14px',
        }}>
          Page Not Found
        </h2>

        {/* CTA button */}
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Oswald', sans-serif",
            fontSize: '0.82rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#ff6600',
            background: '#0d0d0d',
            border: '1px solid #ff6600',
            borderRadius: 2,
            padding: '10px 24px',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
          onMouseOver={e => {
            e.currentTarget.style.background = '#ff6600';
            e.currentTarget.style.color = '#0d0d0d';
          }}
          onMouseOut={e => {
            e.currentTarget.style.background = '#0d0d0d';
            e.currentTarget.style.color = '#ff6600';
          }}
        >
          ← Return to Homepage
        </Link>
      </div>

      {/* Footer note */}
      <p style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: '0.7rem',
        letterSpacing: '0.14em',
        color: '#aaaaaa',
        marginTop: 28,
        textTransform: 'uppercase',
      }}>
        Palanomic
      </p>

    </div>
  );
}

export default NotFound;