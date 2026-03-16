import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request) {
  try {
    const { messages } = await request.json()

    const accounts = await prisma.bankAccount.findMany({
      where: { type: { in: ['depository', 'credit'] }, subtype: { in: ['checking', 'savings', 'credit card'] } }
    })

    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
      take: 100,
    })

    const totalAssets = accounts
      .filter(a => a.type !== 'credit')
      .reduce((sum, a) => sum + a.balance, 0)

    const totalDebt = accounts
      .filter(a => a.type === 'credit')
      .reduce((sum, a) => sum + Math.abs(a.balance), 0)

    const categoryMap = {}
    transactions.filter(t => t.amount > 0).forEach(t => {
      const cat = t.category || 'Uncategorized'
      categoryMap[cat] = (categoryMap[cat] || 0) + t.amount
    })

    const categoryBreakdown = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .map(([cat, amt]) => `${cat}: $${amt.toFixed(2)}`)
      .join(', ')

    const recentTxns = transactions.slice(0, 20).map(t =>
      `${new Date(t.date).toLocaleDateString()} - ${t.name} - $${Math.abs(t.amount).toFixed(2)} (${t.category || 'Uncategorized'})`
    ).join('\n')

    const systemPrompt = `You are Vault, a helpful personal finance AI assistant. You have access to the user's real financial data. Be concise, friendly and specific. Always reference actual numbers from their data when answering.

FINANCIAL SUMMARY:
- Total assets: $${totalAssets.toFixed(2)}
- Total debt: $${totalDebt.toFixed(2)}
- Net worth: $${(totalAssets - totalDebt).toFixed(2)}

ACCOUNTS:
${accounts.map(a => `- ${a.name} (${a.subtype}): $${a.balance.toFixed(2)}`).join('\n')}

SPENDING BY CATEGORY (this month):
${categoryBreakdown}

RECENT TRANSACTIONS:
${recentTxns}

Answer questions based on this data. If asked something you don't have data for, say so honestly.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      max_tokens: 500,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.filter(m => m.role === 'user' || m.role === 'assistant'),
      ],
    })

    const reply = response.choices[0].message.content
    return NextResponse.json({ reply })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({
      reply: "AI chat requires an OpenAI API key to function. Add your OPENAI_API_KEY to the environment variables to enable this feature."
    })
  }
}