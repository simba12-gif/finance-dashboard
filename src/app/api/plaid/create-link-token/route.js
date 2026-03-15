import { NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { CountryCode, Products } from 'plaid'

export async function POST() {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id' },
      client_name: 'Finance Dashboard',
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    })
    return NextResponse.json({ link_token: response.data.link_token })
  } catch (error) {
    console.error('Error creating link token:', error)
    return NextResponse.json({ error: 'Failed to create link token' }, { status: 500 })
  }
}

//When the user clicks "Connect Bank", your app first asks Plaid for a temporary link_token. Plaid uses this token to securely open the bank login popup.