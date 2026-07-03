'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useQuote } from '@/context/QuoteContext'

const features = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: 'ปลอดภัย',
    sub: 'ทีมงานมืออาชีพ',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    label: 'ได้มาตรฐาน',
    sub: 'มาตรฐานสากล',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    label: 'ใส่ใจทุกขั้นตอน',
    sub: 'บริการด้วยใจ',
  },
]

export default function CTABanner() {
  const { openQuote } = useQuote()
  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Background Image */}
      <Image
        src="/cover/ctabg.png"
        alt="CTA background"
        fill
        sizes="100vw"
        className="object-cover object-right"
      />
      {/* Overlay: white fade from left */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />

      {/* Main CTA */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a1628] leading-[1.3] mb-4 pb-2">
              ให้เราดูแล<br />
              <span className="text-[#f97316]">ระบบน้ำ</span>ของคุณ
            </h2>
            <p className="text-gray-600 text-base mb-10">
              สะอาด ปลอดภัย ได้มาตรฐาน ใส่ใจทุกรายละเอียด
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-6">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-[#f97316] flex-shrink-0">
                    {f.icon}
                  </div>
                  <div>
                    <p className="text-[#0a1628] font-semibold text-sm leading-tight">{f.label}</p>
                    <p className="text-gray-500 text-xs">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-start lg:items-end gap-6">
            <button
              onClick={openQuote}
              className="inline-flex items-center gap-3 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold text-lg px-10 py-4 rounded-full transition-all hover:scale-105 shadow-xl shadow-orange-200 whitespace-nowrap"
            >
              ขอใบเสนอราคา
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <a href="tel:0611234567" className="flex items-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center text-[#0a1628] group-hover:border-[#f97316] transition-colors flex-shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
              </div>
              <div>
                <p className="text-[#0a1628] font-extrabold text-2xl leading-tight">061-123-4567</p>
                <p className="text-gray-500 text-sm">จันทร์ - เสาร์ 08.00 - 17.00 น.</p>
              </div>
            </a>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 border-t border-gray-200 bg-white/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#0a1628]/10 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-[#0a1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-600 text-sm">พร้อมให้บริการ ทุกวัน</p>
                <p className="text-[#0a1628] font-extrabold text-lg leading-tight">08.00 – 18.00 น.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="tel:0855564994"
                className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                085-556-4994
              </a>
              <a
                href="https://line.me/ti/p/~@probax"
                className="inline-flex items-center gap-2 bg-[#06C755] hover:bg-[#05a847] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-all hover:scale-105"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.952 11.166C19.952 6.667 15.523 3 10.025 3 4.527 3 .098 6.667.098 11.166c0 4.034 3.576 7.415 8.406 8.059.327.071.773.216.886.497.101.255.066.655.032.913l-.143.859c-.044.255-.203 1.002.877.547 1.08-.455 5.833-3.437 7.957-5.88 1.468-1.611 2.839-3.616 2.839-5.995zm-13.01 2.985H5.18a.395.395 0 01-.395-.395V9.598a.395.395 0 01.79 0v3.763h1.367a.395.395 0 010 .79zm1.8 0a.395.395 0 01-.79 0V9.598a.395.395 0 01.79 0v4.553zm4.742 0a.394.394 0 01-.327-.174l-2.087-2.838v2.617a.395.395 0 01-.79 0V9.598a.394.394 0 01.716-.23l2.087 2.838V9.598a.395.395 0 01.79 0v4.553a.395.395 0 01-.39.395v.005zm3.145 0h-2.156a.395.395 0 01-.395-.395V9.598a.395.395 0 01.395-.395h2.156a.395.395 0 010 .79h-1.76v1.012h1.76a.395.395 0 010 .79h-1.76v1.056h1.76a.395.395 0 010 .79z" />
                </svg>
                LINE: @probax
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
