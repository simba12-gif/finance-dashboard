'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#7c3aed', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff']

export default function AnalyticsPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/dashboard')
      const json = await res.json()
      setData(json)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#888780', fontSize: '14px' }}>
      Loading analytics...
    </div>
  )

  const maxCategory = data.categories[0]?.amount || 1
  const totalSpend = data.categories.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1916' }}>Analytics</h1>
        <p style={{ fontSize: '13px', color: '#888780', marginTop: '3px' }}>
          Your spending breakdown for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Top stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total spent', value: `$${totalSpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: 'this month' },
          { label: 'Transactions', value: data.recent.length, sub: 'this month' },
          { label: 'Top category', value: data.categories[0]?.name || 'N/A', sub: `$${data.categories[0]?.amount?.toFixed(0) || 0}` },
        ].map(card => (
          <div key={card.label} style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '16px 18px' }}>
            <div style={{ fontSize: '11px', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '500', color: '#1a1916' }}>{card.value}</div>
            <div style={{ fontSize: '12px', color: '#888780', marginTop: '4px' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Two panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

        {/* Category breakdown */}
        <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1916' }}>Spending by category</span>
            <span style={{ fontSize: '11px', color: '#888780' }}>This month</span>
          </div>
          {data.categories.map((cat, i) => (
            <div key={cat.name} style={{ marginBottom: i === data.categories.length - 1 ? 0 : '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', color: '#3d3d3a' }}>{cat.name}</span>
                <span style={{ fontSize: '12px', color: '#888780' }}>
                  ${cat.amount.toFixed(0)} · {((cat.amount / totalSpend) * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '6px', background: '#f3f0ff', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  borderRadius: '3px',
                  background: COLORS[i] || '#ede9fe',
                  width: `${(cat.amount / maxCategory) * 100}%`,
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Category percentage breakdown */}
        <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1916' }}>Category share</span>
          </div>
          {data.categories.map((cat, i) => (
            <div key={cat.name} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 0',
              borderBottom: i === data.categories.length - 1 ? 'none' : '0.5px solid #f3f1ea',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i] || '#ede9fe', flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: '#3d3d3a' }}>{cat.name}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontSize: '13px', color: '#888780' }}>${cat.amount.toFixed(0)}</span>
                <span style={{
                  fontSize: '11px',
                  background: '#f3f0ff',
                  color: '#7c3aed',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  minWidth: '44px',
                  textAlign: 'center',
                }}>
                  {((cat.amount / totalSpend) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}