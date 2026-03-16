import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
  where: {
    type: { in: ['depository', 'credit'] },
    subtype: { in: ['checking', 'savings', 'credit card'] }
  },
  distinct: ['accountId'],
  take:3
})
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 100,
    })

    // Calculate net worth
    let totalAssets = 0
    let totalDebt = 0
    accounts.forEach(acc => {
      if (acc.type === 'credit') {
        totalDebt += Math.abs(acc.balance)
      } else {
        totalAssets += acc.balance
      }
    })
    const netWorth = totalAssets - totalDebt

    // Calculate total spent this month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyTransactions = transactions.filter(t =>
      new Date(t.date) >= startOfMonth && t.amount > 0
    )
    const monthlySpend = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0)

    // Spending by category
    const categoryMap = {}
    monthlyTransactions.forEach(t => {
      const cat = t.category || 'Uncategorized'
      categoryMap[cat] = (categoryMap[cat] || 0) + t.amount
    })
    const categories = Object.entries(categoryMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)

    // Recent transactions
    const recent = transactions.slice(0, 8)

    return NextResponse.json({
      accounts,
      netWorth,
      totalAssets,
      totalDebt,
      monthlySpend,
      categories,
      recent,
    })
  } catch (error) {
    console.error('Dashboard error:', error)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
// Instead of querying the database directly from the UI, we create an API route. The dashboard page calls this endpoint and gets back all the numbers it needs in one clean request. This separation of concerns is good practice — your UI doesn't need to know how the database works.