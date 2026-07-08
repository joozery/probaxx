import Image from 'next/image'
import type { IServicesSettings } from '@/models/ServicesSettings'

const ICONS = [
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="shield">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="team">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="check">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
]

interface Props {
  data: IServicesSettings['hero']
}

export default function ServicesHero({ data }: Props) {
  return (
    <div className="relative pt-36 md:pt-48 pb-24 md:pb-32 overflow-hidden bg-[#001b3a]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.image || '/cover/coverherosr.png'}
          alt="Water Tank Cleaning Service"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Very subtle gradient overlay just for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#001b3a]/80 via-[#001b3a]/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">

          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#001b3a] ml-0.5" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
            </div>
            <span className="text-white text-xs font-bold tracking-widest uppercase">
              OUR SERVICES
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-3" style={{ color: data.titleColor || '#ffffff' }}>
            {data.title}
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6" style={{ color: data.subtitleColor || '#38bdf8' }}>
            {data.subtitle}
          </h2>

          {/* Description */}
          <p className="text-base md:text-lg leading-relaxed mb-10 max-w-xl" style={{ color: data.descriptionColor || '#d1d5db' }}>
            {data.description}
          </p>

          {/* Features Horizontal List */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 mb-10">
            {data.features.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full border border-white/30 flex items-center justify-center text-[#38bdf8]">
                  {ICONS[i] ?? ICONS[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-tight mb-0.5">{item.title}</h4>
                  <p className="text-gray-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}
