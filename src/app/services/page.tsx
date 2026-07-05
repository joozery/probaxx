import Navbar from '@/components/Navbar'
import ServicesHero from '@/components/ServicesHero'
import ServicesSection from '@/components/ServicesSection'
import WhyServiceSection from '@/components/WhyServiceSection'
import PortfolioSection from '@/components/PortfolioSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import { connectDB } from '@/lib/mongoose'
import { ServicesSettings, type IServicesSettings } from '@/models/ServicesSettings'

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

  return (
    <main>
      <Navbar />
      <ServicesHero data={settings.hero} />
      <ServicesSection data={settings.services} />
      <WhyServiceSection data={settings.why} />
      <PortfolioSection data={settings.portfolio} />
      <FAQSection data={settings.faq} />
      <Footer />
    </main>
  )
}
