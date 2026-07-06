import Image from 'next/image'
import type { IHomeSettings } from '@/models/HomeSettings'

const cardIcons = [
  (
    <svg key="0" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  ),
  (
    <svg key="1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  (
    <svg key="2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
  ),
  (
    <svg key="3" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
]

export default function WhySection({ data }: { data: IHomeSettings['why'] }) {
  return (
    <section id="about" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={data.image}
          alt="Why Clean Water Tank"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            {/* Label */}
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-0.5 bg-[#f97316]" />
              <span className="text-[#f97316] text-sm font-semibold tracking-widest uppercase">
                {data.badge}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] leading-tight mb-4">
              {data.title1}<br />
              <span className="text-[#f97316]">{data.titleOrange}</span><br />
              {data.title3}
            </h2>

            <p className="text-gray-600 text-base leading-relaxed mb-8 max-w-md">
              {data.description}
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              {data.stats.map((stat, i) => (
                <div key={i} className="flex gap-8">
                  {i > 0 && <div className="w-px bg-gray-200" />}
                  <div>
                    <p className="text-3xl font-extrabold text-[#f97316]">{stat.value}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Cards */}
          <div className="grid grid-cols-2 gap-4">
            {data.cards.map((item, i) => (
              <div
                key={i}
                className="group relative flex flex-col p-6 rounded-2xl border border-white/70 bg-white/70 backdrop-blur-sm hover:border-[#f97316]/50 hover:bg-white/90 hover:shadow-xl hover:shadow-blue-100/60 transition-all duration-300"
              >
                {/* Number badge */}
                <span className="absolute top-4 right-4 text-[#0a1628]/10 font-extrabold text-3xl leading-none select-none">
                  0{i + 1}
                </span>

                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#0a1628]/8 group-hover:bg-[#f97316]/15 flex items-center justify-center mb-4 transition-colors text-[#0a1628] group-hover:text-[#f97316]">
                  {cardIcons[i % cardIcons.length]}
                </div>

                <h3 className="text-[#0a1628] font-bold text-base mb-1.5">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>
  )
}
