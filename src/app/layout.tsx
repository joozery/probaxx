import type { Metadata } from 'next'
import './globals.css'
import { QuoteProvider } from '@/context/QuoteContext'
import QuoteModal from '@/components/QuoteModal'
import FloatingContact from '@/components/FloatingContact'

export const metadata: Metadata = {
  title: {
    default: 'PROBAX | ผู้เชี่ยวชาญล้างถังเก็บน้ำและถังบำบัดน้ำเสีย ภาคใต้',
    template: '%s | PROBAX ล้างถังเก็บน้ำ ภาคใต้'
  },
  description: 'PROBAX บริการล้างถังเก็บน้ำ ล้างถังบำบัดน้ำเสีย ทำความสะอาดอุตสาหกรรม มาตรฐานระดับสากล ให้บริการครอบคลุมพื้นที่ภาคใต้ หาดใหญ่ สงขลา ภูเก็ต สุราษฎร์ธานี และจังหวัดใกล้เคียง',
  keywords: ['ล้างถังเก็บน้ำ', 'ล้างถังบำบัดน้ำเสีย', 'ทำความสะอาดอุตสาหกรรม', 'ทำความสะอาดโรงงาน', 'ล้างถังเก็บน้ำ ภาคใต้', 'ทำความสะอาด ภาคใต้', 'ล้างถังเก็บน้ำ หาดใหญ่', 'ล้างถังเก็บน้ำ สงขลา', 'ล้างถังเก็บน้ำ ภูเก็ต', 'ล้างถังเก็บน้ำ สุราษฎร์ธานี', 'PROBAX', 'โปรแบค'],
  authors: [{ name: 'PROBAX' }],
  creator: 'PROBAX',
  publisher: 'PROBAX',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'PROBAX | ผู้เชี่ยวชาญล้างถังเก็บน้ำและถังบำบัดน้ำเสีย ภาคใต้',
    description: 'บริการล้างถังเก็บน้ำ ล้างถังบำบัดน้ำเสีย ทำความสะอาดอุตสาหกรรม ให้บริการครอบคลุมพื้นที่ภาคใต้ สงขลา ภูเก็ต หาดใหญ่',
    url: 'https://probax.co',
    siteName: 'PROBAX',
    images: [
      {
        url: 'https://probax.co/icon.png',
        width: 800,
        height: 600,
        alt: 'PROBAX Logo',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PROBAX | ผู้เชี่ยวชาญล้างถังเก็บน้ำและถังบำบัดน้ำเสีย ภาคใต้',
    description: 'บริการล้างถังเก็บน้ำ ล้างถังบำบัดน้ำเสีย ทำความสะอาดอุตสาหกรรม ภาคใต้ สงขลา ภูเก็ต',
    images: ['https://probax.co/icon.png'],
  },
  alternates: {
    canonical: 'https://probax.co',
  },
}

// AEO (Answer Engine Optimization) & SEO JSON-LD
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PROBAX (โปรแบค)",
  "image": "https://probax.co/icon.png",
  "description": "ผู้ให้บริการล้างถังเก็บน้ำ ถังบำบัดน้ำเสีย และทำความสะอาดอุตสาหกรรม ครอบคลุมพื้นที่ภาคใต้ของประเทศไทย",
  "url": "https://probax.co",
  "areaServed": [
    { "@type": "State", "name": "ภาคใต้" },
    { "@type": "City", "name": "สงขลา" },
    { "@type": "City", "name": "หาดใหญ่" },
    { "@type": "City", "name": "ภูเก็ต" },
    { "@type": "City", "name": "สุราษฎร์ธานี" },
    { "@type": "City", "name": "นครศรีธรรมราช" },
    { "@type": "City", "name": "กระบี่" }
  ],
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "หาดใหญ่",
    "addressRegion": "สงขลา",
    "addressCountry": "TH"
  },
  "serviceArea": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 7.0022,
      "longitude": 100.4682
    },
    "geoRadius": "500000"
  },
  "sameAs": [
    "https://probax.co"
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Schema.org for Google / AEO */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
          <QuoteProvider>
            {children}
            <QuoteModal />
            <FloatingContact />
          </QuoteProvider>
        </body>
    </html>
  )
}
