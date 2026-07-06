import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { connectDB } from '@/lib/mongoose'
import { HomeSettings, type IHomeSettings } from '@/models/HomeSettings'
import { Article, IArticle } from '@/models/Article'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CTABanner from '@/components/CTABanner'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://probax.co.th'
const OG_FALLBACK = `${SITE_URL}/cover/heroarticle.png`

interface Props {
  params: Promise<{ slug: string }>
}

async function getCta(): Promise<IHomeSettings['cta']> {
  let raw = await HomeSettings.findOne().lean()
  if (!raw) {
    const doc = new HomeSettings({})
    await doc.save()
    raw = doc.toObject()
  }
  return (JSON.parse(JSON.stringify(raw)) as unknown as IHomeSettings).cta
}

async function getArticle(slug: string): Promise<IArticle | null> {
  await connectDB()
  const isObjectId = /^[a-f\d]{24}$/i.test(slug)
  const doc = isObjectId
    ? await Article.findById(slug).lean()
    : await Article.findOne({ slug, published: true }).lean()
  return doc as IArticle | null
}

async function getRelated(category: string, currentId: string): Promise<IArticle[]> {
  return Article.find({ category, published: true, _id: { $ne: currentId } })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean() as Promise<IArticle[]>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'ไม่พบบทความ' }

  const title = article.metaTitle || article.title
  const description = article.metaDescription || article.excerpt
  const image = article.coverImage || OG_FALLBACK
  const canonical = `${SITE_URL}/articles/${article.slug}`

  return {
    title: `${title} | PROBAX`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'PROBAX',
      type: 'article',
      publishedTime: article.createdAt?.toString(),
      modifiedTime: article.updatedAt?.toString(),
      authors: [article.author],
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
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

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  // Increment views (fire-and-forget)
  Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } }).exec()

  const related = await getRelated(article.category, String(article._id))

  const publishDate = new Date(article.createdAt!).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage || OG_FALLBACK,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: 'PROBAX',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo/probax-logo.png` },
    },
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/articles/${article.slug}` },
    keywords: article.tags?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-white pt-16 md:pt-20">
        <Navbar />

        {/* Hero */}
        <div className="relative bg-[#0a1628] overflow-hidden">
          {article.coverImage && (
            <div className="absolute inset-0">
              <Image
                src={article.coverImage}
                alt={article.title}
                fill
                className="object-cover opacity-30"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/70 to-transparent" />
            </div>
          )}
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6" aria-label="breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">หน้าหลัก</Link>
              <span>/</span>
              <Link href="/articles" className="hover:text-white transition-colors">บทความ</Link>
              <span>/</span>
              <span className="text-gray-300 line-clamp-1">{article.title}</span>
            </nav>

            <span className={`inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-4 ${CAT_COLORS[article.category] ?? 'bg-blue-600'}`}>
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
              {article.title}
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              {article.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white text-xs font-bold">
                  {article.author?.[0] ?? 'P'}
                </div>
                <span className="text-gray-300 font-medium">{article.author}</span>
              </div>
              <span>·</span>
              <span>{publishDate}</span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                อ่าน {article.readTime} นาที
              </span>
              {article.views > 0 && (
                <>
                  <span>·</span>
                  <span>{article.views.toLocaleString()} ครั้ง</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">
            {/* Main content */}
            <article
              className="prose prose-lg max-w-none
                prose-headings:font-extrabold prose-headings:text-[#0a1628]
                prose-h2:text-2xl prose-h3:text-xl
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-[#1d4ed8] prose-a:no-underline hover:prose-a:underline
                prose-strong:text-[#0a1628]
                prose-blockquote:border-[#1d4ed8] prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:rounded-r-xl
                prose-img:rounded-2xl prose-img:shadow-md
                prose-ul:text-gray-600 prose-ol:text-gray-600
                prose-code:text-[#1d4ed8] prose-code:bg-blue-50 prose-code:px-1.5 prose-code:rounded
                prose-pre:bg-[#0a1628]"
              dangerouslySetInnerHTML={{ __html: article.content || '<p class="text-gray-400">ยังไม่มีเนื้อหา</p>' }}
            />

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-[#0a1628] mb-3">แท็ก</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-colors cursor-pointer">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#0a1628] mb-3">แชร์บทความ</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#1877F2] text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    Facebook
                  </a>
                  <a
                    href={`https://line.me/R/msg/text/?${encodeURIComponent(article.title)}%0A${SITE_URL}/articles/${article.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#00B900] text-white text-xs font-semibold px-3 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
                    Line
                  </a>
                </div>
              </div>

              {/* Related */}
              {related.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-[#0a1628] mb-3">บทความที่เกี่ยวข้อง</h3>
                  <div className="space-y-3">
                    {related.map((rel) => (
                      <Link
                        key={String(rel._id)}
                        href={`/articles/${rel.slug}`}
                        className="flex gap-3 group"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {rel.coverImage ? (
                            <Image src={rel.coverImage} alt={rel.title} width={64} height={64} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#0a1628] to-[#1d4ed8]" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#0a1628] leading-snug line-clamp-2 group-hover:text-[#1d4ed8] transition-colors">
                            {rel.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-1">{rel.readTime} นาที</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Back button */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d4ed8] hover:text-[#0a1628] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              กลับไปหน้าบทความ
            </Link>
          </div>
        </div>

        <CTABanner data={await getCta()} />
        <Footer />
      </main>
    </>
  )
}

export const dynamic = 'force-dynamic'
