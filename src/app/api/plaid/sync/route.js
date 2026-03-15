import { NextResponse } from 'next/server'
import { plaidClient } from '@/lib/plaid'
import { prisma } from '@/lib/prisma'

export async function POST() {
  try {
    const plaidItems = await prisma.plaidItem.findMany()

    for (const item of plaidItems) {
      // Fetch accounts/balances
      const accountsResponse = await plaidClient.accountsGet({
        access_token: item.accessToken,
      })

      for (const account of accountsResponse.data.accounts) {
        await prisma.bankAccount.upsert({
          where: { accountId: account.account_id },
          update: { balance: account.balances.current || 0 },
          create: {
            plaidItemId: item.id,
            accountId: account.account_id,
            name: account.name,
            type: account.type,
            subtype: account.subtype || '',
            balance: account.balances.current || 0,
          },
        })
      }

      // Fetch transactions (last 30 days)
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0]

      const transactionsResponse = await plaidClient.transactionsGet({
        access_token: item.accessToken,
        start_date: startDate,
        end_date: endDate,
      })

      for (const transaction of transactionsResponse.data.transactions) {
        await prisma.transaction.upsert({
          where: { transactionId: transaction.transaction_id },
          update: {},
          create: {
            plaidItemId: item.id,
            transactionId: transaction.transaction_id,
            accountId: transaction.account_id,
            amount: transaction.amount,
            date: new Date(transaction.date),
            name: transaction.name,
            category: transaction.category?.[0] || 'Uncategorized',
            pending: transaction.pending,
          },
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error syncing:', error)
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 })
  }
}
//This is the route that actually fetches your bank balances and transactions from Plaid and saves them into your PostgreSQL database. You call this after linking a bank.