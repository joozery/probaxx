'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useQuote } from '@/context/QuoteContext'

const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: 'ปลอดภัย\nได้มาตรฐาน',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    label: 'ทีมงานมืออาชีพ\nประสบการณ์สูง',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    label: 'ตรวจสอบคุณภาพน้ำ\nก่อน-หลังล้าง',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    label: 'เป็นมิตรต่อสิ่งแวดล้อม\nใช้อุปกรณ์ปลอดภัย',
  },
]

export default function HeroSection() {
  const { openQuote } = useQuote()
  return (
    <section id="home" className="relative h-[80vh] flex items-center pt-16 md:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/cover/cover.png"
          alt="PROBAX Water Tank Cleaning"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay - dark on left, fade to transparent on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/70 to-[#0a1628]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 py-20 md:py-28">
        <div className="max-w-2xl">
          {/* Label */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-0.5 bg-[#f97316]" />
            <span className="text-[#f97316] text-sm font-semibold tracking-widest uppercase">
              Professional Service
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-5">
            PROFESSIONAL
            <br />
            WATER{' '}
            <span className="text-[#f97316]">TANK</span>
            <br />
            CLEANING
          </h1>

          {/* Subtitle */}
          <p className="text-white/80 text-base md:text-lg mb-8">
            ผู้เชี่ยวชาญงานล้างถังเก็บน้ำและถังบำบัดน้ำเสีย
          </p>

          {/* Feature Icons */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mb-10">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 text-center min-w-[72px]">
                <div className="text-white/90">{f.icon}</div>
                <p className="text-white/70 text-xs whitespace-pre-line leading-tight">{f.label}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={openQuote}
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-7 py-3.5 rounded-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              ขอใบเสนอราคา
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="inline-flex items-center gap-3 text-white font-medium hover:text-[#f97316] transition-colors group">
              <div className="w-11 h-11 rounded-full border-2 border-white/60 flex items-center justify-center group-hover:border-[#f97316] transition-colors">
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              ดูวิดีโอบริการ
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
