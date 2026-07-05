import Image from 'next/image'

interface PageHeroProps {
  title: string;
  description: string;
  imageSrc: string;
}

export default function PageHero({ title, description, imageSrc }: PageHeroProps) {
  return (
    <div className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-[#0a1628]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover object-center opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/80 to-transparent" />
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
