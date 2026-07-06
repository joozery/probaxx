import Image from 'next/image'
import type { IHomeSettings } from '@/models/HomeSettings'

const cardStyles = [
  {
    color: '#4a5568',
    numberBg: 'bg-[#4a5568]',
    titleColor: 'text-[#0a1628]',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
      </svg>
    ),
  },
  {
    color: '#f97316',
    numberBg: 'bg-[#f97316]',
    titleColor: 'text-[#f97316]',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73.71.71M3 12H2m20 0h-1M4.22 19.78l.71-.71M18.36 5.64l.71-.71" />
        <circle cx="12" cy="12" r="4" strokeWidth={1.5} />
      </svg>
    ),
  },
  {
    color: '#0d9488',
    numberBg: 'bg-[#0d9488]',
    titleColor: 'text-[#0d9488]',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 12h12M6 8h12M6 16h12M3 6h.01M3 12h.01M3 18h.01" />
      </svg>
    ),
  },
  {
    color: '#7c3aed',
    numberBg: 'bg-[#7c3aed]',
    titleColor: 'text-[#7c3aed]',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
]

export default function SymptomsSection({ data }: { data: IHomeSettings['symptoms'] }) {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-[#f0f6ff]">
      {/* Background water bubbles decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-20 top-10 w-80 h-80 rounded-full border-2 border-blue-200/40" />
        <div className="absolute -right-10 top-24 w-56 h-56 rounded-full border-2 border-blue-200/30" />
        <div className="absolute right-10 top-40 w-32 h-32 rounded-full border-2 border-blue-200/20" />
        <div className="absolute -left-10 bottom-20 w-48 h-48 rounded-full border border-blue-200/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
          
          {/* Left: Heading */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <div className="w-5 h-0.5 bg-[#f97316]" />
                <div className="w-2 h-0.5 bg-[#f97316]" />
              </div>
              <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">{data.badge}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a1628] leading-[1.2] mb-4">
              {data.title1}<br />
              <span className="text-[#f97316]">{data.titleOrange}</span>{data.title3}
            </h2>
            <p className="text-gray-500 text-base max-w-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Right: Info Card */}
          <div className="lg:max-w-xs w-full">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#f97316] flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-200">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-[#0a1628] text-sm mb-1.5">{data.infoTitle}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {data.infoDesc}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {data.items.map((item, i) => {
            const style = cardStyles[i % cardStyles.length]
            return (
            <div key={i} className="group bg-white rounded-3xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
              {/* Image — overflow-hidden scoped here only */}
              <div className="relative h-52 overflow-hidden rounded-t-3xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                {/* Number Badge — flush corner */}
                <div className={`absolute top-0 left-0 ${style.numberBg} text-white font-black text-sm w-10 h-10 rounded-tl-3xl rounded-br-2xl flex items-center justify-center shadow-md`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>

              {/* Icon circle — overlaps image boundary */}
              <div className="flex justify-center -mt-8 relative z-10 mb-3">
                <div
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg border-[3px]"
                  style={{ borderColor: style.color }}
                >
                  <span style={{ color: style.color }} className="[&>svg]:w-8 [&>svg]:h-8">
                    {style.icon}
                  </span>
                </div>
              </div>

              {/* Text content */}
              <div className="px-5 pb-7 text-center">
                <h3 className={`font-extrabold text-lg mb-2 leading-tight ${style.titleColor}`}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{item.desc}</p>
              </div>
            </div>
            )
          })}
        </div>



      </div>
    </section>
  )
}
