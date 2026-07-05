'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useQuote } from '@/context/QuoteContext'

const navLinks = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'บริการของเรา', href: '/services' },
  { label: 'เกี่ยวกับเรา', href: '/about' },
  { label: 'ผลงานของเรา', href: '/portfolio' },
  { label: 'บทความ', href: '/articles' },
  { label: 'ติดต่อเรา', href: '/contact' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { openQuote } = useQuote()
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/logo/logo.jpeg"
              alt="PROBAX Logo"
              width={140}
              height={50}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors relative pb-1 ${
                  pathname === link.href || (link.href === '/services' && pathname.startsWith('/services')) || (link.href === '/articles' && pathname.startsWith('/articles'))
                    ? 'text-[#0a1628] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#f97316]'
                    : 'text-gray-600 hover:text-[#0a1628]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <button
              onClick={openQuote}
              className="flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              ขอใบเสนอราคา
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-700"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block text-sm font-medium py-2 px-2 rounded ${
                  pathname === link.href ? 'text-[#f97316]' : 'text-gray-700 hover:text-[#0a1628]'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => { setMobileOpen(false); openQuote() }}
              className="flex items-center justify-center gap-2 bg-[#f97316] text-white text-sm font-semibold px-5 py-2.5 rounded-lg mt-2 w-full"
            >
              ขอใบเสนอราคา
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
