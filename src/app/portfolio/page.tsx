'use client'
import Image from 'next/image'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import QuoteModal from '@/components/QuoteModal'
import { QuoteProvider } from '@/context/QuoteContext'

const categories = ['ทั้งหมด', 'โรงแรม & รีสอร์ท', 'โรงงานอุตสาหกรรม', 'คอนโดมิเนียม', 'โรงพยาบาล', 'ราชการ']

const portfolioItems = [
  {
    src: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?q=80&w=800&auto=format&fit=crop',
    title: 'โรงแรมทวินโลตัส นครศรีฯ',
    category: 'โรงแรม & รีสอร์ท',
    tag: 'ล้างถังเก็บน้ำ',
    desc: 'ล้างถังเก็บน้ำขนาด 50,000 ลิตร พร้อมตรวจสอบคุณภาพน้ำหลังการทำความสะอาด',
  },
  {
    src: 'https://images.unsplash.com/photo-1533077162801-86490c593afb?q=80&w=800&auto=format&fit=crop',
    title: 'นิคมอุตสาหกรรมภาคใต้',
    category: 'โรงงานอุตสาหกรรม',
    tag: 'ระบบบำบัดน้ำ',
    desc: 'ติดตั้งและดูแลระบบบำบัดน้ำเสียสำหรับโรงงานอุตสาหกรรมขนาดใหญ่',
  },
  {
    src: 'https://images.unsplash.com/photo-1541941392960-652036ca567e?q=80&w=800&auto=format&fit=crop',
    title: 'คอนโด ซีวิว ตรัง',
    category: 'คอนโดมิเนียม',
    tag: 'ติดตั้งระบบน้ำ',
    desc: 'วางระบบท่อน้ำและติดตั้งถังเก็บน้ำสำรองสำหรับอาคารสูง 20 ชั้น',
  },
  {
    src: 'https://images.unsplash.com/photo-1646488993053-8c182b628696?q=80&w=800&auto=format&fit=crop',
    title: 'โรงพยาบาลตรังรวมแพทย์',
    category: 'โรงพยาบาล',
    tag: 'ล้างถังน้ำ + บำบัด',
    desc: 'ทำความสะอาดระบบน้ำทั้งหมดตามมาตรฐาน สาธารณสุข เพื่อความปลอดภัยของผู้ป่วย',
  },
  {
    src: 'https://images.unsplash.com/photo-1538474705339-e87de81450e8?q=80&w=800&auto=format&fit=crop',
    title: 'เทศบาลนครตรัง',
    category: 'ราชการ',
    tag: 'ระบบประปา',
    desc: 'ดูแลและซ่อมบำรุงระบบประปาชุมชน ครอบคลุมพื้นที่กว่า 3,000 ครัวเรือน',
  },
  {
    src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop',
    title: 'ห้างโรบินสัน สาขาตรัง',
    category: 'โรงแรม & รีสอร์ท',
    tag: 'ทำความสะอาดระบบ',
    desc: 'บำรุงรักษาระบบน้ำหล่อเย็นและตรวจสอบคุณภาพน้ำประจำปี',
  },
  {
    src: 'https://images.unsplash.com/photo-1593260654732-df52bea15d63?q=80&w=800&auto=format&fit=crop',
    title: 'โรงงานอาหารแช่แข็ง ตรัง',
    category: 'โรงงานอุตสาหกรรม',
    tag: 'ระบบน้ำอุตสาหกรรม',
    desc: 'ดูแลระบบน้ำสำหรับกระบวนการผลิตอาหาร ตามมาตรฐาน GMP และ HACCP',
  },
  {
    src: 'https://images.unsplash.com/photo-1639600993675-2281b2c939f0?q=80&w=800&auto=format&fit=crop',
    title: 'คอนโดมิเนียม ลากูน่า',
    category: 'คอนโดมิเนียม',
    tag: 'ล้างถังเก็บน้ำ',
    desc: 'บริการล้างถังน้ำครบวงจร พร้อมออกใบรับรองคุณภาพน้ำ',
  },
  {
    src: 'https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=800&auto=format&fit=crop',
    title: 'โรงพยาบาลส่งเสริมสุขภาพ',
    category: 'โรงพยาบาล',
    tag: 'บำบัดน้ำเสีย',
    desc: 'ติดตั้งระบบบำบัดน้ำเสียครบวงจร พร้อมระบบตรวจสอบอัตโนมัติ',
  },
]

const stats = [
  { value: '500+', label: 'โครงการสำเร็จ', icon: '🏆' },
  { value: '10,000+', label: 'ลูกค้าพึงพอใจ', icon: '😊' },
  { value: '15+', label: 'ปีประสบการณ์', icon: '📅' },
  { value: '100%', label: 'มาตรฐานทุกงาน', icon: '✅' },
]

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [hovered, setHovered] = useState<number | null>(null)

  const filtered = activeCategory === 'ทั้งหมด'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === activeCategory)

  return (
    <QuoteProvider>
      <main className="min-h-screen bg-white">
        <Navbar />
        <QuoteModal />

        {/* Hero Section */}
        <section className="relative pt-28 pb-20 bg-[#0a1628] overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#f97316]/5 -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-blue-500/5 translate-y-1/2 -translate-x-1/4" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-6 h-0.5 bg-[#f97316]" />
              <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">Our Portfolio</span>
              <div className="w-6 h-0.5 bg-[#f97316]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight">
              ผลงาน<span className="text-[#f97316]">ของเรา</span>
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
              เราภาคภูมิใจในทุกผลงานที่ได้รับความไว้วางใจ<br />
              จากลูกค้าทั่วภาคใต้กว่า 500 โครงการ
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
              {stats.map((s, i) => (
                <div key={i} className="text-center py-10 px-6">
                  <p className="text-3xl md:text-4xl font-extrabold text-[#f97316] mb-1">{s.value}</p>
                  <p className="text-gray-500 text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    activeCategory === cat
                      ? 'bg-[#f97316] text-white shadow-md shadow-orange-200'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-[#f97316] hover:text-[#f97316]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400 border border-gray-100 cursor-pointer"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-[#f97316] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                      {item.tag}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 text-[#0a1628] text-[11px] font-semibold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="font-bold text-[#0a1628] text-base mb-2 group-hover:text-[#f97316] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.desc}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-400 font-medium">PROBAX Services</span>
                      <span className="text-[#f97316] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        ดูรายละเอียด
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-lg font-medium">ไม่พบผลงานในหมวดนี้</p>
              </div>
            )}
          </div>
        </section>

        {/* Case Study CTA */}
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl overflow-hidden relative bg-[#0a1628]">
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=1400&auto=format&fit=crop"
                  alt="case study"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 py-12 md:px-14">
                <div>
                  <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">Featured Case Study</span>
                  <h3 className="text-white text-2xl md:text-3xl font-extrabold mt-2 mb-3">
                    โครงการล้างถังน้ำ<br />นิคมอุตสาหกรรมภาคใต้
                  </h3>
                  <p className="text-white/60 text-sm max-w-md">
                    ถังขนาด 100,000 ลิตร พบคราบสนิมและตะกอนหนา PROBAX เข้าแก้ไขสำเร็จใน 2 วัน
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-[#f97316]">2 วัน</p>
                    <p className="text-white/50 text-xs mt-1">ระยะเวลา</p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-white/20" />
                  <div className="text-center">
                    <p className="text-4xl font-extrabold text-emerald-400">100%</p>
                    <p className="text-white/50 text-xs mt-1">น้ำใสสะอาด</p>
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
