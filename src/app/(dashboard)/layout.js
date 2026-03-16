import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{
        marginLeft: '60px',
        flex: 1,
        padding: '32px',
        minHeight: '100vh',
        background: '#fafaf9',
      }}>
        {children}
      </main>
    </div>
  )
}
//The (dashboard) folder name with parentheses is a Next.js feature called a Route Group. It groups pages together under a shared layout WITHOUT adding the folder name to the URL. So /dashboard, /transactions, /chat all share this sidebar layout, but the URL stays clean.