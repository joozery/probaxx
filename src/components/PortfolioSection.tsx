import Image from 'next/image'
import Link from 'next/link'
import type { IServicesSettings } from '@/models/ServicesSettings'
import type { IPortfolioSettings } from '@/models/PortfolioSettings'

interface Props {
  sectionTitle: string
  clients: IServicesSettings['portfolio']['clients']
  gallery: Array<{ src: string; alt: string }>
  caseStudy: IPortfolioSettings['caseStudy']
}

export default function PortfolioSection({ sectionTitle, clients, gallery, caseStudy }: Props) {
  return (
    <section className="py-20 md:py-28 bg-[#f2f8fc] border-t border-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-[#1d4ed8] font-bold text-sm tracking-widest uppercase mb-2">OUR PORTFOLIO</h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628]">
            {sectionTitle}
          </h2>
          <div className="w-12 h-1 bg-[#1d4ed8] mx-auto mt-4" />
        </div>

        {/* 1. Client Logos */}
        <div className="mb-20">
          <h4 className="text-center text-gray-400 font-semibold mb-10 text-sm tracking-widest uppercase">ได้รับความไว้วางใจจากองค์กรชั้นนำ</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client, i) => (
              <div key={i} className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#f97316]/30 hover:shadow-md transition-all duration-300">
                {client.logo ? (
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white flex-shrink-0">
                    <Image
                      src={client.logo}
                      alt={client.name}
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center flex-shrink-0 group-hover:from-[#f97316] group-hover:to-[#ea6c0a] transition-all duration-300">
                    <span className="text-white font-black text-lg tracking-tight">{client.abbr}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-[#0a1628] font-semibold text-xs leading-tight mb-0.5">{client.name}</p>
                  <p className="text-gray-400 text-[10px]">{client.clientType}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Gallery Grid — ดึงจากหน้าผลงาน (/portfolio) */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#0a1628]">แกลเลอรี่ผลงาน</h3>
            <Link href="/portfolio" className="text-[#1d4ed8] font-semibold hover:underline">ดูทั้งหมด &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((item, i) => (
              <Link key={i} href="/portfolio" className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm block">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-center px-4 drop-shadow-md">{item.alt}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. Case Study — ดึงจากหน้าผลงาน (/portfolio) */}
        <div>
          <h3 className="text-2xl font-bold text-[#0a1628] mb-8">กรณีศึกษา (Case Study)</h3>
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50 flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[300px]">
              <Image
                src={caseStudy.image}
                alt={caseStudy.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1d4ed8] font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                {caseStudy.label}
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h4 className="text-2xl font-extrabold text-[#0a1628] mb-4 whitespace-pre-line">
                {caseStudy.title}
              </h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                {caseStudy.description}
              </p>

              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{caseStudy.stat1Label}</p>
                  <p className="font-bold text-[#0a1628]">{caseStudy.stat1Value}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{caseStudy.stat2Label}</p>
                  <p className="font-bold text-[#34d399]">{caseStudy.stat2Value}</p>
                </div>
              </div>

              <Link href="/portfolio" className="self-start px-6 py-3 bg-[#0a1628] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
                ดูผลงานทั้งหมด
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
