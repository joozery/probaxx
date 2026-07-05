
const trustItems = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'ปลอดภัย',
    desc: 'ใช้อุปกรณ์ป้องกันครบชุด ปลอดภัยต่อผู้ใช้งาน',
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
    title: 'ใส่ใจทุกรายละเอียด',
    desc: 'ใส่ใจในทุกรายละเอียดของงาน ทำความสะอาดทุกจุด',
    color: '#0ea5e9',
    bg: '#f0f9ff',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
      </svg>
    ),
    title: 'มาตรฐานสากล',
    desc: 'ดำเนินงานตามมาตรฐาน ISO และ GMP',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'เป็นมิตรต่อสิ่งแวดล้อม',
    desc: 'ใช้น้ำยามาตรฐาน ไม่เป็นอันตราย ต่อสิ่งแวดล้อม',
    color: '#059669',
    bg: '#ecfdf5',
  },
]

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-[#e8f4fd] via-[#f0f8ff] to-[#e0effa] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/60 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-sky-100/60 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text + Images */}
          <div>
            {/* Badge */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-0.5 bg-[#f97316]" />
              <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">Why Trust Us</span>
            </div>

            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] leading-snug mb-1">
              มั่นใจในมาตรฐาน
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#f97316] leading-snug mb-1">
              ปลอดภัย 100%
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] leading-snug mb-6">
              ด้วยทีมงานมืออาชีพ
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-10">
              เราใส่ใจทุกขั้นตอน ด้วยทีมงานที่ผ่านการฝึกอบรม
              และมีใบรับรองมาตรฐาน เพื่อให้คุณมั่นใจได้ 100%
              ในความสะอาด ปลอดภัย และได้มาตรฐานทุกครั้ง
            </p>

          

          {/* Right — Trust Cards 2x2 */}
          <div className="grid grid-cols-2 gap-4">
            {trustItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#0a1628] text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
