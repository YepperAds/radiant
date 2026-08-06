// AdminDangerZonePanel.js — Cassette Futurism · Palanomic
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { adminClearData, adminNormalizeArticles } from '../services/api';

const CONFIRM_PHRASE = 'CLEAR DATA';

const labelStyle = {
  display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
  letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666666', marginBottom: 8,
};

function DangerCard({ title, description, keeps, includeUserAccounts, onDone }) {
  const [typed,      setTyped]      = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');
  const ready = typed === CONFIRM_PHRASE;

  const handleClear = async () => {
    if (!ready) return;
    setSubmitting(true);
    setError('');
    setResult(null);
    try {
      const data = await adminClearData(includeUserAccounts);
      setResult(data.deleted);
      setTyped('');
      onDone?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear data');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: '#151515', border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: 2, padding: '20px 22px', marginBottom: 18,
    }}>
      <div style={{
        fontFamily: "'Oswald', sans-serif", fontSize: '0.9rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: '#ef4444', marginBottom: 8,
      }}>
        {title}
      </div>
      <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem', color: '#aaaaaa', marginBottom: 6, maxWidth: 600 }}>
        {description}
      </div>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.05em', color: '#22c55e', marginBottom: 16 }}>
        Kept: {keeps}
      </div>

      <label style={labelStyle}>Type "{CONFIRM_PHRASE}" to enable</label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={CONFIRM_PHRASE}
          style={{
            padding: '9px 11px', background: '#0d0d0d',
            border: `1px solid ${ready ? '#22c55e' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 2, fontFamily: "'Courier New', monospace", fontSize: '0.85rem',
            color: '#f0f0f0', outline: 'none', width: 220,
          }}
        />
        <button
          onClick={handleClear}
          disabled={!ready || submitting}
          style={{
            fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            background: ready ? '#ef4444' : 'rgba(239,68,68,0.15)',
            color: ready ? '#000' : '#661515',
            border: '1px solid #ef4444', padding: '10px 20px',
            cursor: ready && !submitting ? 'pointer' : 'not-allowed',
            borderRadius: 2, transition: 'all 0.15s',
          }}
        >
          {submitting ? 'Clearing…' : title}
        </button>
      </div>

      {error && (
        <div style={{ marginTop: 12, fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#ef4444' }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: 14, padding: '10px 14px', background: 'rgba(34,197,94,0.06)',
          border: '1px solid rgba(34,197,94,0.25)', borderRadius: 2,
          fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#8fd8a8',
          display: 'flex', flexWrap: 'wrap', gap: '4px 16px',
        }}>
          <span>News: {result.news}</span>
          <span>Comments: {result.comments}</span>
          <span>Stocks: {result.stocks}</span>
          <span>Forex: {result.forex}</span>
          <span>Goods: {result.goods}</span>
          {includeUserAccounts && <span>User accounts: {result.userAccounts}</span>}
          <span style={{ color: '#22c55e' }}>— deleted</span>
        </div>
      )}
    </div>
  );
}

function NormalizeArticlesCard() {
  const [submitting, setSubmitting] = useState(false);
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState('');

  const handleRun = async () => {
    setSubmitting(true);
    setError('');
    setResult(null);
    try {
      const data = await adminNormalizeArticles();
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to normalize articles');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      background: '#151515', border: '1px solid rgba(96,165,250,0.25)',
      borderRadius: 2, padding: '20px 22px', marginBottom: 18,
    }}>
      <div style={{
        fontFamily: "'Oswald', sans-serif", fontSize: '0.9rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: '#60a5fa', marginBottom: 8,
      }}>
        Fix Old Article Formatting
      </div>
      <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem', color: '#aaaaaa', marginBottom: 16, maxWidth: 600 }}>
        Rewrites any article still in the old draft shape (content starting with a literal
        "Headline: ..." / "Description: ..." block) — drops the duplicate headline/dek text
        and converts the section labels into real sub-headers. Leaves everything else untouched.
        Safe to re-run any time.
      </div>

      <button
        onClick={handleRun}
        disabled={submitting}
        style={{
          fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          background: '#60a5fa', color: '#000', border: '1px solid #60a5fa',
          padding: '10px 20px', cursor: submitting ? 'not-allowed' : 'pointer',
          borderRadius: 2, opacity: submitting ? 0.6 : 1, transition: 'all 0.15s',
        }}
      >
        {submitting ? 'Fixing…' : 'Fix Old Article Formatting'}
      </button>

      {error && (
        <div style={{ marginTop: 12, fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#ef4444' }}>
          ⚠ {error}
        </div>
      )}

      {result && (
        <div style={{
          marginTop: 14, padding: '10px 14px', background: 'rgba(96,165,250,0.06)',
          border: '1px solid rgba(96,165,250,0.25)', borderRadius: 2,
        }}>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#8fbdf8', marginBottom: result.updated?.length ? 8 : 0 }}>
            {result.message}
          </div>
          {result.updated?.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {result.updated.map((a) => (
                <span key={a.id} style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.78rem', color: '#ccc' }}>
                  ✓ {a.title}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminDangerZonePanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    ['authToken', 'userRole', 'userEmail', 'userName'].forEach((k) => localStorage.removeItem(k));
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
      `}</style>

      <AdminHeader onLogout={handleLogout} />

      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="danger-zone" />

        <main style={{ flex: 1, padding: '28px 32px', maxWidth: 760 }}>

          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: '#ef4444',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              ⚠ Danger Zone
            </div>
            <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem', color: '#666666', marginTop: 6 }}>
              These actions permanently delete data from the live database. There is no undo.
              Use this to reset the site between test runs.
            </div>
          </div>

          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#60a5fa', marginBottom: 10,
          }}>
            Maintenance
          </div>
          <NormalizeArticlesCard />

          <div style={{
            fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#ef4444', margin: '28px 0 10px',
          }}>
            Destructive
          </div>
          <DangerCard
            title="Clear Content Data"
            description="Deletes every News article, comment, and stock/forex/goods record — including archived price history."
            keeps="admin login, public user accounts"
            includeUserAccounts={false}
          />

          <DangerCard
            title="Clear Content + User Accounts"
            description="Everything above, plus every public UserAccount registration (site visitors/commenters)."
            keeps="admin login only"
            includeUserAccounts={true}
          />

        </main>
      </div>
    </div>
  );
}
