export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import WhySection from '@/components/WhySection'
import SymptomsSection from '@/components/SymptomsSection'
import ProcessSection from '@/components/ProcessSection'
import ArticlesSection from '@/components/ArticlesSection'
import TrustSection from '@/components/TrustSection'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'
import { connectDB } from '@/lib/mongoose'
import { HomeSettings, type IHomeSettings } from '@/models/HomeSettings'

export const metadata: Metadata = {
  title: 'บริษัทรับล้างถังเก็บน้ำและบำบัดน้ำเสีย ภาคใต้ (สงขลา หาดใหญ่ ภูเก็ต) | PROBAX',
  description: 'PROBAX ผู้เชี่ยวชาญบริการทำความสะอาด ล้างถังเก็บน้ำ ถังน้ำสแตนเลส ถังบำบัดน้ำเสีย สำหรับบ้าน อาคาร และโรงงานอุตสาหกรรม ครอบคลุมพื้นที่ภาคใต้ หาดใหญ่ สงขลา ภูเก็ต สุราษฎร์ธานี',
  keywords: ['ล้างถังเก็บน้ำ ภาคใต้', 'ล้างถังน้ำ หาดใหญ่', 'ล้างถังเก็บน้ำ สงขลา', 'ล้างถังบำบัดน้ำเสีย ภูเก็ต', 'ทำความสะอาดโรงงาน ภาคใต้'],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "บริการล้างถังเก็บน้ำของ PROBAX ครอบคลุมพื้นที่ไหนบ้าง?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "เราให้บริการครอบคลุมทั่วพื้นที่ภาคใต้ โดยมีศูนย์บริการหลักที่ สงขลา หาดใหญ่ ภูเก็ต สุราษฎร์ธานี และจังหวัดใกล้เคียง"
      }
    },
    {
      "@type": "Question",
      "name": "ทำไมต้องล้างถังเก็บน้ำ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "เพื่อป้องกันการสะสมของตะกอน สนิม เชื้อแบคทีเรีย และสิ่งสกปรกที่อาจปนเปื้อนในน้ำอุปโภคบริโภค ควรล้างทำความสะอาดอย่างน้อยปีละ 1-2 ครั้ง"
      }
    }
  ]
}

export default async function Home() {
  await connectDB()
  let raw = await HomeSettings.findOne().lean()
  if (!raw) {
    const doc = new HomeSettings({})
    await doc.save()
    raw = doc.toObject()
  }
  const s = JSON.parse(JSON.stringify(raw)) as unknown as IHomeSettings

  return (
    <main>
      <Script id="schema-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />
      <HeroSection data={s.hero} />
      <WhySection data={s.why} />
      <SymptomsSection data={s.symptoms} />
      <ProcessSection data={s.process} />
      <ArticlesSection />
      <TrustSection data={s.trust} />
      <CTABanner data={s.cta} />
      <Footer />
    </main>
  )
}
