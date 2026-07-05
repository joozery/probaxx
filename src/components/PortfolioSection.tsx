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
    size: 'large',
  },
  {
    src: 'https://images.unsplash.com/photo-1533077162801-86490c593afb?q=80&w=800&auto=format&fit=crop',
    title: 'นิคมอุตสาหกรรมภาคใต้',
    category: 'โรงงานอุตสาหกรรม',
    tag: 'ระบบบำบัดน้ำ',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1541941392960-652036ca567e?q=80&w=800&auto=format&fit=crop',
    title: 'คอนโด ซีวิว ตรัง',
    category: 'คอนโดมิเนียม',
    tag: 'ติดตั้งระบบน้ำ',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1646488993053-8c182b628696?q=80&w=800&auto=format&fit=crop',
    title: 'โรงพยาบาลตรังรวมแพทย์',
    category: 'โรงพยาบาล',
    tag: 'ล้างถังน้ำ + บำบัด',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1538474705339-e87de81450e8?q=80&w=800&auto=format&fit=crop',
    title: 'เทศบาลนครตรัง',
    category: 'ราชการ',
    tag: 'ระบบประปา',
    size: 'small',
  },
  {
    src: 'https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=800&auto=format&fit=crop',
    title: 'ห้างโรบินสัน สาขาตรัง',
    category: 'โรงแรม & รีสอร์ท',
    tag: 'ทำความสะอาดระบบ',
    size: 'large',
  },
]

const stats = [
  { value: '500+', label: 'โครงการสำเร็จ' },
  { value: '10,000+', label: 'ลูกค้าพึงพอใจ' },
  { value: '15+', label: 'ปีประสบการณ์' },
  { value: '100%', label: 'มาตรฐานทุกงาน' },
]

export default function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')

  const filtered = activeCategory === 'ทั้งหมด'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#f97316]" />
            <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">Our Portfolio</span>
            <div className="w-6 h-0.5 bg-[#f97316]" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] mb-4">
            ผลงาน<span className="text-[#f97316]">ที่ผ่านมา</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
            เราภาคภูมิใจในทุกผลงานที่ได้รับความไว้วางใจจากลูกค้า<br />
            ทั้งองค์กรขนาดเล็กไปจนถึงอุตสาหกรรมขนาดใหญ่
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {stats.map((s, i) => (
            <div key={i} className="text-center py-6 px-4 rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] text-white">
              <p className="text-3xl md:text-4xl font-extrabold text-[#f97316] mb-1">{s.value}</p>
              <p className="text-xs text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-[#f97316] text-white shadow-md shadow-orange-200'
                  : 'bg-gray-100 text-gray-500 hover:bg-orange-50 hover:text-[#f97316]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer ${
                item.size === 'large' ? 'md:col-span-1 row-span-2 aspect-[4/5]' : 'aspect-square'
              }`}
            >
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />

              {/* Tag */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#f97316] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {item.tag}
                </span>
              </div>

              {/* Info on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 z-10">
                <p className="text-white font-bold text-sm leading-tight">{item.title}</p>
                <p className="text-white/70 text-xs mt-1">{item.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study CTA */}
        <div className="mt-16 rounded-3xl overflow-hidden relative bg-[#0a1628]">
          <div className="absolute inset-0 opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=1400&auto=format&fit=crop"
              alt="case study background"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 px-8 py-10 md:px-12">
            <div>
              <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">Featured Case Study</span>
              <h3 className="text-white text-2xl md:text-3xl font-extrabold mt-2 mb-2">
                โครงการล้างถังน้ำ<br />นิคมอุตสาหกรรมภาคใต้
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                ถังขนาด 100,000 ลิตร สะอาดใสใน 2 วัน ด้วยทีม PROBAX
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-[#f97316]">2 วัน</p>
                <p className="text-white/50 text-xs">ระยะเวลา</p>
              </div>
              <div className="hidden sm:block w-px bg-white/20 mx-4" />
              <div className="text-center">
                <p className="text-3xl font-extrabold text-emerald-400">100%</p>
                <p className="text-white/50 text-xs">น้ำใสสะอาด</p>
              </div>
              <div className="hidden sm:block w-px bg-white/20 mx-4" />
              <button className="self-center mt-2 sm:mt-0 px-6 py-3 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap">
                อ่านเพิ่มเติม →
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
