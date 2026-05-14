import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@600&family=Oswald:wght@300;400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

  .pal-auth-root {
    min-height: 100vh;
    background: #f7f7f7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
  }
  .pal-auth-root::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: repeating-linear-gradient(90deg, #c8963c 0px, #c8963c 18px, #d4520a 18px, #d4520a 24px, #c8963c 24px, #c8963c 42px, #8c3206 42px, #8c3206 48px);
  }
  .pal-topbar {
    position: absolute; top: 4px; left: 0; right: 0;
    background: #1a1009; height: 44px;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .pal-topbar-logo {
    font-family: 'Orbitron', sans-serif; font-size: 0.85rem; font-weight: 600;
    color: #f5efe0; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
  }
  .pal-topbar-divider { width: 1px; height: 14px; background: rgba(200,150,60,0.4); }
  .pal-topbar-sub {
    font-family: 'Oswald', sans-serif; font-size: 0.55rem;
    letter-spacing: 0.28em; color: #c8963c; text-transform: uppercase;
  }
  .pal-status-tag {
    display: flex; align-items: center; gap: 7px;
    font-family: 'Oswald', sans-serif; font-size: 0.58rem; letter-spacing: 0.26em;
    text-transform: uppercase; color: #9a8060;
    border: 1px solid rgba(200,150,60,0.3); background: #fff;
    padding: 5px 14px; margin-bottom: 20px; margin-top: 68px;
  }
  .pal-status-dot {
    width: 5px; height: 5px; border-radius: 50%; background: #d4520a;
    animation: palPulse 2s infinite; flex-shrink: 0;
  }
  @keyframes palPulse { 0%,100% { opacity:1; } 50% { opacity:0.25; } }

  .pal-card {
    background: #ffffff; border: 1px solid #e2d9cc; border-top: 3px solid #c8963c;
    width: 100%; max-width: 420px; position: relative;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  .pal-corner { position: absolute; width: 12px; height: 12px; }
  .pal-corner-tl { top: -3px; left: 0; border-top: 2px solid #d4520a; border-left: 2px solid #d4520a; }
  .pal-corner-tr { top: -3px; right: 0; border-top: 2px solid #d4520a; border-right: 2px solid #d4520a; }
  .pal-corner-bl { bottom: 0; left: 0; border-bottom: 2px solid rgba(200,150,60,0.3); border-left: 2px solid rgba(200,150,60,0.3); }
  .pal-corner-br { bottom: 0; right: 0; border-bottom: 2px solid rgba(200,150,60,0.3); border-right: 2px solid rgba(200,150,60,0.3); }
  .pal-card-inner { padding: 32px 32px 28px; }

  .pal-emblem {
    width: 48px; height: 48px; background: #1a1009;
    border: 1px solid rgba(200,150,60,0.5);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; position: relative;
  }
  .pal-emblem::after { content: ''; position: absolute; inset: 4px; border: 1px solid rgba(200,150,60,0.2); }

  .pal-title {
    font-family: 'Orbitron', sans-serif; font-size: 1rem; font-weight: 600;
    color: #1a1009; text-align: center; letter-spacing: 0.08em;
    text-transform: uppercase; margin: 0 0 4px;
  }
  .pal-subtitle {
    font-family: 'Oswald', sans-serif; font-size: 0.62rem; letter-spacing: 0.28em;
    color: #c8963c; text-align: center; text-transform: uppercase; margin: 0 0 24px;
  }
  .pal-divider {
    height: 1px;
    background: repeating-linear-gradient(90deg, rgba(200,150,60,0.4) 0px, rgba(200,150,60,0.4) 6px, transparent 6px, transparent 10px);
    margin-bottom: 22px;
  }
  .pal-field { margin-bottom: 16px; }
  .pal-label {
    display: block; font-family: 'Oswald', sans-serif; font-size: 0.62rem;
    letter-spacing: 0.22em; color: #6a5a38; text-transform: uppercase; margin-bottom: 6px;
  }
  .pal-input {
    width: 100%; background: #faf9f6;
    border: 1px solid #ddd5c4; border-left: 2px solid #d4520a;
    color: #1a1009; font-family: 'Oswald', sans-serif; font-size: 0.85rem;
    letter-spacing: 0.05em; padding: 10px 12px; box-sizing: border-box;
    outline: none; transition: border-color 0.15s;
  }
  .pal-input:focus { border-color: #c8963c; border-left-color: #d4520a; }
  .pal-input::placeholder { color: #c4b89a; }
  .pal-btn-primary {
    width: 100%; background: #d4520a; border: 1px solid #8c3206; color: #fff;
    font-family: 'Oswald', sans-serif; font-size: 0.72rem; letter-spacing: 0.26em;
    text-transform: uppercase; padding: 11px 20px; cursor: pointer;
    transition: background 0.15s; margin-top: 8px;
  }
  .pal-btn-primary:hover:not(:disabled) { background: #f07228; }
  .pal-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .pal-btn-ghost {
    width: 100%; background: transparent;
    border: 1px solid rgba(200,150,60,0.4); color: #9a7a3a;
    font-family: 'Oswald', sans-serif; font-size: 0.68rem; letter-spacing: 0.22em;
    text-transform: uppercase; padding: 10px 20px; cursor: pointer;
    transition: all 0.15s; margin-top: 10px;
  }
  .pal-btn-ghost:hover { background: rgba(200,150,60,0.08); color: #6a5a38; border-color: #c8963c; }
  .pal-error {
    background: #fff3ef; border-left: 2px solid #d4520a;
    font-family: 'Oswald', sans-serif; font-size: 0.72rem; letter-spacing: 0.1em;
    color: #a03a08; padding: 10px 14px; margin-top: 12px;
  }
  .pal-link-row {
    margin-top: 20px; border-top: 1px solid #ede5d8; padding-top: 16px; text-align: center;
  }
  .pal-link-text { font-family: 'Libre Baskerville', serif; font-size: 0.8rem; color: #9a8060; }
  .pal-link-accent { color: #d4520a; text-decoration: none; transition: color 0.15s; }
  .pal-link-accent:hover { color: #f07228; }
`;

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await login(email, password);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('userEmail', response.user.email);
      localStorage.setItem('userName', response.user.name);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="pal-auth-root">

        <div className="pal-topbar">
          <Link to="/" className="pal-topbar-logo">Palanomic</Link>
          <div className="pal-topbar-divider" />
          <span className="pal-topbar-sub">Market Intelligence</span>
        </div>

        <div className="pal-status-tag">
          <div className="pal-status-dot" />
          Restricted Access
        </div>

        <div className="pal-card">
          <div className="pal-corner pal-corner-tl" />
          <div className="pal-corner pal-corner-tr" />
          <div className="pal-corner pal-corner-bl" />
          <div className="pal-corner pal-corner-br" />
          <div className="pal-card-inner">

            <div className="pal-emblem">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c8963c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1 className="pal-title">Admin Panel</h1>
            <p className="pal-subtitle">Authorised Personnel Only</p>
            <div className="pal-divider" />

            <form onSubmit={handleSubmit}>
              <div className="pal-field">
                <label className="pal-label" htmlFor="email">Email Address</label>
                <input id="email" className="pal-input" type="email" autoComplete="email" required value={email} placeholder="admin@example.com" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="pal-field">
                <label className="pal-label" htmlFor="password">Password</label>
                <input id="password" className="pal-input" type="password" autoComplete="current-password" required value={password} placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
              </div>
              {error && <div className="pal-error">⚠ {error}</div>}
              <button type="submit" disabled={isLoading} className="pal-btn-primary">
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
            <div className="pal-link-row">
              <span className="pal-link-text">Don't have an account? <Link to="/register" className="pal-link-accent">Create one →</Link></span>
            </div>
          </div>
        </div> 

      </div>
    </>
  );
}