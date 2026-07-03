import Image from 'next/image'

const clients = [
  { name: 'โรงแรมทวินโลตัส', type: 'โรงแรม & รีสอร์ท', abbr: 'TL' },
  { name: 'นิคมอุตสาหกรรมภาคใต้', type: 'โรงงานอุตสาหกรรม', abbr: 'SI' },
  { name: 'คอนโด ซีวิว ตรัง', type: 'คอนโดมิเนียม', abbr: 'CV' },
  { name: 'โรงพยาบาลตรังรวมแพทย์', type: 'โรงพยาบาล', abbr: 'TR' },
  { name: 'เทศบาลนครตรัง', type: 'หน่วยงานราชการ', abbr: 'TM' },
  { name: 'ห้างสรรพสินค้าโรบินสัน', type: 'ศูนย์การค้า', abbr: 'RB' },
]

const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?q=80&w=800&auto=format&fit=crop', alt: 'ถังเก็บน้ำขนาดใหญ่ มุมมองทางอากาศ' },
  { src: 'https://images.unsplash.com/photo-1533077162801-86490c593afb?q=80&w=800&auto=format&fit=crop', alt: 'บ่อบำบัดน้ำ มุมมองจากด้านบน' },
  { src: 'https://images.unsplash.com/photo-1541941392960-652036ca567e?q=80&w=800&auto=format&fit=crop', alt: 'หอถังน้ำสูง' },
  { src: 'https://images.unsplash.com/photo-1646488993053-8c182b628696?q=80&w=800&auto=format&fit=crop', alt: 'ถังเก็บน้ำอุตสาหกรรม' },
  { src: 'https://images.unsplash.com/photo-1538474705339-e87de81450e8?q=80&w=800&auto=format&fit=crop', alt: 'ระบบท่อน้ำอุตสาหกรรม' },
  { src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop', alt: 'ท่อระบายน้ำและวาล์ว' },
  { src: 'https://images.unsplash.com/photo-1593260654732-df52bea15d63?q=80&w=800&auto=format&fit=crop', alt: 'ล้างทำความสะอาดด้วยแรงดันสูง' },
  { src: 'https://images.unsplash.com/photo-1639600993675-2281b2c939f0?q=80&w=800&auto=format&fit=crop', alt: 'ระบบท่อน้ำภายในอาคาร' },
]

export default function PortfolioSection() {
  return (
    <section className="py-20 md:py-28 bg-[#f2f8fc] border-t border-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-[#1d4ed8] font-bold text-sm tracking-widest uppercase mb-2">OUR PORTFOLIO</h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0a1628]">
            ผลงานที่ผ่านมา
          </h2>
          <div className="w-12 h-1 bg-[#1d4ed8] mx-auto mt-4" />
        </div>

        {/* 1. Client Logos */}
        <div className="mb-20">
          <h4 className="text-center text-gray-400 font-semibold mb-10 text-sm tracking-widest uppercase">ได้รับความไว้วางใจจากองค์กรชั้นนำ</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client, i) => (
              <div key={i} className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:border-[#f97316]/30 hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] flex items-center justify-center flex-shrink-0 group-hover:from-[#f97316] group-hover:to-[#ea6c0a] transition-all duration-300">
                  <span className="text-white font-black text-lg tracking-tight">{client.abbr}</span>
                </div>
                <div className="text-center">
                  <p className="text-[#0a1628] font-semibold text-xs leading-tight mb-0.5">{client.name}</p>
                  <p className="text-gray-400 text-[10px]">{client.type}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-300 text-xs mt-6">* รอใส่ logo จริงจากลูกค้า</p>
        </div>

        {/* 2. Gallery Grid */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-[#0a1628]">แกลเลอรี่ผลงาน</h3>
            <a href="#" className="text-[#1d4ed8] font-semibold hover:underline">ดูทั้งหมด &rarr;</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryItems.map((item, i) => (
              <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold text-center px-4 drop-shadow-md">{item.alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Case Study */}
        <div>
          <h3 className="text-2xl font-bold text-[#0a1628] mb-8">กรณีศึกษา (Case Study)</h3>
          <div className="bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-50 flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[300px]">
              <Image
                src="https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=1200&auto=format&fit=crop"
                alt="ล้างถังเก็บน้ำด้วยแรงดันสูงในโรงงานอุตสาหกรรม"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-[#1d4ed8] font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                Featured Case Study
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h4 className="text-2xl font-extrabold text-[#0a1628] mb-4">
                โครงการล้างถังเก็บน้ำใส นิคมอุตสาหกรรม
              </h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                พบปัญหาคราบสนิมและตะกอนดินสะสมหนาในถังเก็บน้ำขนาด 100,000 ลิตร ส่งผลให้คุณภาพน้ำไม่ได้มาตรฐาน PROBAX ได้เข้าประเมินและวางแผนล้างทำความสะอาดด้วยวิธีที่ปลอดภัย ไม่กระทบการผลิต
              </p>
              
              <div className="flex gap-8 mb-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">ระยะเวลา</p>
                  <p className="font-bold text-[#0a1628]">2 วัน</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">ผลลัพธ์</p>
                  <p className="font-bold text-[#34d399]">น้ำใสสะอาด 100%</p>
                </div>
              </div>
              
              <button className="self-start px-6 py-3 bg-[#0a1628] text-white font-semibold rounded-full hover:bg-gray-800 transition-colors">
                อ่าน Case Study ฉบับเต็ม
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
