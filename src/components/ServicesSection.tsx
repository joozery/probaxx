import Image from 'next/image'
import type { IServicesSettings } from '@/models/ServicesSettings'

const SERVICE_ICONS = [
  (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="tank">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 7v12a2 2 0 002 2h12a2 2 0 002-2V7M4 7V5a2 2 0 012-2h12a2 2 0 012 2v2M9 14h6" />
    </svg>
  ),
  (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="wastewater-tank">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="system">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014-8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 00-1.014-5.395m0 0l-.657-.38c-.551-.318-1.26-.117-1.527.461a20.845 20.845 0 00-1.44 4.282" />
    </svg>
  ),
  (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" key="operator">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
]

interface Props {
  data: IServicesSettings['services']
}

export default function ServicesSection({ data }: Props) {
  return (
    <section className="py-16 md:py-24 bg-[#f2f8fc]" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-[#1d4ed8] font-bold text-sm tracking-widest uppercase mb-2">OUR SERVICES</h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628]">
            {data.sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[#1d4ed8] mx-auto mt-4" />
        </div>

        {/* Services Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {data.items.map((srv, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-50/50 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden rounded-t-2xl">
                <Image
                  src={srv.image || '/article/service_tank_cleaning.png'}
                  alt={srv.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Overlapping Blue Icon */}
              <div className="flex justify-start px-8 -mt-8 relative z-10 mb-2">
                <div className="w-16 h-16 bg-[#1d4ed8] text-white rounded-full flex items-center justify-center shadow-lg border-[3px] border-white">
                  <span className="[&>svg]:w-7 [&>svg]:h-7">
                    {SERVICE_ICONS[i] ?? SERVICE_ICONS[0]}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <div className="px-8 pb-8 flex-1">
                <h3 className="text-lg font-bold text-[#0a1628] mb-3 leading-tight">{srv.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {srv.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
