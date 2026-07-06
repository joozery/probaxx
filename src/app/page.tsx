export const dynamic = 'force-dynamic'

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
