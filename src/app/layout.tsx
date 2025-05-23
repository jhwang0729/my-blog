import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal Web Application',
  description: 'A modern personal portfolio and note-taking application',
  keywords: ['portfolio', 'resume', 'notes', 'personal website'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Personal Web Application',
    description: 'A modern personal portfolio and note-taking application',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          {children}
        </div>
      </body>
    </html>
  )
} 