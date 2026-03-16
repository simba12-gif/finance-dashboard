'use client'

import { useEffect, useState } from 'react'

const PURPLE = '#7c3aed'

function exportToCSV(transactions) {
  const headers = ['Date', 'Name', 'Category', 'Amount', 'Status']
  const rows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    `"${t.name}"`,
    t.category || 'Uncategorized',
    t.amount.toFixed(2),
    t.pending ? 'Pending' : 'Cleared',
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'vault-transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  async function loadTransactions() {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    if (from) params.set('from', from)
    if (to) params.set('to', to)

    const res = await fetch(`/api/transactions?${params}`)
    const data = await res.json()
    setTransactions(data.transactions || [])
    setCategories(data.categories || [])
    setLoading(false)
  }

  useEffect(() => { loadTransactions() }, [search, category, from, to])

  const inputStyle = {
    background: '#fff',
    border: '0.5px solid #e8e6de',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '13px',
    color: '#1a1916',
    outline: 'none',
    fontFamily: 'inherit',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1916' }}>Transactions</h1>
          <p style={{ fontSize: '13px', color: '#888780', marginTop: '3px' }}>
            {transactions.length} transactions found
          </p>
        </div>
        <button
          onClick={() => exportToCSV(transactions)}
          style={{
            background: PURPLE,
            color: '#fff',
            border: 'none',
            fontSize: '12px',
            padding: '8px 16px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff',
        border: '0.5px solid #e8e6de',
        borderRadius: '10px',
        padding: '16px',
        marginBottom: '16px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <input
          style={{ ...inputStyle, flex: 1, minWidth: '180px' }}
          placeholder="Search transactions..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={{ ...inputStyle, minWidth: '150px' }}
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888780' }}>From</span>
          <input
            type="date"
            style={inputStyle}
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: '#888780' }}>To</span>
          <input
            type="date"
            style={inputStyle}
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </div>
        {(search || category !== 'all' || from || to) && (
          <button
            onClick={() => { setSearch(''); setCategory('all'); setFrom(''); setTo('') }}
            style={{ ...inputStyle, cursor: 'pointer', color: PURPLE, background: '#f3f0ff', border: `0.5px solid #e9d5ff` }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '0.5px solid #e8e6de', borderRadius: '10px', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 1fr 140px 100px 80px',
          padding: '12px 20px',
          borderBottom: '0.5px solid #e8e6de',
          background: '#fafaf9',
        }}>
          {['Date', 'Name', 'Category', 'Amount', 'Status'].map(h => (
            <span key={h} style={{ fontSize: '11px', color: '#888780', textTransform: 'uppercase', letterSpacing: '0.6px', fontWeight: '500' }}>{h}</span>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888780', fontSize: '13px' }}>
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888780', fontSize: '13px' }}>
            No transactions found
          </div>
        ) : (
          transactions.map((txn, i) => {
            const isCredit = txn.amount < 0
            return (
              <div
                key={txn.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '120px 1fr 140px 100px 80px',
                  padding: '13px 20px',
                  borderBottom: i === transactions.length - 1 ? 'none' : '0.5px solid #f3f1ea',
                  alignItems: 'center',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '12px', color: '#888780' }}>
                  {new Date(txn.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px',
                    background: isCredit ? '#f0fdf4' : '#f8f7f4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '11px', color: isCredit ? '#059669' : '#888780', flexShrink: 0,
                  }}>
                    {txn.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '13px', color: '#1a1916' }}>{txn.name}</span>
                </div>
                <span style={{
                  fontSize: '11px',
                  background: '#f3f0ff',
                  color: PURPLE,
                  padding: '3px 8px',
                  borderRadius: '20px',
                  display: 'inline-block',
                }}>
                  {txn.category || 'Uncategorized'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: isCredit ? '#059669' : '#e24b4a' }}>
                  {isCredit ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                </span>
                <span style={{
                  fontSize: '11px',
                  color: txn.pending ? '#f59e0b' : '#059669',
                  background: txn.pending ? '#fffbeb' : '#f0fdf4',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  display: 'inline-block',
                }}>
                  {txn.pending ? 'Pending' : 'Cleared'}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
// Instead of a library, we built the table from scratch using CSS Grid. Each row is a div with gridTemplateColumns matching the header. This gives us full control over the design. The filters use React useState — every time a filter changes, useEffect re-fetches from the API with the new parameters automatically.
//The exportToCSV function converts your transactions array into a comma-separated string, wraps it in a Blob, and triggers a browser download — no library needed.
