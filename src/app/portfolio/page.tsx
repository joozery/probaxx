import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuoteModal from '@/components/QuoteModal'
import { QuoteProvider } from '@/context/QuoteContext'
import PortfolioClient from './PortfolioClient'
import { connectDB } from '@/lib/mongoose'
import { PortfolioSettings, type IPortfolioSettings } from '@/models/PortfolioSettings'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ผลงานของเรา | PROBAX',
  description: 'ผลงานการล้างถังเก็บน้ำ ติดตั้งระบบน้ำ และบำบัดน้ำเสียจาก PROBAX กว่า 500 โครงการทั่วภาคใต้',
}

export default async function PortfolioPage() {
  await connectDB()
  let raw = await PortfolioSettings.findOne().lean()
  if (!raw) {
    const doc = new PortfolioSettings({})
    await doc.save()
    raw = doc.toObject()
  }
  const s = JSON.parse(JSON.stringify(raw)) as unknown as IPortfolioSettings

  return (
    <QuoteProvider>
      <main className="min-h-screen bg-white">
        <Navbar />
        <QuoteModal />

        {/* Hero */}
        <section className="relative pt-28 pb-20 bg-[#0a1628] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#f97316]/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#f97316]" />
              <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">{s.hero.badge}</span>
              <div className="w-6 h-0.5 bg-[#f97316]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              {s.hero.title}<span className="text-[#f97316]">{s.hero.titleOrange}</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed whitespace-pre-line">
              {s.hero.description}
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {s.stats.map((stat, i) => (
                <div key={i} className="text-center py-10 px-6">
                  <p className="text-3xl md:text-4xl font-extrabold text-[#f97316] mb-1">{stat.value}</p>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Portfolio Grid (Client Component) */}
        <PortfolioClient items={s.items} />

        {/* Case Study CTA */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl overflow-hidden relative bg-[#0a1628]">
              <div className="absolute inset-0 opacity-20">
                <Image
                  src={s.caseStudy.image}
                  alt="case study"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-12 md:px-14">
                <div>
                  <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">{s.caseStudy.label}</span>
                  <h3 className="text-white text-2xl md:text-3xl font-extrabold mt-2 mb-3 whitespace-pre-line">
                    {s.caseStudy.title}
                  </h3>
                  <p className="text-white/60 text-sm max-w-md">
                    {s.caseStudy.description}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-[#f97316]">{s.caseStudy.stat1Value}</p>
                    <p className="text-white/50 text-xs mt-1">{s.caseStudy.stat1Label}</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-emerald-400">{s.caseStudy.stat2Value}</p>
                    <p className="text-white/50 text-xs mt-1">{s.caseStudy.stat2Label}</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/20" />
                  <button className="px-7 py-3 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap shadow-lg shadow-orange-900/30">
                    อ่านเพิ่มเติม →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </QuoteProvider>
  )
}
