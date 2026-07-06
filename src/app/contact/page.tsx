import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import ContactForm from './ContactForm'
import { connectDB } from '@/lib/mongoose'
import { ContactSettings, type IContactSettings } from '@/models/ContactSettings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ติดต่อเรา | PROBAX บริการทำความสะอาด ภาคใต้ (สงขลา หาดใหญ่)',
  description: 'ติดต่อทีมงาน PROBAX สอบถามประเมินราคาล้างถังเก็บน้ำ ถังบำบัดน้ำเสีย และทำความสะอาดอุตสาหกรรมในพื้นที่ภาคใต้ สงขลา หาดใหญ่ ภูเก็ต สุราษฎร์ธานี ยินดีให้คำปรึกษาฟรี',
  keywords: ['ติดต่อ PROBAX', 'เบอร์โทรศัพท์ PROBAX', 'ล้างถังเก็บน้ำ สงขลา', 'ล้างถังน้ำ หาดใหญ่', 'สอบถามราคาล้างถัง'],
}

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "ติดต่อ PROBAX",
  "description": "ติดต่อสอบถามบริการทำความสะอาดล้างถังเก็บน้ำ",
  "mainEntity": {
    "@type": "LocalBusiness",
    "name": "PROBAX",
    "telephone": "080-000-0000",
    "areaServed": "ภาคใต้ ประเทศไทย"
  }
}

export default async function ContactPage() {
  await connectDB()
  let raw = await ContactSettings.findOne().lean()
  if (!raw) {
    const doc = new ContactSettings({})
    await doc.save()
    raw = doc.toObject()
  }
  const s = JSON.parse(JSON.stringify(raw)) as unknown as IContactSettings

  const PHONE = s.info.phone
  const PHONE_RAW = s.info.phone.replace(/\D/g, '')
  const LINE_ID = s.info.lineId
  const EMAIL = s.info.email
  const ADDRESS = s.info.address

  return (
    <main className="bg-[#f2f8fc] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }} />
      <Navbar />

      {/* ── Hero ── */}
      <div className="relative pt-28 md:pt-36 pb-16 md:pb-20 overflow-hidden bg-[#001b3a]">
        <div className="absolute inset-0 z-0">
          <Image
            src={s.hero.image}
            alt="Contact PRO BAX"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001b3a]/95 via-[#001b3a]/75 to-[#001b3a]/40" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-[#f97316] flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-white text-xs font-bold tracking-widest uppercase">{s.hero.badge}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-3">
              {s.hero.title}
            </h1>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-xl mb-5">
              {s.hero.description}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`tel:${PHONE_RAW}`}
                className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                โทรเลย {PHONE}
              </a>
              <a
                href={`https://line.me/R/ti/p/${LINE_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00B900] hover:bg-[#009900] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-green-500/20"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-4.136 2.572-5.992z" />
                </svg>
                เพิ่มเพื่อน LINE
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick-action bar ── */}
      <div className="bg-[#0a1628] py-4 sticky top-16 md:top-20 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap gap-4 items-center justify-between">
          <p className="text-white/70 text-sm hidden sm:block">
            {s.quickBar.text}
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href={`tel:${PHONE_RAW}`} className="flex items-center gap-1.5 text-white text-sm font-semibold hover:text-[#f97316] transition-colors">
              <svg className="w-4 h-4 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              {PHONE}
            </a>
            <span className="text-white/20">|</span>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 text-white text-sm font-semibold hover:text-[#f97316] transition-colors">
              <svg className="w-4 h-4 text-[#f97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {EMAIL}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <section className="py-10 md:py-14 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

            {/* ── Left: Info + Map ── */}
            <div className="lg:w-5/12 flex flex-col gap-6">

              {/* Contact info card */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border border-blue-50/50">
                <h3 className="text-xl font-extrabold text-[#0a1628] mb-5">ช่องทางการติดต่อ</h3>

                <div className="space-y-4">
                  {/* Phone */}
                  <a href={`tel:${PHONE_RAW}`} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#1d4ed8] flex items-center justify-center text-[#1d4ed8] group-hover:text-white shrink-0 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">เบอร์โทรศัพท์</h4>
                      <p className="text-base font-bold text-[#0a1628] group-hover:text-[#1d4ed8] transition-colors">
                        {PHONE}{s.info.phoneContactName && ` (${s.info.phoneContactName})`}
                      </p>
                    </div>
                  </a>

                  {/* LINE */}
                  <a href={`https://line.me/R/ti/p/${LINE_ID}`} target="_blank" rel="noopener noreferrer" className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-[#00B900]/10 group-hover:bg-[#00B900] flex items-center justify-center text-[#00B900] group-hover:text-white shrink-0 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-4.136 2.572-5.992z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">LINE Official</h4>
                      <p className="text-base font-bold text-[#0a1628] group-hover:text-[#00B900] transition-colors">{LINE_ID}</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a href={`mailto:${EMAIL}`} className="flex gap-4 items-start group">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 group-hover:bg-[#f97316] flex items-center justify-center text-[#f97316] group-hover:text-white shrink-0 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">อีเมล</h4>
                      <p className="text-base font-bold text-[#0a1628] group-hover:text-[#f97316] transition-colors">{EMAIL}</p>
                    </div>
                  </a>

                  {/* Address */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">ที่อยู่</h4>
                      <p className="text-sm font-semibold text-[#0a1628] leading-relaxed">{ADDRESS}</p>
                      {s.info.companyName && <p className="text-xs text-gray-400 mt-0.5">{s.info.companyName}</p>}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">เวลาทำการ</h4>
                      <p className="text-sm font-semibold text-[#0a1628]">{s.info.hoursLine1}</p>
                      {s.info.hoursLine2 && <p className="text-xs text-gray-400 mt-0.5">{s.info.hoursLine2}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps embed */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-blue-50/50">
                <div className="relative w-full h-52">
                  <iframe
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&hl=th&z=15&output=embed`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="PRO BAX Location"
                  />
                </div>
                <div className="px-5 py-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500 truncate">{ADDRESS}</p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 ml-3 text-xs font-bold text-[#1d4ed8] hover:underline"
                  >
                    เปิดใน Maps →
                  </a>
                </div>
              </div>
            </div>

            {/* ── Right: Form ── */}
            <div className="lg:w-7/12">
              <div className="bg-white rounded-2xl p-6 md:p-10 shadow-xl border border-blue-50/50">
                <ContactForm />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-[#0a1628] py-10 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            {s.cta.title}
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-6 max-w-xl mx-auto">
            {s.cta.description}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`tel:${PHONE_RAW}`}
              className="inline-flex items-center gap-2 bg-[#f97316] hover:bg-[#ea6c0a] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              โทร {PHONE}
            </a>
            <a
              href={`https://line.me/R/ti/p/${LINE_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#00B900] hover:bg-[#009900] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.778.039 1.085l-.171 1.027c-.053.303-.242 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967 1.739-1.907 2.572-4.136 2.572-5.992z" />
              </svg>
              เพิ่มเพื่อน LINE {LINE_ID}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
