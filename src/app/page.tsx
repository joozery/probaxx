import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import WhySection from '@/components/WhySection'
import SymptomsSection from '@/components/SymptomsSection'
import ProcessSection from '@/components/ProcessSection'
import ArticlesSection from '@/components/ArticlesSection'
import TrustSection from '@/components/TrustSection'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <WhySection />
      <SymptomsSection />
      <ProcessSection />
      <ArticlesSection />
      <TrustSection />
      <CTABanner />
      <Footer />
    </main>
  )
}
