import Image from 'next/image'
import type { IServicesSettings } from '@/models/ServicesSettings'

const BENEFIT_ICONS = [
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="health">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="water">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="lifespan">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="savings">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
]

const SYMPTOM_ICONS = [
  (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="sediment">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="algae">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="bacteria">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  (
    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="rust">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
]

interface Props {
  data: IServicesSettings['why']
}

export default function WhyServiceSection({ data }: Props) {
  return (
    <section className="bg-[#f2f8fc] pt-20 pb-32 overflow-hidden relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.image || '/article/coversevice.png'}
          alt="Why Service Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient Overlay to fade the edges and make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-transparent to-white/60" />
        <div className="absolute inset-0 bg-white/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex flex-col justify-center min-h-[500px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* Left Text */}
          <div className="lg:w-[45%] xl:w-[40%] bg-white/40 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none p-6 lg:p-0 rounded-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] leading-tight mb-3">
              {data.title}<br />
              <span className="text-[#1d4ed8]">{data.titleBlue}</span>
            </h2>
            <p className="text-gray-600 font-medium text-sm lg:text-base leading-relaxed mb-8 pr-4">
              {data.description}
            </p>

            <div className="flex justify-between sm:justify-start sm:gap-6 w-full">
              {data.symptoms.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center max-w-[70px] sm:max-w-[80px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-blue-400 bg-white flex items-center justify-center text-[#1d4ed8] mb-3 shadow-md">
                    {SYMPTOM_ICONS[i] ?? SYMPTOM_ICONS[0]}
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 font-bold whitespace-pre-line leading-tight">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Benefits */}
          <div className="lg:w-[35%] xl:w-[30%] flex flex-col gap-6 lg:gap-8 bg-white/60 backdrop-blur-md p-6 lg:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
            {data.benefits.map((item, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="w-14 h-14 shrink-0 bg-white rounded-full flex items-center justify-center shadow-[0_4px_15px_-3px_rgba(29,78,216,0.15)] border-2 border-white text-[#1d4ed8]">
                  {BENEFIT_ICONS[i] ?? BENEFIT_ICONS[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-[#0a1628] text-base mb-1">{item.title}</h4>
                  <p className="text-gray-700 text-sm font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
