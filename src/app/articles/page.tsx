import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { connectDB } from '@/lib/mongoose'
import { Article, IArticle } from '@/models/Article'
import { PageSettings } from '@/models/PageSettings'

export const metadata: Metadata = {
  title: 'บทความ & ข่าวสาร | PROBAX',
  description: 'รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้',
  openGraph: {
    title: 'บทความ & ข่าวสาร | PROBAX',
    description: 'รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้',
    type: 'website',
  },
}

const CAT_COLORS: Record<string, string> = {
  'ความรู้ทั่วไป': 'bg-blue-600',
  'เคล็ดลับ': 'bg-green-600',
  'กฎหมาย & มาตรฐาน': 'bg-red-600',
  'เทคนิค': 'bg-purple-600',
  'คู่มือผู้ใช้': 'bg-orange-500',
  'ราคา & โปรโมชัน': 'bg-yellow-500',
  'ความรู้เรื่องน้ำ': 'bg-blue-600',
  'สุขภาพ & ความปลอดภัย': 'bg-orange-500',
  'เคล็ดลับดูแลบ้าน': 'bg-teal-500',
}

const CATEGORIES = ['ทั้งหมด', 'ความรู้ทั่วไป', 'เคล็ดลับ', 'กฎหมาย & มาตรฐาน', 'เทคนิค', 'คู่มือผู้ใช้', 'ราคา & โปรโมชัน']

interface Props {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ArticlesPage({ searchParams }: Props) {
  const { category, page: pageStr } = await searchParams
  const currentPage = parseInt(pageStr ?? '1')
  const limit = 9

  await connectDB()

  const filter: Record<string, unknown> = { published: true }
  if (category && category !== 'all' && category !== 'ทั้งหมด') {
    filter.category = category
  }

  const skip = (currentPage - 1) * limit
  const [rawArticles, total, heroRaw] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
    PageSettings.findOne({ page: 'articles' }).lean(),
  ])

  const hero = heroRaw ?? {
    heroTitle: 'บทความ & ข่าวสาร',
    heroDescription: 'รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้',
    heroImage: '/cover/heroarticle.png',
    heroOverlay: 40,
  }

  const articles = rawArticles as IArticle[]
  const totalPages = Math.ceil(total / limit)

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section — about-style left-aligned */}
      {(() => {
        const h = hero as { heroTitle: string; heroDescription: string; heroImage: string; heroOverlay: number }
        const ov = (h.heroOverlay ?? 40) / 100
        return (
          <div className="relative pt-36 md:pt-48 pb-24 md:pb-32 overflow-hidden bg-[#001b3a]">
            <div className="absolute inset-0 z-0">
              {h.heroImage && (
                <Image
                  src={h.heroImage}
                  alt={h.heroTitle}
                  fill
                  className="object-cover object-center"
                  priority
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(to right, rgba(0,27,58,${Math.min(ov + 0.5, 1)}) 0%, rgba(0,27,58,${Math.min(ov + 0.3, 0.9)}) 40%, rgba(0,27,58,${Math.max(ov - 0.1, 0.15)}) 100%)`
                }}
              />
            </div>
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#001b3a] ml-0.5" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
                  </div>
                  <span className="text-white text-xs font-bold tracking-widest uppercase">PRO BAX · บทความ</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
                  {h.heroTitle || 'บทความ & ข่าวสาร'}
                </h1>
                <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                  {h.heroDescription}
                </p>
              </div>
            </div>
          </div>
        )
      })()}

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-3 mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = (!category && cat === 'ทั้งหมด') || category === cat
              return (
                <Link
                  key={cat}
                  href={cat === 'ทั้งหมด' ? '/articles' : `/articles?category=${encodeURIComponent(cat)}`}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
                    isActive
                      ? 'bg-[#0a1628] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#0a1628] hover:text-[#0a1628]'
                  }`}
                >
                  {cat}
                </Link>
              )
            })}
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-lg">ยังไม่มีบทความในหมวดนี้</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {articles.map((article) => (
                  <Link
                    key={String(article._id)}
                    href={`/articles/${article.slug}`}
                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 shrink-0">
                      {article.coverImage ? (
                        <Image
                          src={article.coverImage}
                          alt={article.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#0a1628] to-[#1d4ed8] flex items-center justify-center">
                          <svg className="w-10 h-10 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {/* bottom gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      {/* category badge bottom-left */}
                      <span className={`absolute bottom-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ${CAT_COLORS[article.category] ?? 'bg-blue-600'}`}>
                        {article.category}
                      </span>
                      {/* read time badge bottom-right */}
                      <span className="absolute bottom-3 right-3 flex items-center gap-1 text-white/80 text-[10px] font-medium">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readTime} นาที
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-4">
                      <h2 className="font-bold text-[#0a1628] text-sm leading-snug mb-2 line-clamp-2 group-hover:text-[#1d4ed8] transition-colors duration-200">
                        {article.title}
                      </h2>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 flex-1 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-[10px] text-gray-400">
                          {new Date(article.createdAt!).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1d4ed8] translate-x-0 group-hover:translate-x-0.5 transition-transform">
                          อ่านต่อ
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  {currentPage > 1 && (
                    <Link
                      href={`/articles?${category ? `category=${encodeURIComponent(category)}&` : ''}page=${currentPage - 1}`}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/articles?${category ? `category=${encodeURIComponent(category)}&` : ''}page=${p}`}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                        p === currentPage
                          ? 'bg-[#1d4ed8] text-white shadow-md shadow-blue-200'
                          : 'border border-gray-200 text-gray-600 hover:border-[#1d4ed8] hover:text-[#1d4ed8]'
                      }`}
                    >
                      {p}
                    </Link>
                  ))}
                  {currentPage < totalPages && (
                    <Link
                      href={`/articles?${category ? `category=${encodeURIComponent(category)}&` : ''}page=${currentPage + 1}`}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  )
}
