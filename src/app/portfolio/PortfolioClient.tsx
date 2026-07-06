'use client'
import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'

export interface PortfolioItem {
  src: string
  images?: string[]
  title: string
  category: string
  tag: string
  desc: string
}

function galleryOf(item: PortfolioItem): string[] {
  const all = [item.src, ...(item.images ?? [])].filter(Boolean)
  return all.length > 0 ? Array.from(new Set(all)) : []
}

export default function PortfolioClient({ items }: { items: PortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [imgIndex, setImgIndex] = useState(0)

  const categories = ['ทั้งหมด', ...Array.from(new Set(items.map(p => p.category).filter(Boolean)))]

  const filtered = activeCategory === 'ทั้งหมด'
    ? items
    : items.filter(p => p.category === activeCategory)

  const current = lightboxIndex !== null ? filtered[lightboxIndex] : null
  const gallery = current ? galleryOf(current) : []

  const close = useCallback(() => { setLightboxIndex(null); setImgIndex(0) }, [])
  const prev = useCallback(() => {
    setImgIndex(i => gallery.length === 0 ? 0 : (i - 1 + gallery.length) % gallery.length)
  }, [gallery.length])
  const next = useCallback(() => {
    setImgIndex(i => gallery.length === 0 ? 0 : (i + 1) % gallery.length)
  }, [gallery.length])

  // keyboard navigation + scroll lock
  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, close, prev, next])

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setLightboxIndex(null) }}
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
            <button
              key={i}
              onClick={() => { setLightboxIndex(i); setImgIndex(0) }}
              className="group text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer hover:-translate-y-1"
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
                {/* zoom hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-[#0a1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m-3-3h6" />
                    </svg>
                  </div>
                </div>
                <span className="absolute top-3 left-3 bg-[#f97316] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  {item.tag}
                </span>
                <span className="absolute top-3 right-3 bg-white/90 text-[#0a1628] text-[11px] font-semibold px-3 py-1 rounded-full">
                  {item.category}
                </span>
                {galleryOf(item).length > 1 && (
                  <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 bg-black/60 backdrop-blur text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {galleryOf(item).length} รูป
                  </span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-[#0a1628] text-base mb-2 group-hover:text-[#f97316] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.desc}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">PROBAX Services</span>
                  <span className="text-[#f97316] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    ดูรูปภาพ
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </button>
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

      {/* ── Lightbox ── */}
      {current && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200"
          onClick={close}
        >
          {/* close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="ปิด"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* counter */}
          <div className="absolute top-6 left-6 z-20 text-white/60 text-sm font-medium">
            {imgIndex + 1} / {gallery.length}
          </div>

          {/* prev */}
          {gallery.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-3 md:left-6 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-[#f97316] text-white flex items-center justify-center transition-colors"
              aria-label="รูปก่อนหน้า"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* next */}
          {gallery.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-3 md:right-6 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-[#f97316] text-white flex items-center justify-center transition-colors"
              aria-label="รูปถัดไป"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* image + caption */}
          <div
            className="relative w-full max-w-5xl mx-4 md:mx-16 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-[55vh] md:h-[70vh] rounded-2xl overflow-hidden bg-black">
              <Image
                key={gallery[imgIndex]}
                src={gallery[imgIndex].replace('w=800', 'w=1600')}
                alt={current.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain animate-in fade-in zoom-in-95 duration-300"
                priority
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-1">
              <span className="self-start bg-[#f97316] text-white text-[11px] font-bold px-3 py-1 rounded-full shrink-0">
                {current.tag}
              </span>
              <div className="min-w-0">
                <h3 className="text-white font-bold text-base md:text-lg leading-tight">{current.title}</h3>
                <p className="text-white/60 text-sm mt-0.5">{current.desc}</p>
              </div>
            </div>

            {/* thumbnail strip — รูปทั้งหมดของโปรเจกต์นี้ */}
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {gallery.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`relative w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden shrink-0 transition-all ${
                      i === imgIndex
                        ? 'ring-2 ring-[#f97316] opacity-100'
                        : 'opacity-40 hover:opacity-80'
                    }`}
                  >
                    <Image src={src} alt={`${current.title} ${i + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
