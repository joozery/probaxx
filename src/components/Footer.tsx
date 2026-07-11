import Image from 'next/image'
import Link from 'next/link'
import { connectDB } from '@/lib/mongoose'
import FooterSettings from '@/models/FooterSettings'

const DEFAULT = {
  logo: '/logo/logo.jpeg',
  description: 'ผู้เชี่ยวชาญงานล้างถังเก็บน้ำและถังบำบัดน้ำเสีย ด้วยทีมงานมืออาชีพที่ผ่านการฝึกอบรม มาตรฐานสูง เพื่อคุณภาพน้ำที่สะอาดและปลอดภัยสำหรับคุณและครอบครัว',
  certifications: ['ISO 9001', 'มาตรฐาน กรมอนามัย', 'ใบอนุญาต อย.'],
  socialLinks: [{ label: 'Facebook', url: '#' }, { label: 'YouTube', url: '#' }],
  serviceLinks: [
    { label: 'ล้างถังเก็บน้ำ', href: '/services' },
    { label: 'ล้างถังบำบัดน้ำเสีย', href: '/services' },
    { label: 'ทำความสะอาดระบบน้ำ', href: '/services' },
    { label: 'ตรวจสอบคุณภาพน้ำ', href: '/services' },
  ],
  companyLinks: [
    { label: 'เกี่ยวกับเรา', href: '/about' },
    { label: 'ผลงานของเรา', href: '/portfolio' },
    { label: 'บทความ', href: '/articles' },
    { label: 'ติดต่อเรา', href: '/contact' },
  ],
  contact: {
    address: '155/10 หมู่ที่ 3 ต.บ้านโพธิ์ อ.เมืองตรัง จ.ตรัง 92000',
    phone: '085-556-4994',
    companyName: 'บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด',
    lineId: '@probax',
    email: '',
  },
  copyright: '© 2025 บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด All Rights Reserved.',
}

async function getFooter() {
  try {
    await connectDB()
    const settings = await FooterSettings.findOne().lean()
    return settings ?? DEFAULT
  } catch {
    return DEFAULT
  }
}

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Facebook: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />,
  YouTube: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  Line: <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.105.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />,
  Instagram: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function Footer() {
  const f = await getFooter() as any

  return (
    <footer className="bg-[#071020] text-white">
      <div className="h-1 bg-gradient-to-r from-[#f97316] via-[#ea6c0a] to-[#f97316]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">

          {/* Brand */}
          <div className="md:col-span-5">
            <Image src={f.logo || '/logo/logo.jpeg'} alt="PROBAX Logo" width={220} height={70} className="h-14 w-auto object-contain mb-5 mix-blend-screen brightness-110" />
            {f.description && (
              <p className="text-white/60 text-sm leading-relaxed mb-6">{f.description}</p>
            )}
            {f.certifications?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {f.certifications.map((cert: string) => (
                  <span key={cert} className="inline-flex items-center gap-1.5 text-xs text-white/70 border border-white/20 rounded-full px-3 py-1">
                    <svg className="w-3.5 h-3.5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {cert}
                  </span>
                ))}
              </div>
            )}
            {f.socialLinks?.length > 0 && (
              <div className="flex gap-2">
                {f.socialLinks.map((s: { label: string; url: string }) => (
                  <a key={s.label} href={s.url} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#f97316] border border-white/10 flex items-center justify-center transition-colors" title={s.label}>
                    {SOCIAL_ICONS[s.label] ? (
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">{SOCIAL_ICONS[s.label]}</svg>
                    ) : (
                      <span className="text-xs font-bold">{s.label[0]}</span>
                    )}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div className="md:col-span-3 flex justify-between gap-4">
            {f.serviceLinks?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#f97316] rounded-full" />บริการ
                </h4>
                <ul className="space-y-3">
                  {f.serviceLinks.map((s: { label: string; href: string }) => (
                    <li key={s.label}>
                      <Link href={s.href} className="text-white/60 hover:text-[#f97316] text-sm transition-colors">{s.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {f.companyLinks?.length > 0 && (
              <div>
                <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#f97316] rounded-full" />บริษัท
                </h4>
                <ul className="space-y-3">
                  {f.companyLinks.map((l: { label: string; href: string }) => (
                    <li key={l.label}>
                      <Link href={l.href} className="text-white/60 hover:text-[#f97316] text-sm transition-colors">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#f97316] rounded-full" />ติดต่อเรา
            </h4>
            <ul className="space-y-4">
              {f.contact?.address && (
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#f97316] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-white/60 text-sm">{f.contact.address}</p>
                </li>
              )}
              {f.contact?.phone && (
                <li>
                  <a href={`tel:${f.contact.phone.replace(/[^0-9+]/g, '')}`} className="flex items-center gap-3 hover:text-[#f97316] text-white/60 transition-colors">
                    <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    <span className="text-sm">{f.contact.phone}</span>
                  </a>
                </li>
              )}
              {f.contact?.companyName && (
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                  <span className="text-white/60 text-sm">{f.contact.companyName}</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-xs">{f.copyright}</p>
            <div className="flex items-center gap-4 text-white/40 text-xs">
              <Link href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</Link>
              <Link href="#" className="hover:text-white transition-colors">เงื่อนไขการให้บริการ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
