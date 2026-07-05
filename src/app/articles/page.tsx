import PageHero from '@/components/PageHero'
import Image from 'next/image'
import Link from 'next/link'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

const allArticles = [
  {
    id: 1,
    image: '/article/01.png',
    category: 'ความรู้เรื่องน้ำ',
    categoryColor: 'bg-blue-600',
    title: 'ทำไมต้องล้างถังเก็บน้ำทุก 6 เดือน?',
    excerpt: 'ถังเก็บน้ำที่ไม่ได้รับการดูแลจะสะสมตะกอน ตะไคร่น้ำ และแบคทีเรีย ซึ่งส่งผลโดยตรงต่อสุขภาพของคุณและคนในครอบครัว',
    date: '12 มิ.ย. 2568',
    readTime: '3 นาที',
    accentColor: 'text-blue-600',
    borderHover: 'hover:border-blue-200',
  },
  {
    id: 2,
    image: '/article/02.png',
    category: 'สุขภาพ & ความปลอดภัย',
    categoryColor: 'bg-orange-500',
    title: 'สัญญาณเตือน! น้ำในบ้านคุณอาจไม่สะอาด',
    excerpt: 'กลิ่นแปลก สีขุ่น หรือตะกอนในน้ำ คือสัญญาณอันตราย บทความนี้จะช่วยให้คุณสังเกตและรับมือได้ทันท่วงที',
    date: '28 พ.ค. 2568',
    readTime: '4 นาที',
    accentColor: 'text-orange-500',
    borderHover: 'hover:border-orange-200',
  },
  {
    id: 3,
    image: '/article/03.png',
    category: 'เคล็ดลับดูแลบ้าน',
    categoryColor: 'bg-teal-500',
    title: 'วิธีดูแลถังเก็บน้ำระหว่างรอล้างมืออาชีพ',
    excerpt: 'ระหว่างรอบการล้างถัง มีวิธีดูแลเบื้องต้นง่ายๆ ที่ช่วยชะลอการเกิดตะกอนและรักษาคุณภาพน้ำได้ดีขึ้น',
    date: '5 พ.ค. 2568',
    readTime: '5 นาที',
    accentColor: 'text-teal-600',
    borderHover: 'hover:border-teal-200',
  },
  {
    id: 4,
    image: '/article/01.png',
    category: 'ความรู้เรื่องน้ำ',
    categoryColor: 'bg-blue-600',
    title: 'แบคทีเรียในน้ำประปา มาจากไหน?',
    excerpt: 'แม้จะเป็นน้ำประปา แต่การกักเก็บในถังที่ไม่สะอาดก็อาจทำให้เกิดการสะสมของแบคทีเรียและเชื้อโรคได้',
    date: '20 เม.ย. 2568',
    readTime: '4 นาที',
    accentColor: 'text-blue-600',
    borderHover: 'hover:border-blue-200',
  },
  {
    id: 5,
    image: '/article/02.png',
    category: 'สุขภาพ & ความปลอดภัย',
    categoryColor: 'bg-orange-500',
    title: 'อันตรายจากตะไคร่น้ำในถังเก็บน้ำ',
    excerpt: 'ตะไคร่น้ำไม่ใช่แค่ทำให้สีน้ำเปลี่ยนไป แต่ยังเป็นแหล่งสะสมของเชื้อโรคที่อันตรายต่อสุขภาพการบริโภค',
    date: '15 เม.ย. 2568',
    readTime: '6 นาที',
    accentColor: 'text-orange-500',
    borderHover: 'hover:border-orange-200',
  },
  {
    id: 6,
    image: '/article/03.png',
    category: 'เคล็ดลับดูแลบ้าน',
    categoryColor: 'bg-teal-500',
    title: 'เลือกถังเก็บน้ำแบบไหนดีที่สุด?',
    excerpt: 'แนะนำวิธีการเลือกซื้อถังเก็บน้ำให้เหมาะสมกับขนาดครอบครัว และวัสดุที่ทนทาน ปลอดภัย',
    date: '2 เม.ย. 2568',
    readTime: '5 นาที',
    accentColor: 'text-teal-600',
    borderHover: 'hover:border-teal-200',
  }
]

export default function ArticlesPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <Navbar />
      <PageHero 
        title="บทความ & ข่าวสาร" 
        description="รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้"
        imageSrc="/cover/heroarticle.png"
      />

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Article or Category Filter could go here */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button className="px-5 py-2 rounded-full bg-[#0a1628] text-white text-sm font-semibold transition-transform hover:scale-105">
              ทั้งหมด
            </button>
            <button className="px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 text-sm font-semibold hover:border-blue-600 hover:text-blue-600 transition-all hover:scale-105">
              ความรู้เรื่องน้ำ
            </button>
            <button className="px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 text-sm font-semibold hover:border-orange-500 hover:text-orange-500 transition-all hover:scale-105">
              สุขภาพ & ความปลอดภัย
            </button>
            <button className="px-5 py-2 rounded-full bg-white text-gray-600 border border-gray-200 text-sm font-semibold hover:border-teal-500 hover:text-teal-500 transition-all hover:scale-105">
              เคล็ดลับดูแลบ้าน
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArticles.map((article) => (
              <Link
                key={article.id}
                href={`#`}
                className={`group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${article.borderHover}`}
              >
                {/* Thumbnail */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className={`absolute top-4 left-4 ${article.categoryColor} text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow-sm`}>
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-bold text-[#0a1628] text-xl leading-snug mb-3 group-hover:text-[#f97316] transition-colors duration-300">
                    {article.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-5">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 text-gray-400 text-xs">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {article.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {article.readTime}
                      </span>
                    </div>
                    <span className={`${article.accentColor} text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300`}>
                      อ่าน
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination (Static UI for now) */}
          <div className="mt-16 flex justify-center items-center gap-2">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 hover:border-[#f97316] hover:text-[#f97316] transition-colors cursor-not-allowed">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#f97316] text-white font-semibold shadow-md shadow-orange-200">
              1
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
              2
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
              3
            </button>
            <span className="text-gray-400">...</span>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-600 hover:border-[#f97316] hover:text-[#f97316] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </section>

      <CTABanner />
      <Footer />
    </main>
  )
}
