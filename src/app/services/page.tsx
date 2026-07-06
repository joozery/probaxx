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
