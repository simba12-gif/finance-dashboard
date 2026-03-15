'use client'

import { useState } from 'react'
import PlaidLink from '@/components/PlaidLink'

export default function Home() {
  const [synced, setSynced] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Finance Dashboard</h1>
      <PlaidLink onSuccess={() => setSynced(true)} />
      {synced && (
        <p className="mt-4 text-green-600">
          ✅ Bank connected and transactions synced!
        </p>
      )}
    </main>
  )
}