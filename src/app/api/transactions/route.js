import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const from = searchParams.get('from')
    const to = searchParams.get('to')

    const where = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      }
    }

    if (from || to) {
      where.date = {}
      if (from) where.date.gte = new Date(from)
      if (to) where.date.lte = new Date(to)
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    const categories = await prisma.transaction.groupBy({
      by: ['category'],
      orderBy: { category: 'asc' },
    })

    return NextResponse.json({
      transactions,
      categories: categories.map(c => c.category).filter(Boolean),
    })
  } catch (error) {
    console.error('Transactions error:', error)
    return NextResponse.json({ error: 'Failed to load transactions' }, { status: 500 })
  }
}
// This API route accepts filter parameters in the URL — for example /api/transactions?category=Travel&search=uber. The where object builds up dynamically based on which filters are active. This is how real search/filter systems work.