import Image from 'next/image'

interface PageHeroProps {
  title: string;
  description: string;
  imageSrc: string;
  overlayOpacity?: number;
}

export default function PageHero({ title, description, imageSrc, overlayOpacity = 40 }: PageHeroProps) {
  const opacity = Math.min(90, Math.max(0, overlayOpacity)) / 100
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#0a1628]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover object-center"
          style={{ opacity: 1 - opacity * 0.3 }}
          priority
        />
        <div className="absolute inset-0" style={{ background: `rgba(10,22,40,${opacity})` }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-md">
          {title}
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
