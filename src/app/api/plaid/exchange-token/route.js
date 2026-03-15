import { NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
  try {
    const { public_token, institution } = await request.json()

    const response = await plaidClient.itemPublicTokenExchange({
      public_token,
    })

    const accessToken = response.data.access_token
    const itemId = response.data.item_id

    // Save to database
    const plaidItem = await prisma.plaidItem.create({
      data: {
        userId: 'cmmrg1syj000010n2b6szrm3i',
        accessToken,
        itemId,
        institution: institution?.name || 'Unknown',
      },
    })

    return NextResponse.json({ success: true, itemId: plaidItem.id })
  } catch (error) {
    console.error('Error exchanging token:', error)
    return NextResponse.json({ error: 'Failed to exchange token' }, { status: 500 })
  }
}
//After the user logs into their bank in the popup, Plaid gives your app a temporary public_token. This route exchanges it for a permanent access_token and saves it to your database. The access_token is what you use forever after to fetch that bank's data.