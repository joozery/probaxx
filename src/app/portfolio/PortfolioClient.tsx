'use client'
import Image from 'next/image'
import { useState } from 'react'

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
    desc: 'ทำความสะอาดระบบน้ำทั้งหมดตามมาตรฐานสาธารณสุข เพื่อความปลอดภัยของผู้ป่วย',
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

export default function PortfolioClient() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')

  const filtered = activeCategory === 'ทั้งหมด'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === activeCategory)

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filter Tabs */}
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
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer hover:-translate-y-1"
            >
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
  )
}
