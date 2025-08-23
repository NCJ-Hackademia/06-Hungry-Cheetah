import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Smart Animal Platform - IoT-Powered Livestock Management & Marketplace',
  description: 'Revolutionary platform for farmers to monitor animal health, manage livestock, and trade animals securely with real-time IoT data integration.',
  keywords: 'livestock management, animal health, IoT farming, animal marketplace, smart agriculture',
  authors: [{ name: 'Smart Animal Platform Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50">
          {children}
        </div>
      </body>
    </html>
  )
}
