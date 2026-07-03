const trustItems = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'ปลอดภัย',
    desc: 'ใช้อุปกรณ์ป้องกัน ครบชุด',
    color: '#f97316',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: 'ไม่ใช้สารเคมีอันตราย',
    desc: 'ใช้น้ำยามาตรฐาน ปลอดภัยต่อระบบ',
    color: '#38bdf8',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'มาตรฐานสากล',
    desc: 'ดำเนินงานตามมาตรฐาน ISO และ GMP',
    color: '#a78bfa',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    title: 'เป็นมิตรต่อสิ่งแวดล้อม',
    desc: 'จัดการน้ำเสียอย่างถูกวิธี ไม่กระทบสิ่งแวดล้อม',
    color: '#34d399',
  },
]

export default function TrustSection() {
  return (
    <section className="py-16 md:py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full border border-white/5" />
      <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full border border-white/5" />
      <div className="absolute -left-16 bottom-10 w-56 h-56 rounded-full border border-white/5" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-0.5 bg-[#f97316]" />
              <span className="text-[#f97316] text-xs font-bold tracking-widest uppercase">Why Trust Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-snug mb-2">
              มั่นใจในมาตรฐาน
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#f97316] leading-snug mb-2">
              ปลอดภัย 100%
            </h2>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-snug mb-8">
              ด้วยทีมงานมืออาชีพ
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              เราใส่ใจทุกขั้นตอน ด้วยทีมงานที่ผ่านการฝึกอบรมและมีใบรับรองมาตรฐาน เพื่อให้คุณมั่นใจได้ 100%
            </p>
          </div>

          {/* Right — Trust Items */}
          <div className="grid grid-cols-2 gap-4">
            {trustItems.map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-white/8 bg-white/4 hover:bg-white/8 transition-all duration-300 group"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: item.color + '20', color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">{item.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
