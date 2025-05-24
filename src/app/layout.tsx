import { ThemeProvider } from '@/contexts/ThemeContext'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Personal Portfolio | Modern Web Developer',
  description: 'A modern portfolio showcasing full-stack development skills, projects, and experience. Built with Next.js, TypeScript, and cutting-edge web technologies.',
  keywords: ['portfolio', 'web developer', 'full stack', 'Next.js', 'TypeScript', 'React'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Personal Portfolio | Modern Web Developer',
    description: 'Explore my journey as a full-stack developer through interactive projects and professional experience.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Portfolio | Modern Web Developer',
    description: 'Explore my journey as a full-stack developer through interactive projects and professional experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 