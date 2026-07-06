import type { Metadata } from 'next'
import Script from 'next/script'
import Navbar from '@/components/Navbar'
import ServicesHero from '@/components/ServicesHero'
import ServicesSection from '@/components/ServicesSection'
import WhyServiceSection from '@/components/WhyServiceSection'
import PortfolioSection from '@/components/PortfolioSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import { connectDB } from '@/lib/mongoose'
import { ServicesSettings, type IServicesSettings } from '@/models/ServicesSettings'
import { PortfolioSettings, type IPortfolioSettings } from '@/models/PortfolioSettings'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'บริการล้างถังเก็บน้ำ ถังบำบัดน้ำเสีย ภาคใต้ (สงขลา หาดใหญ่ ภูเก็ต) | PROBAX',
  description: 'บริการครบวงจรของ PROBAX ล้างถังเก็บน้ำ ล้างถังบำบัดน้ำเสีย ล้างท่อ ทำความสะอาดบ่อดักไขมัน ด้วยทีมช่างมืออาชีพ มาตรฐานความปลอดภัยสูงสุด ทั่วภาคใต้ สงขลา หาดใหญ่ ภูเก็ต สุราษฎร์ธานี',
  keywords: ['บริการล้างถังเก็บน้ำ', 'ล้างถังเก็บน้ำ ภาคใต้', 'ล้างถังเก็บน้ำใต้ดิน', 'ล้างถังน้ำสแตนเลส', 'ล้างถังบำบัดน้ำเสีย', 'ทำความสะอาดบ่อดักไขมัน', 'สงขลา', 'หาดใหญ่', 'ภูเก็ต'],
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "บริการทำความสะอาดถังเก็บน้ำและบำบัดน้ำเสียภาคใต้",
  "provider": {
    "@type": "LocalBusiness",
    "name": "PROBAX"
  },
  "areaServed": [
    { "@type": "State", "name": "ภาคใต้" },
    { "@type": "City", "name": "สงขลา" },
    { "@type": "City", "name": "หาดใหญ่" },
    { "@type": "City", "name": "ภูเก็ต" },
    { "@type": "City", "name": "สุราษฎร์ธานี" }
  ],
  "description": "บริการทำความสะอาด ล้างถังเก็บน้ำ ถังบำบัดน้ำเสีย และล้างท่อสำหรับบ้าน อาคาร โรงงานอุตสาหกรรม ครอบคลุมทั่วภาคใต้",
  "serviceType": "Water Tank Cleaning"
}

export default async function ServicesPage() {
  await connectDB()

  let raw = await ServicesSettings.findOne().lean()
  if (!raw) {
    const doc = new ServicesSettings({})
    await doc.save()
    raw = doc.toObject()
  }
  const settings = JSON.parse(JSON.stringify(raw)) as unknown as IServicesSettings

  // section ผลงานใช้ข้อมูลชุดเดียวกับหน้า /portfolio (จัดการที่ /admin/portfolio)
  let portfolioRaw = await PortfolioSettings.findOne().lean()
  if (!portfolioRaw) {
    const doc = new PortfolioSettings({})
    await doc.save()
    portfolioRaw = doc.toObject()
  }
  const portfolio = JSON.parse(JSON.stringify(portfolioRaw)) as unknown as IPortfolioSettings

  const gallery = portfolio.items
    .filter(item => item.src)
    .slice(0, 8)
    .map(item => ({ src: item.src, alt: item.title }))

  return (
    <main>
      <Script id="schema-service" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Navbar />
      <ServicesHero data={settings.hero} />
      <ServicesSection data={settings.services} />
      <WhyServiceSection data={settings.why} />
      <PortfolioSection
        sectionTitle={settings.portfolio.sectionTitle}
        clients={settings.portfolio.clients}
        gallery={gallery}
        caseStudy={portfolio.caseStudy}
      />
      <FAQSection data={settings.faq} />
      <Footer />
    </main>
  )
}
