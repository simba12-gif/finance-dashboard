'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [name, setName] = useState('K Harshita')
  const [email, setEmail] = useState('test@example.com')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    width: '100%',
    background: '#fff',
    border: '0.5px solid #e8e6de',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '13px',
    color: '#1a1916',
    outline: 'none',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    fontSize: '12px',
    color: '#888780',
    marginBottom: '6px',
    display: 'block',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1916' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: '#888780', marginTop: '3px' }}>Manage your account preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Profile */}
        <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1916', marginBottom: '16px' }}>Profile</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '50%',
              background: '#f3f0ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '18px', fontWeight: '500', color: '#7c3aed',
            }}>KH</div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1916' }}>K Harshita</div>
              <div style={{ fontSize: '12px', color: '#888780' }}>test@example.com</div>
            </div>
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={labelStyle}>Display name</label>
            <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <button onClick={handleSave} style={{
            background: saved ? '#059669' : '#7c3aed',
            color: '#fff', border: 'none', fontSize: '13px',
            padding: '9px 18px', borderRadius: '8px', cursor: 'pointer',
            transition: 'background 0.2s',
          }}>
            {saved ? 'Saved!' : 'Save changes'}
          </button>
        </div>

        {/* Connected accounts */}
        <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '20px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1916', marginBottom: '16px' }}>Connected banks</h2>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 14px', background: '#fafaf9',
            border: '0.5px solid #e8e6de', borderRadius: '8px', marginBottom: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: '#f3f0ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', color: '#7c3aed', fontWeight: '500',
              }}>P</div>
              <div>
                <div style={{ fontSize: '13px', color: '#1a1916' }}>First Platypus Bank</div>
                <div style={{ fontSize: '11px', color: '#888780' }}>Connected via Plaid</div>
              </div>
            </div>
            <span style={{
              fontSize: '11px', background: '#f0fdf4',
              color: '#059669', padding: '3px 8px', borderRadius: '20px',
            }}>Active</span>
          </div>

          <h2 style={{ fontSize: '14px', fontWeight: '500', color: '#1a1916', margin: '20px 0 16px' }}>App preferences</h2>
          {[
            { label: 'Currency', value: 'USD — US Dollar' },
            { label: 'Date format', value: 'MM/DD/YYYY' },
            { label: 'Theme', value: 'Light' },
          ].map(pref => (
            <div key={pref.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: '0.5px solid #f3f1ea',
            }}>
              <span style={{ fontSize: '13px', color: '#888780' }}>{pref.label}</span>
              <span style={{ fontSize: '13px', color: '#1a1916' }}>{pref.value}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}