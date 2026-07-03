import Image from 'next/image'
import Link from 'next/link'

const services = [
  { label: 'ล้างถังเก็บน้ำ', href: '#services' },
  { label: 'ล้างถังบำบัดน้ำเสีย', href: '#services' },
  { label: 'ทำความสะอาดระบบน้ำ', href: '#services' },
  { label: 'ตรวจสอบคุณภาพน้ำ', href: '#services' },
]

const companyLinks = [
  { label: 'เกี่ยวกับเรา', href: '#about' },
  { label: 'ผลงานของเรา', href: '#portfolio' },
  { label: 'บทความ', href: '#blog' },
  { label: 'ติดต่อเรา', href: '#contact' },
]

const certifications = ['ISO 9001', 'มาตรฐาน กรมอนามัย', 'ใบอนุญาต อย.']

export default function Footer() {
  return (
    <footer className="bg-[#071020] text-white">
      {/* Orange accent line */}
      <div className="h-1 bg-gradient-to-r from-[#f97316] via-[#ea6c0a] to-[#f97316]" />


      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand & Certs */}
          <div className="md:col-span-5">
            <Image
              src="/logo/logo.jpeg"
              alt="PROBAX Logo"
              width={140}
              height={50}
              className="h-12 w-auto object-contain mb-5 mix-blend-screen"
            />
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              ผู้เชี่ยวชาญงานล้างถังเก็บน้ำและถังบำบัดน้ำเสีย ด้วยทีมงานมืออาชีพที่ผ่านการฝึกอบรม มาตรฐานสูง เพื่อคุณภาพน้ำที่สะอาดและปลอดภัยสำหรับคุณและครอบครัว
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {certifications.map((cert) => (
                <span key={cert} className="inline-flex items-center gap-1.5 text-xs text-white/70 border border-white/20 rounded-full px-3 py-1">
                  <svg className="w-3.5 h-3.5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {cert}
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              {[
                { label: 'Facebook', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
                { label: 'YouTube', icon: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /> },
              ].map((social) => (
                <a key={social.label} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#f97316] border border-white/10 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{social.icon}</svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3 flex justify-between gap-4">
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#f97316] rounded-full" />
                บริการ
              </h4>
              <ul className="space-y-3">
                {services.map((s) => (
                  <li key={s.label}>
                    <Link href={s.href} className="text-white/60 hover:text-[#f97316] text-sm transition-colors">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#f97316] rounded-full" />
                บริษัท
              </h4>
              <ul className="space-y-3">
                {companyLinks.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-white/60 hover:text-[#f97316] text-sm transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#f97316] rounded-full" />
              ติดต่อเรา
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#f97316] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <p className="text-white/60 text-sm">
                  155/10 หมู่ที่ 3 ต.บ้านโพธิ์ อ.เมืองตรัง จ.ตรัง 92000
                </p>
              </li>
              <li>
                <a href="tel:0855564994" className="flex items-center gap-3 hover:text-[#f97316] text-white/60 transition-colors">
                  <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <span className="text-sm">085-556-4994 (ก้อง)</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
                <span className="text-white/60 text-sm">บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">
              © 2025 <span className="text-white/60 font-medium">บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด</span> All Rights Reserved.
            </p>
            <div className="flex items-center gap-4 text-white/40 text-xs">
              <Link href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
              <Link href="#" className="hover:text-white transition-colors">เงื่อนไขการให้บริการ</Link>
              <Link href="#" className="hover:text-white transition-colors">แผนผังเว็บไซต์</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
