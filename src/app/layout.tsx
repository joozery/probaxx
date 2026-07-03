import type { Metadata } from 'next'
import './globals.css'
import { QuoteProvider } from '@/context/QuoteContext'
import QuoteModal from '@/components/QuoteModal'

export const metadata: Metadata = {
  title: 'PROBAX - Professional Water Tank Cleaning',
  description: 'ผู้เชี่ยวชาญงานล้างถังเก็บน้ำและถังบำบัดน้ำเสีย บริการด้วยทีมงานมืออาชีพ มาตรฐานสูง',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
          <QuoteProvider>
            {children}
            <QuoteModal />
          </QuoteProvider>
        </body>
    </html>
  )
}
