import Navbar from '@/components/Navbar'
import ServicesHero from '@/components/ServicesHero'
import ServicesSection from '@/components/ServicesSection'
import WhyServiceSection from '@/components/WhyServiceSection'
import PortfolioSection from '@/components/PortfolioSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'

export default function ServicesPage() {
  return (
    <main>
      <Navbar />
      <ServicesHero />
      <ServicesSection />
      <WhyServiceSection />
      <PortfolioSection />
      <FAQSection />
      <Footer />
    </main>
  )
}



