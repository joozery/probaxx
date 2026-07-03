export default function ServiceFeatures() {
  const features = [
    {
      title: 'ตรวจสอบก่อนล้าง',
      desc: 'ประเมินสภาพท่อและน้ำก่อนการล้างทุกครั้ง',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      )
    },
    {
      title: 'ล้างอย่างถูกวิธี',
      desc: 'ใช้เครื่องมือปลอดภัย ไม่ทิ้งสารตกค้าง',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2.25c-3.111 0-6.19 1.488-8.25 4.103-1.61 2.05-2.25 4.793-2.25 7.647 0 5.522 4.701 10 10.5 10s10.5-4.478 10.5-10c0-2.854-.64-5.597-2.25-7.647C18.19 3.738 15.111 2.25 12 2.25z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m-3-3h6" />
        </svg>
      )
    },
    {
      title: 'ฆ่าเชื้อโรค',
      desc: 'กำจัดแบคทีเรียและเชื้อโรคด้วยวิธีที่ได้มาตรฐาน',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      )
    },
    {
      title: 'ตรวจสอบคุณภาพน้ำ',
      desc: 'มั่นใจในคุณภาพน้ำที่ได้มาตรฐานส่งมอบงาน',
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      )
    }
  ]

  return (
    <section className="bg-white py-16 md:py-24 relative z-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-xl border border-blue-50/50 p-8 md:p-10 flex flex-col xl:flex-row items-center justify-between gap-10">
          
          {/* Title */}
          <div className="xl:w-[30%] shrink-0 text-center xl:text-left">
            <h3 className="text-gray-500 font-bold text-sm mb-2">ทำไมต้องเลือกเรา</h3>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0a1628] leading-snug">
              มากกว่าความสะอาด<br />
              คือ<span className="text-[#1d4ed8]">ความใส่ใจในทุกขั้นตอน</span>
            </h2>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 xl:gap-8 flex-1">
            {features.map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#1d4ed8] border-2 border-[#1d4ed8]/20 bg-blue-50">
                  {item.icon}
                </div>
                <h4 className="font-bold text-[#0a1628] text-sm md:text-base mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
