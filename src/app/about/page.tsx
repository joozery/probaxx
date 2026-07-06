import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Image from 'next/image'
import { connectDB } from '@/lib/mongoose'
import { AboutSettings, type IAboutSettings } from '@/models/AboutSettings'

export const dynamic = 'force-dynamic'

const whyIcons = [
  'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  'M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.492-3.053 5.25 5.25m-7.742-2.197l-2.071 2.071c-.722.722-1.921.849-2.79.283L5.612 18H2v-3.612l1.434-2.88c.566-.87.44-2.068-.283-2.791l2.07-2.07 2.198 7.741zm0 0L8.85 11.49m7.74-5.32c-.524.524-1.222.846-1.966.906-1.077.086-2.091-.563-2.316-1.623-.1-.47.01-1.006.33-1.42L11 2h2l1.69 1.69c.414.32.95.43 1.42.33 1.06-.225 1.71 .789 1.624 1.866-.06.744-.382 1.442-.906 1.966z',
  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z',
  'M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.315 48.315 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z',
]

const equipmentIcons = [
  'M13 10V3L4 14h7v7l9-11h-7z',
  'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  'M9 3h6a2 2 0 012 2v14a2 2 0 01-2 2H9a2 2 0 01-2-2V5a2 2 0 012-2zm3 14a2 2 0 100-4 2 2 0 000 4z',
  'M12 21c-4.478 0-8-3.522-8-8V5.25L12 3l8 2.25V13c0 4.478-3.522 8-8 8z',
  'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
]

export default async function AboutPage() {
  await connectDB()
  let raw = await AboutSettings.findOne().lean()
  if (!raw) {
    const doc = new AboutSettings({})
    await doc.save()
    raw = doc.toObject()
  }
  const s = JSON.parse(JSON.stringify(raw)) as unknown as IAboutSettings

  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <div className="relative pt-36 md:pt-48 pb-24 md:pb-32 overflow-hidden bg-[#001b3a]">
        <div className="absolute inset-0 z-0">
          <Image
            src={s.hero.image}
            alt="About PRO BAX Team"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#001b3a]/90 via-[#001b3a]/70 to-[#001b3a]/30" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#001b3a] ml-0.5" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
              </div>
              <span className="text-white text-xs font-bold tracking-widest uppercase">
                {s.hero.badge}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4">
              {s.hero.title}
            </h1>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#38bdf8] leading-tight mb-8">
              {s.hero.titleBlue}
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
              {s.hero.description}
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-[#1d4ed8] font-bold text-sm tracking-widest uppercase mb-2">{s.why.label}</h3>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628]">
              {s.why.title}
            </h2>
            <div className="w-12 h-1 bg-[#1d4ed8] mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {s.why.items.map((item, i) => (
              <div key={i} className="flex gap-5 group">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-[#1d4ed8] group-hover:bg-[#1d4ed8] group-hover:text-white transition-colors duration-300">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={whyIcons[i % whyIcons.length]} />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#0a1628] mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment and Safety Section */}
      <section className="py-20 md:py-32 bg-[#f2f8fc] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            <div className="lg:w-1/2">
              <h3 className="text-[#1d4ed8] font-bold text-sm tracking-widest uppercase mb-2">{s.equipment.label}</h3>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628] leading-tight mb-6">
                {s.equipment.title}<br/>
                <span className="text-[#1d4ed8]">{s.equipment.titleBlue}</span>
              </h2>
              <p className="text-gray-500 text-lg mb-10 leading-relaxed">
                {s.equipment.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {s.equipment.items.map((eq, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-blue-50/50">
                    <div className="w-10 h-10 rounded-full bg-[#f2f8fc] flex items-center justify-center text-[#1d4ed8] shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={equipmentIcons[i % equipmentIcons.length]} />
                      </svg>
                    </div>
                    <span className="font-bold text-[#0a1628] text-sm">{eq.title}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={s.equipment.image}
                  alt="Professional Water Treatment Equipment"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Decorative elements */}
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#38bdf8] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-[#1d4ed8] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000" />
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
