'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart2,
  MessageCircle,
  Settings,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { href: '/analytics', icon: BarChart2, label: 'Analytics' },
  { href: '/chat', icon: MessageCircle, label: 'AI Chat' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '60px',
      background: '#fff',
      borderRight: '0.5px solid #e8e6de',
      padding: '16px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '6px',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        width: '34px',
        height: '34px',
        background: '#7c3aed',
        borderRadius: '9px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '14px',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '15px', fontWeight: '500', color: '#fff' }}>V</span>
      </div>

      {/* Nav items */}
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href
        return (
          <Link key={href} href={href} title={label} style={{
            width: '38px',
            height: '38px',
            borderRadius: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isActive ? '#f3f0ff' : 'transparent',
            color: isActive ? '#7c3aed' : '#b4b2a9',
            transition: 'background 0.15s, color 0.15s',
          }}>
            <Icon size={17} />
          </Link>
        )
      })}

      {/* Avatar at bottom */}
      <div style={{ marginTop: 'auto' }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#f3f0ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: '500',
          color: '#7c3aed',
        }}>KH</div>
      </div>
    </aside>
  )
}
//The sidebar is a separate component because it appears on every page. `usePathname()` detects which page you're on so the active icon gets highlighted in purple. `'use client'` at the top is needed because `usePathname` is a React hook that runs in the browser, not on the server.