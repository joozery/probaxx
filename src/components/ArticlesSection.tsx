import Image from 'next/image'
import Link from 'next/link'

const articles = [
  {
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
]

export default function ArticlesSection() {
  return (
    <section id="blog" className="relative py-16 md:py-24 overflow-hidden">
      {/* Full section background image */}
      <Image
        src="/cover/heroarticle.png"
        alt="Articles background"
        fill
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="flex-1">
            <span className="inline-block text-[#f97316] text-xs font-bold tracking-widest uppercase mb-3">
              KNOWLEDGE & NEWS
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#0a1628] leading-tight mb-4">
              บทความ & <span className="text-[#f97316]">ข่าวสาร</span>
            </h2>
            <p className="text-gray-600 text-base max-w-md leading-relaxed">
              รวบรวมบทความความรู้ และข่าวสารที่เป็นประโยชน์<br />
              อัปเดตข้อมูลงานระบบน้ำ และการดูแลคุณภาพน้ำ
            </p>
          </div>
          <div className="flex-shrink-0 self-start mt-2">
            <Link
              href="/articles"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0a1628] hover:text-[#f97316] transition-colors group"
            >
              ดูบทความทั้งหมด
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <Link
              key={i}
              href="/articles"
              className={`group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 ${article.borderHover}`}
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <span className={`absolute top-4 left-4 ${article.categoryColor} text-white text-[11px] font-semibold px-3 py-1 rounded-full shadow`}>
                  {article.category}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-5">
                <h3 className="font-bold text-[#0a1628] text-lg leading-snug mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-gray-400 text-xs">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {article.date}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readTime}
                    </span>
                  </div>
                  <span className={`${article.accentColor} text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all`}>
                    อ่านเพิ่มเติม
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA Strip */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f97316]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
            </div>
            <div>
              <p className="text-[#0a1628] font-semibold text-base">เราพร้อมให้คำปรึกษาและดูแลระบบของคุณ</p>
              <p className="text-gray-500 text-sm">ติดต่อกับงานเพื่อรับคำแนะนำจากผู้เชี่ยวชาญ</p>
            </div>
          </div>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all hover:scale-105 whitespace-nowrap shadow-md shadow-orange-200"
          >
            ติดต่อเรา
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  )
}
