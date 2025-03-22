import './globals.css'
import { Inter, Lexend } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap'
})

export const metadata = {
  title: 'CampusElect - College Election Portal',
  description: 'A secure, transparent, and efficient election system for college students',
  keywords: 'college, election, voting, student representatives, secure voting',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' }
  ]
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lexend.variable}`}>
      <body className={inter.className}>
        <div className="noise-texture"></div>
        {children}
      </body>
    </html>
  )
}
