'use client'

import { useState, useRef, useEffect } from 'react'

const PURPLE = '#7c3aed'

const SUGGESTED = [
  "What's my net worth?",
  "What did I spend the most on?",
  "How much did I spend on food?",
  "What are my recent transactions?",
  "Am I in debt?",
]

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm Vault AI. I have access to your financial data — ask me anything about your spending, balances, or transactions.",
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage(text) {
    const userMessage = text || input
    if (!userMessage.trim()) return

    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>

      {/* Header */}
      <div style={{ marginBottom: '20px', flexShrink: 0 }}>
        <h1 style={{ fontSize: '20px', fontWeight: '500', color: '#1a1916' }}>AI Chat</h1>
        <p style={{ fontSize: '13px', color: '#888780', marginTop: '3px' }}>
          Ask anything about your finances
        </p>
      </div>

      {/* Suggested questions — only show when no user messages yet */}
      {messages.length === 1 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', flexShrink: 0 }}>
          {SUGGESTED.map(q => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              style={{
                background: '#fff',
                border: '0.5px solid #e8e6de',
                borderRadius: '20px',
                padding: '7px 14px',
                fontSize: '12px',
                color: '#3d3d3a',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        background: '#fff',
        border: '0.5px solid #e8e6de',
        borderRadius: '10px',
        padding: '20px',
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            alignItems: 'flex-start',
            gap: '10px',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: '28px', height: '28px', borderRadius: '8px',
                background: '#f3f0ff', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '12px', color: PURPLE,
                fontWeight: '500', flexShrink: 0,
              }}>V</div>
            )}
            <div style={{
              maxWidth: '70%',
              background: msg.role === 'user' ? PURPLE : '#fafaf9',
              color: msg.role === 'user' ? '#fff' : '#1a1916',
              padding: '10px 14px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              fontSize: '13px',
              lineHeight: '1.6',
              border: msg.role === 'assistant' ? '0.5px solid #e8e6de' : 'none',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '8px',
              background: '#f3f0ff', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '12px', color: PURPLE,
              fontWeight: '500', flexShrink: 0,
            }}>V</div>
            <div style={{
              background: '#fafaf9', border: '0.5px solid #e8e6de',
              padding: '10px 14px', borderRadius: '12px 12px 12px 2px',
              fontSize: '13px', color: '#888780',
            }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexShrink: 0,
      }}>
        <input
          style={{
            flex: 1,
            background: '#fff',
            border: '0.5px solid #e8e6de',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#1a1916',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          placeholder="Ask about your finances..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            background: loading || !input.trim() ? '#e8e6de' : PURPLE,
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '13px',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            transition: 'background 0.15s',
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
//The messages array holds the entire conversation history. Every time you send a message, the full history gets sent to the API so GPT remembers the context of the conversation. The useRef on the bottom div auto-scrolls to the latest message. The suggested questions make it easy to get started without knowing what to ask.