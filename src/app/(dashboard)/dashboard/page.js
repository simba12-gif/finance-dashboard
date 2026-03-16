'use client'

import { useEffect, useState } from 'react'
import PlaidLink from '@/components/PlaidLink'

const categoryColors = [
  '#7c3aed', '#a78bfa', '#c4b5fd',
  '#ddd6fe', '#ede9fe', '#f5f3ff'
]

function StatCard({ label, value, sub, subColor, big }) {
  return (
    <div style={{
      background: big ? '#7c3aed' : '#fff',
      border: `0.5px solid ${big ? '#7c3aed' : '#e8e6de'}`,
      borderRadius: '10px',
      padding: '16px 18px',
    }}>
      <div style={{
        fontSize: '11px',
        color: big ? 'rgba(255,255,255,0.6)' : '#888780',
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '8px',
      }}>{label}</div>
      <div style={{
        fontSize: big ? '30px' : '22px',
        fontWeight: '500',
        color: big ? '#fff' : '#1a1916',
        letterSpacing: '-0.5px',
      }}>{value}</div>
      {sub && (
        <div style={{
          fontSize: '12px',
          color: big ? 'rgba(255,255,255,0.7)' : (subColor || '#888780'),
          marginTop: '5px',
        }}>{sub}</div>
      )}
    </div>
  )
}

function AccountCard({ account }) {
  const stripeColor =
    account.type === 'credit' ? '#e24b4a' :
    account.type === 'depository' && account.subtype === 'savings' ? '#059669' :
    '#7c3aed'

  const isCredit = account.type === 'credit'

  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #e8e6de',
      borderRadius: '10px',
      padding: '14px 16px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '3px',
        height: '100%',
        background: stripeColor,
      }} />
      <div style={{ fontSize: '10px', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: '6px' }}>
        {account.subtype || account.type}
      </div>
      <div style={{ fontSize: '11px', color: '#888780', marginBottom: '3px' }}>{account.name}</div>
      <div style={{ fontSize: '18px', fontWeight: '500', color: isCredit ? '#e24b4a' : '#1a1916' }}>
        {isCredit ? '-' : ''}${Math.abs(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  async function loadData() {
    const res = await fetch('/api/dashboard')
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => { loadData() }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#888780', fontSize: '14px' }}>
      Loading your finances...
    </div>
  )

  const maxCategory = data.categories[0]?.amount || 1

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1916' }}>
            {greeting}, Harshita
          </h1>
          <p style={{ fontSize: '13px', color: '#888780', marginTop: '3px', marginBottom: '24px' }}>
            Here's your financial summary for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <PlaidLink onSuccess={loadData} />
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', marginBottom: '18px' }}>
        <StatCard
          big
          label="Net worth"
          value={`$${data.netWorth.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub="+tracking your wealth"
        />
        <StatCard
          label="Assets"
          value={`$${data.totalAssets.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub={`${data.accounts.filter(a => a.type !== 'credit').length} accounts`}
          subColor="#888780"
        />
        <StatCard
          label="Debt"
          value={`$${data.totalDebt.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub={`${data.accounts.filter(a => a.type === 'credit').length} credit card`}
          subColor="#e24b4a"
        />
        <StatCard
          label="Spent"
          value={`$${data.monthlySpend.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          sub="this month"
          subColor="#888780"
        />
      </div>

      {/* Account cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
        {data.accounts.map(acc => <AccountCard key={acc.id} account={acc} />)}
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* Spending by category */}
        <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1916' }}>Spending by category</span>
            <span style={{ fontSize: '11px', color: '#888780' }}>This month</span>
          </div>
          {data.categories.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#888780' }}>No spending data yet</p>
          ) : (
            data.categories.map((cat, i) => (
              <div key={cat.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i === data.categories.length - 1 ? 0 : '10px' }}>
                <span style={{ fontSize: '11px', color: '#888780', width: '90px', flexShrink: 0 }}>{cat.name}</span>
                <div style={{ flex: 1, height: '5px', background: '#f3f0ff', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: '3px', background: categoryColors[i] || '#ede9fe', width: `${(cat.amount / maxCategory) * 100}%` }} />
                </div>
                <span style={{ fontSize: '11px', color: '#3d3d3a', width: '52px', textAlign: 'right' }}>
                  ${cat.amount.toFixed(0)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Recent transactions */}
        <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#1a1916' }}>Recent transactions</span>
            <a href="/transactions" style={{ fontSize: '11px', color: '#7c3aed', cursor: 'pointer' }}>View all</a>
          </div>
          {data.recent.map((txn, i) => (
            <div key={txn.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i === data.recent.length - 1 ? 0 : '11px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: txn.amount < 0 ? '#f0fdf4' : '#f8f7f4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', color: txn.amount < 0 ? '#059669' : '#888780', flexShrink: 0,
              }}>
                {txn.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#3d3d3a' }}>{txn.name}</div>
                <div style={{ fontSize: '10px', color: '#888780' }}>
                  {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {txn.category || 'Uncategorized'}
                </div>
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: txn.amount < 0 ? '#059669' : '#e24b4a' }}>
                {txn.amount < 0 ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
//This page does several things at once — fetches data from your API, calculates the greeting based on the time of day, renders the stat cards, account cards, category bars, and transaction feed. Each section maps directly to what you saw in the mockup.