'use client'

import { useState, useCallback, useEffect } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import { Button } from '@/components/ui/button'

export default function PlaidLink({ onSuccess }) {
  const [linkToken, setLinkToken] = useState(null)

  useEffect(() => {
    async function fetchLinkToken() {
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
      })
      const data = await response.json()
      setLinkToken(data.link_token)
    }
    fetchLinkToken()
  }, [])

  const onPlaidSuccess = useCallback(async (public_token, metadata) => {
    await fetch('/api/plaid/exchange-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        public_token,
        institution: metadata.institution,
      }),
    })

    await fetch('/api/plaid/sync', { method: 'POST' })

    if (onSuccess) onSuccess()
  }, [onSuccess])

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  })

  return (
    <Button onClick={() => open()} disabled={!ready}>
      Connect Bank Account
    </Button>
  )
}