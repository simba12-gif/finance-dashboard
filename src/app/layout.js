import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata = {
  title: 'Vault',
  description: 'Your personal finance dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={geist.className} style={{ background: '#fafaf9', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
//Every page in your app will use the Geist font and the warm off-white background automatically. You set it once here and never touch it again.