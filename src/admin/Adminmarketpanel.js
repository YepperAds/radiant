// AdminMarketPanel.js — Cassette Futurism · Palanomic
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import { getMarketData, createMarketItem, updateMarketItem, deleteMarketItem, publishMarketNewData } from '../services/api';

// ─── Field config ──────────────────────────────────────────────────────────────
const FIELD_CONFIG = {
  stocks: [
    { key: 'sym',     label: 'Ticker',               type: 'text',     required: true,  placeholder: 'BLR' },
    { key: 'name',    label: 'Company',              type: 'text',     required: true,  placeholder: 'Bralirwa' },
    { key: 'sector',  label: 'Sector',               type: 'text',     required: true,  placeholder: 'Consumer Goods' },
    { key: 'price',   label: 'Price (display)',       type: 'text',     required: true,  placeholder: 'RWF 348' },
    { key: 'raw',     label: 'Raw price (number)',    type: 'number',   required: true,  placeholder: '348' },
    { key: 'change',  label: 'Change (display)',      type: 'text',     required: true,  placeholder: '+2.13% YTD' },
    { key: 'chgNum',  label: 'Change %',              type: 'number',   required: true,  placeholder: '2.13' },
    { key: 'chgDir',  label: 'Direction',             type: 'select',   required: true,  options: ['up','dn','nt'] },
    { key: 'explain', label: 'Explanation (analyst)', type: 'textarea', required: false },
    { key: 'eli5',    label: 'Plain English (public)',type: 'textarea', required: false },
  ],
  forex: [
    { key: 'sym',     label: 'Code',                 type: 'text',     required: true,  placeholder: 'USD' },
    { key: 'name',    label: 'Currency',             type: 'text',     required: true,  placeholder: 'US Dollar' },
    { key: 'flag',    label: 'Flag emoji',           type: 'text',     required: false, placeholder: '🇺🇸' },
    { key: 'price',   label: 'Rate (display)',        type: 'text',     required: true,  placeholder: 'RWF 1,457' },
    { key: 'raw',     label: 'Raw rate',              type: 'number',   required: true,  placeholder: '1457' },
    { key: 'change',  label: 'Change (display)',      type: 'text',     required: true,  placeholder: '+4.72% YTD' },
    { key: 'chgNum',  label: 'Change %',              type: 'number',   required: true,  placeholder: '4.72' },
    { key: 'chgDir',  label: 'Direction',             type: 'select',   required: true,  options: ['up','dn','nt'] },
    { key: 'explain', label: 'Explanation (analyst)', type: 'textarea', required: false },
    { key: 'eli5',    label: 'Plain English (public)',type: 'textarea', required: false },
  ],
  goods: [
    { key: 'sym',     label: 'Code',                 type: 'text',     required: true,  placeholder: 'RICE' },
    { key: 'name',    label: 'Item',                 type: 'text',     required: true,  placeholder: 'Rice (1 kg)' },
    { key: 'sector',  label: 'Sector',               type: 'text',     required: true,  placeholder: 'Food' },
    { key: 'price',   label: 'Price (display)',       type: 'text',     required: true,  placeholder: 'RWF 1,350' },
    { key: 'raw',     label: 'Raw price',             type: 'number',   required: true,  placeholder: '1350' },
    { key: 'change',  label: 'Change (display)',      type: 'text',     required: true,  placeholder: '+3.1%' },
    { key: 'chgNum',  label: 'Change %',              type: 'number',   required: true,  placeholder: '3.1' },
    { key: 'chgDir',  label: 'Direction',             type: 'select',   required: true,  options: ['up','dn','nt'] },
    { key: 'explain', label: 'Explanation (analyst)', type: 'textarea', required: false },
    { key: 'eli5',    label: 'Plain English (public)',type: 'textarea', required: false },
  ],
};

const NEW_DATA_FIELDS      = ['price', 'raw', 'change', 'chgNum', 'chgDir', 'explain', 'eli5'];

const TABS = [
  { id: 'stocks', label: 'RSE Stocks',    color: '#c8963c' },
  { id: 'forex',  label: 'Forex / FX',   color: '#5b8fc8' },
  { id: 'goods',  label: 'Market Prices', color: '#ff9944' },
];

const DIR_COLORS = { up: '#22c55e', dn: '#ef4444', nt: '#f59e0b' };
const DIR_LABELS = { up: '▲ Up', dn: '▼ Down', nt: '— Flat' };

const emptyForm = () => ({
  sym: '', name: '', sector: '', flag: '',
  price: '', raw: '', change: '', chgNum: '', chgDir: 'nt',
  explain: '', eli5: '',
});

const inputBase = (err) => ({
  width: '100%', padding: '9px 11px', background: '#0d0d0d',
  border: `1px solid ${err ? '#ef4444' : 'rgba(255,102,0,0.2)'}`,
  borderRadius: 2, fontFamily: "'Libre Baskerville', serif", fontSize: '0.85rem',
  color: '#f0f0f0', outline: 'none', boxSizing: 'border-box',
});

const labelStyle = {
  display: 'block', fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem',
  letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666666', marginBottom: 5,
};

// ─── Step 1: Pick from list or add brand-new ──────────────────────────────────
function PickOrAddStep({ type, allItems, onPickNewData, onPickEdit, onChooseNew, onClose, dupError }) {
  const [search,           setSearch]           = useState('');
  const [showNewInput,     setShowNewInput]      = useState(false);
  const [newName,          setNewName]           = useState('');
  const [newSym,           setNewSym]            = useState('');
  const [nameChecked,      setNameChecked]       = useState(false);
  const [nameError,        setNameError]         = useState('');
  const [symError,         setSymError]          = useState('');

  const filtered = allItems.filter(item => {
    const q = search.toLowerCase();
    return !q || item.sym?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q);
  });

  const nameLabel   = type === 'stocks' ? 'Company Name' : type === 'forex' ? 'Currency Name' : 'Item Name';
  const namePH      = type === 'stocks' ? 'e.g. Bralirwa' : type === 'forex' ? 'e.g. British Pound' : 'e.g. Rice (1 kg)';
  const symLabel    = type === 'stocks' ? 'Ticker' : type === 'forex' ? 'Currency Code' : 'Short Code';
  const symPH       = type === 'stocks' ? 'e.g. BLR' : type === 'forex' ? 'e.g. GBP' : 'e.g. RICE';

  const handleCheckName = () => {
    const trimmed = newName.trim();
    if (!trimmed) { setNameError('Enter a name first'); return; }
    const dup = allItems.find(i => i.name?.toLowerCase() === trimmed.toLowerCase());
    if (dup) {
      setNameError(`"${trimmed}" already exists as ${dup.sym} — select it from the list above`);
      return;
    }
    setNameError('');
    setNameChecked(true);
  };

  const handleConfirmNew = () => {
    const upper = newSym.trim().toUpperCase();
    if (!upper) { setSymError(`Enter a ${symLabel.toLowerCase()} first`); return; }
    const exists = allItems.find(i => i.sym?.toUpperCase() === upper);
    if (exists) {
      setSymError(`"${upper}" already exists — select it from the list above`);
      return;
    }
    onChooseNew(upper, newName.trim());
  };

  const resetNew = () => {
    setShowNewInput(false); setNewName(''); setNewSym('');
    setNameChecked(false); setNameError(''); setSymError('');
  };

  const typeSingular = type === 'stocks' ? 'stock' : type === 'forex' ? 'currency' : 'item';

  return (
    <div>
      {/* Header */}
      <div style={{ background: '#0a0a0a', padding: '14px 22px', borderBottom: '1px solid #ff6600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#ff6600' }}>
          Update {type.toUpperCase()} Data
        </span>
        <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #ff6600', color: '#ff6600', width: 30, height: 30, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✕</button>
      </div>

      <div style={{ padding: '18px 22px' }}>
        <p style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '0.88rem', color: '#888', marginBottom: 16, lineHeight: 1.6 }}>
          Pick an existing {typeSingular} to update its data, or scroll down to add a brand-new one.
        </p>

        {dupError && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderLeft: '3px solid #ef4444', borderRadius: 2, padding: '10px 14px', marginBottom: 14, fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.1em', color: '#ef4444' }}>
            ⚠ <strong>{dupError}</strong> already exists (it may be archived). Select it from the list and use <strong>🆕 New Data</strong> to update its prices.
          </div>
        )}

        {/* Search bar */}
        {allItems.length > 0 && (
          <div style={{ position: 'relative', marginBottom: 10 }}>
            <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none' }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder={`Search ${type}…`} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputBase(false), paddingLeft: 32, width: '100%', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {/* List */}
        <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid rgba(255,102,0,0.12)', borderRadius: 2, marginBottom: 16 }}>
          {allItems.length === 0 ? (
            <div style={{ padding: '28px', textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.14em', color: '#444' }}>
              No {type} yet — use "Add New" below to get started.
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.12em', color: '#444' }}>
              No results
            </div>
          ) : (
            filtered.map((item, idx) => (
              <div key={item._id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px',
                borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,102,0,0.07)' : 'none',
                background: '#0d0d0d',
              }}>
                {/* Identity */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                    <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.06em', color: '#ff9944' }}>
                      {item.sym}
                    </span>
                    {item.flag && <span style={{ fontSize: '1.1rem' }}>{item.flag}</span>}
                    <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.83rem', color: '#ccc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                    {item.dataUpdatedAt && (
                      <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontFamily: "'Oswald', sans-serif", fontSize: '0.6rem', letterSpacing: '0.1em', padding: '1px 5px', borderRadius: 2 }}>NEW</span>
                    )}
                  </div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.06em', color: DIR_COLORS[item.chgDir] }}>
                    {item.price} · {item.chgDir === 'up' ? '▲' : item.chgDir === 'dn' ? '▼' : '—'} {item.change}
                  </div>
                </div>

                {/* Row actions */}
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button
                    onClick={() => onPickEdit(item)}
                    title="Fix a typo, sector, or name — no snapshot saved"
                    style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: '1px solid rgba(255,153,68,0.35)', color: '#ff9944', padding: '5px 10px', cursor: 'pointer', borderRadius: 2 }}
                  >✏ Edit</button>
                  <button
                    onClick={() => onPickNewData(item)}
                    title="Publish new period prices — previous data saved as snapshot"
                    style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', color: '#22c55e', padding: '5px 10px', cursor: 'pointer', borderRadius: 2 }}
                  >🆕 New Data</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Legend */}
        <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', color: '#444', lineHeight: 1.8, marginBottom: 20 }}>
          <strong style={{ color: '#ff9944' }}>✏ Edit</strong> — fix name, sector, or a typo. No snapshot.&nbsp;&nbsp;
          <strong style={{ color: '#22c55e' }}>🆕 New Data</strong> — publish fresh prices. Old data saved so users still see context in their activity feed.
        </p>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,102,0,0.12)' }} />
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.16em', color: '#555' }}>OR ADD BRAND NEW</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,102,0,0.12)' }} />
        </div>

        {/* Add-new section */}
        {!showNewInput ? (
          <button
            onClick={() => setShowNewInput(true)}
            style={{ width: '100%', fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', background: 'none', border: '1px dashed rgba(255,102,0,0.35)', color: '#ff6600', padding: '11px', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add new {typeSingular}
          </button>
        ) : (
          <div style={{ background: 'rgba(255,102,0,0.04)', border: '1px solid rgba(255,102,0,0.2)', borderRadius: 2, padding: '14px' }}>

            {/* Step A: enter name */}
            <div style={{ marginBottom: nameChecked ? 14 : 0 }}>
              <label style={labelStyle}>{nameLabel} *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  value={newName} autoFocus disabled={nameChecked}
                  onChange={e => { setNewName(e.target.value); setNameError(''); }}
                  onKeyDown={e => !nameChecked && e.key === 'Enter' && handleCheckName()}
                  placeholder={namePH}
                  style={{ ...inputBase(!!nameError), flex: 1, opacity: nameChecked ? 0.5 : 1 }}
                />
                {!nameChecked && (
                  <button onClick={handleCheckName} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: '#ff6600', color: '#000', border: 'none', padding: '9px 18px', cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap' }}>
                    Check →
                  </button>
                )}
                {nameChecked && (
                  <button onClick={() => { setNameChecked(false); setNewSym(''); setSymError(''); }} style={{ background: 'none', border: '1px solid rgba(255,102,0,0.2)', color: '#22c55e', padding: '9px 12px', cursor: 'pointer', borderRadius: 2, fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>✓ Change</button>
                )}
                <button onClick={resetNew} style={{ background: 'none', border: '1px solid rgba(255,102,0,0.2)', color: '#555', padding: '9px 12px', cursor: 'pointer', borderRadius: 2 }}>✕</button>
              </div>
              {nameError && (
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#ef4444', marginTop: 6 }}>⚠ {nameError}</p>
              )}
              {!nameChecked && (
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', color: '#555', marginTop: 8 }}>
                  We'll check this name doesn't already exist before proceeding.
                </p>
              )}
            </div>

            {/* Step B: enter sym — only shown after name is confirmed unique */}
            {nameChecked && (
              <div>
                <label style={labelStyle}>{symLabel} *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={newSym} autoFocus
                    onChange={e => { setNewSym(e.target.value.toUpperCase()); setSymError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleConfirmNew()}
                    placeholder={symPH}
                    style={{ ...inputBase(!!symError), flex: 1 }}
                  />
                  <button onClick={handleConfirmNew} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: '#ff6600', color: '#000', border: 'none', padding: '9px 18px', cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap' }}>
                    Continue →
                  </button>
                </div>
                {symError && (
                  <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#ef4444', marginTop: 6 }}>⚠ {symError}</p>
                )}
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.08em', color: '#555', marginTop: 8 }}>
                  Enter a unique short code or ticker for <strong style={{ color: '#ff9944' }}>{newName}</strong>.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 2: Data entry form ───────────────────────────────────────────────────
function DataFormStep({ type, mode, targetItem, newSym, form, setForm, onBack, onClose, onSave }) {
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const allFields     = FIELD_CONFIG[type];
  const visibleFields = mode === 'newdata' ? allFields.filter(f => NEW_DATA_FIELDS.includes(f.key))
                      : mode === 'new'     ? allFields.filter(f => f.key !== 'sym')
                      : allFields;

  const handleChange = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => { const e = { ...prev }; delete e[key]; return e; });
  };

  const validate = () => {
    const errs = {};
    visibleFields.forEach(f => { if (f.required && !String(form[f.key] ?? '').trim()) errs[f.key] = 'Required'; });
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, raw: parseFloat(form.raw), chgNum: parseFloat(form.chgNum) };
      if (mode === 'newdata')     await publishMarketNewData(type, targetItem._id, payload);
      else if (mode === 'edit')   await updateMarketItem(type, targetItem._id, payload);
      else                        await createMarketItem(type, { ...payload, sym: newSym });
      onSave();
    } catch (err) {
      // 409 = sym already exists (e.g. archived copy) — bounce back to pick step
      if (err.response?.status === 409) {
        const msg = err.response?.data?.message;
        if (msg === 'name_exists') {
          onBack(form.name); // bounce back showing name-dup error
        } else {
          onBack(newSym);    // sym already exists
        }
      } else {
        alert('Save failed: ' + (err.response?.data?.message || err.message));
      }
    } finally {
      setSaving(false);
    }
  };

  const accent = mode === 'newdata' ? '#22c55e' : '#ff6600';

  return (
    <>
      {/* Header */}
      <div style={{ background: '#0a0a0a', padding: '14px 22px', borderBottom: `1px solid ${accent}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', letterSpacing: '0.1em', padding: 0 }}>
            ← Back
          </button>
          <span style={{ color: '#2a2a2a' }}>|</span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>
            {mode === 'newdata' ? '🆕 New Period Data' : mode === 'edit' ? '✏ Edit' : '+ Add New'} — {type.toUpperCase()}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: `1px solid ${accent}`, color: accent, width: 30, height: 30, borderRadius: 2, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>✕</button>
      </div>

      {/* Context banner */}
      {(mode === 'newdata' || mode === 'edit') && targetItem && (
        <div style={{ background: mode === 'newdata' ? 'rgba(34,197,94,0.07)' : 'rgba(255,102,0,0.05)', borderBottom: `1px solid ${mode === 'newdata' ? 'rgba(34,197,94,0.2)' : 'rgba(255,102,0,0.15)'}`, padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.88rem', fontWeight: 700, color: accent, letterSpacing: '0.06em' }}>{targetItem.sym}</span>
          {targetItem.flag && <span style={{ fontSize: '1rem' }}>{targetItem.flag}</span>}
          <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.85rem', color: '#ccc' }}>{targetItem.name}</span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#555' }}>· current: {targetItem.price} {targetItem.change}</span>
        </div>
      )}
      {mode === 'new' && (
        <div style={{ background: 'rgba(34,197,94,0.06)', borderBottom: '1px solid rgba(34,197,94,0.2)', padding: '10px 22px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.85rem', fontWeight: 700, color: '#22c55e', letterSpacing: '0.1em' }}>{newSym}</span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', color: '#555', letterSpacing: '0.08em' }}>— new entry, fill in all details below</span>
        </div>
      )}

      {/* Fields grid */}
      <div style={{ padding: '22px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {visibleFields.map(field => {
          const val = form[field.key] ?? '';
          const err = errors[field.key];
          let inputEl;
          if (field.type === 'select') {
            inputEl = (
              <select value={val} onChange={e => handleChange(field.key, e.target.value)} style={{ ...inputBase(err), background: '#0d0d0d', cursor: 'pointer' }}>
                {field.options.map(o => <option key={o} value={o}>{DIR_LABELS[o] || o}</option>)}
              </select>
            );
          } else if (field.type === 'textarea') {
            inputEl = <textarea value={val} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder || ''} rows={3} style={{ ...inputBase(err), resize: 'vertical', minHeight: 72, fontFamily: "'Libre Baskerville', serif" }} />;
          } else {
            inputEl = <input type={field.type} value={val} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder || ''} style={inputBase(err)} />;
          }
          return (
            <div key={field.key} style={{ gridColumn: field.type === 'textarea' ? '1 / -1' : 'auto' }}>
              <label style={{ ...labelStyle, color: err ? '#ef4444' : '#666666' }}>
                {field.label} {field.required && <span style={{ color: '#ef4444' }}>*</span>}
              </label>
              {inputEl}
              {err && <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#ef4444', marginTop: 3 }}>{err}</p>}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '14px 22px', borderTop: '1px solid rgba(255,102,0,0.15)', background: '#0d0d0d', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={onClose} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', background: 'none', border: '1px solid rgba(255,102,0,0.2)', color: '#666', padding: '8px 20px', cursor: 'pointer', borderRadius: 2 }}>Cancel</button>
        <button onClick={handleSubmit} disabled={saving} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', background: saving ? '#333' : accent, color: saving ? '#666' : '#000', border: 'none', padding: '8px 24px', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
          {saving ? 'Saving…' : mode === 'newdata' ? 'Publish New Data' : mode === 'edit' ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </>
  );
}

// ─── Combined Modal ───────────────────────────────────────────────────────────
function ItemModal({ type, editItem, allItems, onSave, onClose }) {
  const [step,       setStep]      = useState(editItem ? 'edit' : 'pick');
  const [targetItem, setTarget]    = useState(editItem || null);
  const [newSym,     setNewSym]    = useState('');
  const [form,       setForm]      = useState(() => editItem ? { ...editItem } : emptyForm());
  const [dupError,   setDupError]  = useState('');

  const goEdit    = (item) => { setTarget(item); setForm({ ...item }); setDupError(''); setStep('edit'); };
  const goNewData = (item) => { setTarget(item); setForm({ price: '', raw: '', change: '', chgNum: '', chgDir: 'nt', explain: item.explain || '', eli5: item.eli5 || '' }); setDupError(''); setStep('newdata'); };
  const goNew     = (sym, name)  => { setNewSym(sym); setForm({ ...emptyForm(), name: name || '' }); setDupError(''); setStep('new'); };
  const goBack    = (sym)  => { setStep('pick'); setTarget(null); setNewSym(''); setForm(emptyForm()); if (sym) setDupError(sym); };

  const accent = step === 'newdata' ? '#22c55e' : '#ff6600';

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 200, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 16px', overflowY: 'auto' }}>
      <div style={{ background: '#151515', borderRadius: 2, border: `2px solid ${accent}`, width: '100%', maxWidth: 700, boxShadow: '0 24px 64px rgba(0,0,0,0.7)', overflow: 'hidden' }}>
        {step === 'pick' && (
          <PickOrAddStep type={type} allItems={allItems} onPickEdit={goEdit} onPickNewData={goNewData} onChooseNew={goNew} onClose={onClose} dupError={dupError} />
        )}
        {(step === 'edit' || step === 'newdata' || step === 'new') && (
          <DataFormStep type={type} mode={step} targetItem={targetItem} newSym={newSym} form={form} setForm={setForm} onBack={editItem ? onClose : () => goBack(step === 'new' ? newSym : '')} onClose={onClose} onSave={onSave} />
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMarketPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stocks');
  const [items,     setItems]     = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error,     setError]     = useState('');
  const [showForm,  setShowForm]  = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [toast,     setToast]     = useState('');
  const [search,    setSearch]    = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchItems = useCallback(async () => {
    setIsLoading(true); setError('');
    try { setItems(await getMarketData(activeTab)); }
    catch (err) { setError('Failed to load: ' + (err.response?.data?.message || err.message)); }
    finally { setIsLoading(false); }
  }, [activeTab]);

  useEffect(() => { setSearch(''); fetchItems(); }, [activeTab, fetchItems]);

  const handleSave   = () => { setShowForm(false); setEditItem(null); fetchItems(); showToast('✓ Saved'); };
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try { await deleteMarketItem(activeTab, id); fetchItems(); showToast('✓ Deleted'); }
    catch (err) { alert('Delete failed: ' + (err.response?.data?.message || err.message)); }
  };
  const handleLogout = () => {
    ['authToken','userRole','userEmail','userName'].forEach(k => localStorage.removeItem(k));
    navigate('/login');
  };

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    return !q || item.sym?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q);
  });

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  const TH = { background: '#0a0a0a', borderBottom: '1px solid #ff6600', padding: '10px 14px', fontFamily: "'Oswald', sans-serif", fontSize: '0.62rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#ff6600', textAlign: 'left', whiteSpace: 'nowrap', fontWeight: 500 };
  const TD = { padding: '12px 14px', borderBottom: '1px solid rgba(255,102,0,0.07)', verticalAlign: 'middle' };

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#111111', minHeight: '100vh', color: '#f0f0f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.3} }
        .market-row:hover td { background: rgba(255,102,0,0.04) !important; }
        .tab-btn:hover:not(.active-tab) { color: #aaaaaa !important; }
        .add-btn-mkt:hover { background: #ff9944 !important; }
        .act-del:hover { background: rgba(239,68,68,0.1) !important; }
        .search-inp:focus { border-color: #ff6600 !important; outline: none; }
      `}</style>

      <AdminHeader onLogout={handleLogout} />
      <div style={{ display: 'flex' }}>
        <AdminSidebar activePage="market" />
        <main style={{ flex: 1, padding: '28px 32px', overflow: 'hidden' }}>

          {/* Page header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 22 }}>
            <div>
              <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#f0f0f0', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6600', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                Market Data
              </div>
              <div style={{ fontFamily: "'Libre Baskerville', serif", fontStyle: 'italic', fontSize: '0.85rem', color: '#555555', marginTop: 4 }}>
                Manage RSE stocks, forex rates, and market prices manually
              </div>
            </div>
            <button
              onClick={() => { setEditItem(null); setShowForm(true); }}
              className="add-btn-mkt"
              style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', background: '#ff6600', color: '#000', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 7, transition: 'background 0.15s' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Update / Add {activeTab === 'stocks' ? 'Stock' : activeTab === 'forex' ? 'Currency' : 'Item'}
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,102,0,0.15)', marginBottom: 16 }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn${activeTab === tab.id ? ' active-tab' : ''}`}
                style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '11px 22px', border: 'none', background: 'none', cursor: 'pointer', color: activeTab === tab.id ? tab.color : '#444444', borderBottom: `2px solid ${activeTab === tab.id ? tab.color : 'transparent'}`, marginBottom: -1, transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                {tab.label}
                {activeTab === tab.id && <span style={{ background: tab.color, color: '#000', borderRadius: 2, padding: '1px 7px', fontSize: '0.65rem', fontWeight: 700 }}>{filtered.length}</span>}
              </button>
            ))}
          </div>

          {/* Search + error */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
            <div style={{ position: 'relative', maxWidth: 280 }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#444444', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="search-inp" type="text" placeholder={`Search ${activeTab}…`} value={search} onChange={e => setSearch(e.target.value)}
                style={{ background: '#0d0d0d', border: '1px solid rgba(255,102,0,0.2)', borderRadius: 2, padding: '8px 12px 8px 32px', width: 260, fontFamily: "'Libre Baskerville', serif", fontSize: '0.82rem', color: '#f0f0f0', transition: 'border-color 0.15s' }}
              />
            </div>
            {error && (
              <div style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderLeft: '3px solid #ef4444', borderRadius: 2, fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 10 }}>
                ⚠ {error}
                <button onClick={fetchItems} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 'inherit', letterSpacing: 'inherit' }}>Retry</button>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ background: '#151515', border: '1px solid rgba(255,102,0,0.15)', borderRadius: 2, overflow: 'hidden' }}>
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <div style={{ width: 36, height: 36, border: '3px solid #1e1e1e', borderTopColor: activeTabConfig.color, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '2rem', color: '#ff6600', marginBottom: 12, opacity: 0.4 }}>◈</div>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.75rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#444444' }}>
                  {search ? 'No results found' : `No ${activeTab} yet — click the button above to start`}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr>{['Sym','Name', activeTab === 'forex' ? 'Flag' : 'Sector','Price','Change','Direction','Updated','Actions'].map(h => <th key={h} style={TH}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => (
                      <tr key={item._id} className="market-row">
                        <td style={TD}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.88rem', fontWeight: 700, letterSpacing: '0.08em', color: activeTabConfig.color }}>{item.sym}</span>
                            {item.dataUpdatedAt && <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '1px 5px', borderRadius: 2 }}>NEW</span>}
                          </div>
                        </td>
                        <td style={{ ...TD, fontFamily: "'Libre Baskerville', serif", fontWeight: 700, color: '#e0e0e0', maxWidth: 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</td>
                        <td style={{ ...TD, color: '#555555' }}>{activeTab === 'forex' ? <span style={{ fontSize: '1.2rem' }}>{item.flag}</span> : item.sector}</td>
                        <td style={{ ...TD, fontFamily: "'Oswald', sans-serif", fontWeight: 700, color: '#f0f0f0', whiteSpace: 'nowrap' }}>{item.price}</td>
                        <td style={{ ...TD, color: DIR_COLORS[item.chgDir], whiteSpace: 'nowrap', fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: '0.82rem' }}>{item.change}</td>
                        <td style={TD}>
                          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 2, background: item.chgDir === 'up' ? 'rgba(34,197,94,0.12)' : item.chgDir === 'dn' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)', color: DIR_COLORS[item.chgDir] }}>
                            {DIR_LABELS[item.chgDir]}
                          </span>
                        </td>
                        <td style={{ ...TD, color: '#444444', fontSize: '0.72rem', whiteSpace: 'nowrap', fontFamily: "'Oswald', sans-serif", letterSpacing: '0.06em' }}>
                          {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ ...TD, whiteSpace: 'nowrap' }}>
                          <button onClick={() => { setEditItem(item); setShowForm(true); }} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '1px solid rgba(255,153,68,0.2)', color: '#ff9944', padding: '4px 10px', cursor: 'pointer', borderRadius: 2, marginRight: 6 }}>Edit</button>
                          <button className="act-del" onClick={() => handleDelete(item._id, item.name)} style={{ fontFamily: "'Oswald', sans-serif", fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', background: 'none', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '4px 10px', cursor: 'pointer', borderRadius: 2 }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Stats */}
          {!isLoading && filtered.length > 0 && (
            <div style={{ marginTop: 10, display: 'flex', gap: 16, fontFamily: "'Oswald', sans-serif", fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              <span style={{ color: '#444444' }}>{filtered.length} items</span>
              <span style={{ color: '#333333' }}>·</span>
              <span style={{ color: '#22c55e' }}>{filtered.filter(i => i.chgDir === 'up').length} rising</span>
              <span style={{ color: '#333333' }}>·</span>
              <span style={{ color: '#ef4444' }}>{filtered.filter(i => i.chgDir === 'dn').length} falling</span>
              <span style={{ color: '#333333' }}>·</span>
              <span style={{ color: '#f59e0b' }}>{filtered.filter(i => i.chgDir === 'nt').length} flat</span>
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#0a0a0a', border: '1px solid #ff6600', color: '#ff6600', padding: '10px 20px', borderRadius: 2, fontFamily: "'Oswald', sans-serif", fontSize: '0.78rem', letterSpacing: '0.16em', textTransform: 'uppercase', boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 300 }}>
          {toast}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <ItemModal type={activeTab} editItem={editItem} allItems={items} onSave={handleSave} onClose={() => { setShowForm(false); setEditItem(null); }} />
      )}
    </div>
  );
}