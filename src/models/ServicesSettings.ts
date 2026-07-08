import mongoose, { Schema, Document, model, models } from 'mongoose'

export interface IServicesSettings extends Document {
  hero: {
    title: string
    titleColor: string
    subtitle: string
    subtitleColor: string
    description: string
    descriptionColor: string
    image: string
    features: Array<{ title: string; desc: string }>
  }
  services: {
    sectionTitle: string
    items: Array<{ title: string; desc: string; image: string }>
  }
  why: {
    title: string
    titleColor: string
    titleBlue: string
    titleBlueColor: string
    description: string
    descriptionColor: string
    image: string
    symptoms: Array<{ label: string }>
    benefits: Array<{ title: string; desc: string }>
  }
  portfolio: {
    sectionTitle: string
    clients: Array<{ name: string; clientType: string; abbr: string; logo: string }>
    gallery: Array<{ src: string; alt: string }>
    caseStudy: {
      image: string
      title: string
      description: string
      duration: string
      result: string
    }
  }
  faq: {
    heading: string
    headingColor: string
    questionColor: string
    answerColor: string
    items: Array<{ question: string; answer: string }>
  }
}

const ServicesSettingsSchema = new Schema<IServicesSettings>(
  {
    hero: {
      title: { type: String, default: 'บริการล้างถังเก็บน้ำ' },
      titleColor: { type: String, default: '#ffffff' },
      subtitle: { type: String, default: 'สะอาด ปลอดภัย ได้มาตรฐาน' },
      subtitleColor: { type: String, default: '#38bdf8' },
      description: { type: String, default: 'เราดูแลความสะอาดของถังเก็บน้ำ ด้วยทีมงานมืออาชีพ อุปกรณ์ครบครัน ปลอดภัยทั้งคุณและคนในครอบครัว' },
      descriptionColor: { type: String, default: '#d1d5db' },
      image: { type: String, default: '/cover/coverherosr.png' },
      features: {
        type: [{ title: String, desc: String }],
        default: [
          { title: 'ปลอดภัย', desc: 'ไม่เป็นอันตรายต่อสุขภาพ' },
          { title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์กว่า 10 ปี' },
          { title: 'ได้มาตรฐาน', desc: 'ตามมาตรฐานการทำงาน' },
        ],
      },
    },
    services: {
      sectionTitle: { type: String, default: 'บริการของเรา' },
      items: {
        type: [{ title: String, desc: String, image: String }],
        default: [
          { title: 'ล้างถังเก็บน้ำ', desc: 'ล้างทำความสะอาดถังเก็บน้ำบนดินและใต้ดิน ทุกขนาด เพื่อความสะอาดและปลอดภัย', image: '/article/service_tank_cleaning.png' },
          { title: 'ล้างถังบำบัดน้ำเสีย', desc: 'บริการสูบสิ่งปฏิกูลและทำความสะอาดถังบำบัดน้ำเสีย ขจัดกลิ่นเหม็นสะสม', image: '/article/service_wastewater_tank.png' },
          { title: 'ระบบบำบัดน้ำเสีย', desc: 'ออกแบบ ติดตั้ง และปรับปรุงระบบบำบัดน้ำเสียให้ได้มาตรฐาน เป็นมิตรต่อสิ่งแวดล้อม', image: '/article/service_wastewater_system.png' },
          { title: 'ผู้ควบคุมระบบบำบัดน้ำเสีย', desc: 'บริการดูแลและเดินระบบบำบัดน้ำเสียโดยผู้เชี่ยวชาญเฉพาะทางที่ได้รับใบอนุญาต', image: '/article/service_wastewater_operator.png' },
        ],
      },
    },
    why: {
      title: { type: String, default: 'ทำไมต้องล้างถังเก็บน้ำ' },
      titleColor: { type: String, default: '#0a1628' },
      titleBlue: { type: String, default: 'อย่างน้อยทุก 6 เดือน?' },
      titleBlueColor: { type: String, default: '#1d4ed8' },
      description: { type: String, default: 'ถังเก็บน้ำที่ไม่ได้รับการดูแล จะเป็นแหล่งสะสมของตะกอน สิ่งสกปรก แบคทีเรีย และเชื้อโรคต่างๆ ซึ่งส่งผลกระทบต่อสุขภาพของคุณและคนในครอบครัว' },
      descriptionColor: { type: String, default: '#4b5563' },
      image: { type: String, default: '/article/coversevice.png' },
      symptoms: {
        type: [{ label: String }],
        default: [
          { label: 'ตะกอนดินและสิ่งสกปรก' },
          { label: 'คราบตะไคร่น้ำ' },
          { label: 'แบคทีเรียและเชื้อโรค' },
          { label: 'สนิมและสารตกค้าง' },
        ],
      },
      benefits: {
        type: [{ title: String, desc: String }],
        default: [
          { title: 'สุขภาพดี', desc: 'ลดความเสี่ยงในการเกิดโรค' },
          { title: 'น้ำใส สะอาด', desc: 'ปลอดภัยต่อการอุปโภคบริโภค' },
          { title: 'ยืดอายุการใช้งาน', desc: 'ของถังและระบบน้ำ' },
          { title: 'ประหยัดค่าใช้จ่าย', desc: 'ลดปัญหาการอุดตัน และซ่อมบำรุง' },
        ],
      },
    },
    portfolio: {
      sectionTitle: { type: String, default: 'ผลงานที่ผ่านมา' },
      clients: {
        type: [{ name: String, clientType: String, abbr: String, logo: { type: String, default: '' } }],
        default: [
          { name: 'โรงแรมทวินโลตัส', clientType: 'โรงแรม & รีสอร์ท', abbr: 'TL' },
          { name: 'นิคมอุตสาหกรรมภาคใต้', clientType: 'โรงงานอุตสาหกรรม', abbr: 'SI' },
          { name: 'คอนโด ซีวิว ตรัง', clientType: 'คอนโดมิเนียม', abbr: 'CV' },
          { name: 'โรงพยาบาลตรังรวมแพทย์', clientType: 'โรงพยาบาล', abbr: 'TR' },
          { name: 'เทศบาลนครตรัง', clientType: 'หน่วยงานราชการ', abbr: 'TM' },
          { name: 'ห้างสรรพสินค้าโรบินสัน', clientType: 'ศูนย์การค้า', abbr: 'RB' },
        ],
      },
      gallery: {
        type: [{ src: String, alt: String }],
        default: [
          { src: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?q=80&w=800&auto=format&fit=crop', alt: 'ถังเก็บน้ำขนาดใหญ่ มุมมองทางอากาศ' },
          { src: 'https://images.unsplash.com/photo-1533077162801-86490c593afb?q=80&w=800&auto=format&fit=crop', alt: 'บ่อบำบัดน้ำ มุมมองจากด้านบน' },
          { src: 'https://images.unsplash.com/photo-1541941392960-652036ca567e?q=80&w=800&auto=format&fit=crop', alt: 'หอถังน้ำสูง' },
          { src: 'https://images.unsplash.com/photo-1646488993053-8c182b628696?q=80&w=800&auto=format&fit=crop', alt: 'ถังเก็บน้ำอุตสาหกรรม' },
          { src: 'https://images.unsplash.com/photo-1538474705339-e87de81450e8?q=80&w=800&auto=format&fit=crop', alt: 'ระบบท่อน้ำอุตสาหกรรม' },
          { src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop', alt: 'ท่อระบายน้ำและวาล์ว' },
          { src: 'https://images.unsplash.com/photo-1593260654732-df52bea15d63?q=80&w=800&auto=format&fit=crop', alt: 'ล้างทำความสะอาดด้วยแรงดันสูง' },
          { src: 'https://images.unsplash.com/photo-1639600993675-2281b2c939f0?q=80&w=800&auto=format&fit=crop', alt: 'ระบบท่อน้ำภายในอาคาร' },
        ],
      },
      caseStudy: {
        image: { type: String, default: 'https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=1200&auto=format&fit=crop' },
        title: { type: String, default: 'โครงการล้างถังเก็บน้ำใส นิคมอุตสาหกรรม' },
        description: { type: String, default: 'พบปัญหาคราบสนิมและตะกอนดินสะสมหนาในถังเก็บน้ำขนาด 100,000 ลิตร ส่งผลให้คุณภาพน้ำไม่ได้มาตรฐาน PROBAX ได้เข้าประเมินและวางแผนล้างทำความสะอาดด้วยวิธีที่ปลอดภัย ไม่กระทบการผลิต' },
        duration: { type: String, default: '2 วัน' },
        result: { type: String, default: 'น้ำใสสะอาด 100%' },
      },
    },
    faq: {
      heading: { type: String, default: 'คำถามที่พบบ่อย' },
      headingColor: { type: String, default: '#0a1628' },
      questionColor: { type: String, default: '#0a1628' },
      answerColor: { type: String, default: '#4b5563' },
      items: {
        type: [{ question: String, answer: String }],
        default: [
          { question: 'ควรล้างถังเก็บน้ำทุกกี่เดือน?', answer: 'ตามมาตรฐานกระทรวงสาธารณสุข แนะนำให้ล้างทำความสะอาดถังเก็บน้ำทุกๆ 6 เดือน เพื่อป้องกันการสะสมของตะกอน แบคทีเรีย และตะไคร่น้ำ ที่อาจส่งผลเสียต่อสุขภาพ' },
          { question: 'ใช้เวลาล้างกี่ชั่วโมง?', answer: 'ระยะเวลาในการล้างจะขึ้นอยู่กับขนาดของถังและสภาพความสกปรก โดยปกติจะใช้เวลาประมาณ 2-4 ชั่วโมงต่อถัง (รวมเวลาดูดน้ำออก ล้างทำความสะอาด และฆ่าเชื้อโรค)' },
          { question: 'ต้องเตรียมการอย่างไรบ้างก่อนทีมงานเข้าไป?', answer: 'ลูกค้าไม่ต้องเตรียมการอะไรเป็นพิเศษ ทางทีมงาน PROBAX มีอุปกรณ์เครื่องมือช่างและน้ำยาทำความสะอาดครบชุดไปพร้อมใช้งาน เพียงแค่ช่วยอำนวยความสะดวกในเรื่องพื้นที่จอดรถและทางเข้า-ออกหน้างาน' },
          { question: 'ต้องหยุดใช้น้ำหรือไม่ระหว่างการล้าง?', answer: 'จำเป็นต้องหยุดใช้น้ำชั่วคราวเฉพาะจุดที่ล้างถัง เพื่อให้ทีมงานสามารถดูดน้ำเก่าออกและทำความสะอาดภายในถังได้อย่างเต็มที่ ทางเราแนะนำให้ลูกค้ารองน้ำสำรองไว้ใช้ก่อนทีมงานเข้าดำเนินการ' },
          { question: 'ให้บริการในพื้นที่ใดบ้าง?', answer: 'PROBAX ให้บริการหลักในพื้นที่ กรุงเทพมหานคร และปริมณฑล (นนทบุรี, ปทุมธานี, สมุทรปราการ, สมุทรสาคร) สำหรับพื้นที่จังหวัดอื่นๆ สามารถสอบถามเพิ่มเติมเพื่อประเมินค่าเดินทางได้' },
          { question: 'ค่าบริการเริ่มต้นเท่าไหร่?', answer: 'ค่าบริการจะพิจารณาจากขนาดของถัง (ลิตร) และความยากง่ายของหน้างาน (เช่น ถังบนดิน หรือถังใต้ดิน) โดยสามารถส่งรูปภาพและข้อมูลขนาดถังมาให้ทางเราประเมินราคาเบื้องต้นได้ฟรี' },
        ],
      },
    },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV === 'development' && models.ServicesSettings) {
  delete (models as Record<string, unknown>).ServicesSettings
}

export const ServicesSettings =
  models.ServicesSettings ||
  model<IServicesSettings>('ServicesSettings', ServicesSettingsSchema)
