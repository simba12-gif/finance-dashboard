'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlaidLink } from 'react-plaid-link'

export default function PlaidLink({ onSuccess }) {
  const [linkToken, setLinkToken] = useState(null)

  useEffect(() => {
    async function fetchLinkToken() {
      const response = await fetch('/api/plaid/create-link-token', { method: 'POST' })
      const data = await response.json()
      setLinkToken(data.link_token)
    }
    fetchLinkToken()
  }, [])

  const onPlaidSuccess = useCallback(async (public_token, metadata) => {
    await fetch('/api/plaid/exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ public_token, institution: metadata.institution }),
    })
    await fetch('/api/plaid/sync', { method: 'POST' })
    if (onSuccess) onSuccess()
  }, [onSuccess])

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess: onPlaidSuccess })

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      style={{
        background: '#7c3aed',
        color: '#fff',
        border: 'none',
        fontSize: '12px',
        padding: '8px 16px',
        borderRadius: '8px',
        cursor: ready ? 'pointer' : 'not-allowed',
        opacity: ready ? 1 : 0.6,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        flexShrink: 0,
      }}
    >
      Connect bank
    </button>
  )
}