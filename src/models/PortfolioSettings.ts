import { Schema, Document, model, models } from 'mongoose'

export interface IPortfolioSettings extends Document {
  hero: {
    badge: string
    title: string
    titleOrange: string
    description: string
  }
  stats: Array<{ value: string; label: string }>
  items: Array<{ src: string; images: string[]; title: string; category: string; tag: string; desc: string }>
  caseStudy: {
    label: string
    title: string
    description: string
    image: string
    stat1Value: string
    stat1Label: string
    stat2Value: string
    stat2Label: string
  }
}

const PortfolioSettingsSchema = new Schema<IPortfolioSettings>(
  {
    hero: {
      badge: { type: String, default: 'Our Portfolio' },
      title: { type: String, default: 'ผลงาน' },
      titleOrange: { type: String, default: 'ของเรา' },
      description: { type: String, default: 'เราภาคภูมิใจในทุกผลงานที่ได้รับความไว้วางใจ จากลูกค้าทั่วภาคใต้กว่า 500 โครงการ' },
    },
    stats: {
      type: [{ value: String, label: String }],
      default: [
        { value: '500+', label: 'โครงการสำเร็จ' },
        { value: '10,000+', label: 'ลูกค้าพึงพอใจ' },
        { value: '15+', label: 'ปีประสบการณ์' },
        { value: '100%', label: 'มาตรฐานทุกงาน' },
      ],
    },
    items: {
      type: [{ src: String, images: [String], title: String, category: String, tag: String, desc: String }],
      default: [
        { src: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?q=80&w=800&auto=format&fit=crop', images: [], title: 'โรงแรมทวินโลตัส นครศรีฯ', category: 'โรงแรม & รีสอร์ท', tag: 'ล้างถังเก็บน้ำ', desc: 'ล้างถังเก็บน้ำขนาด 50,000 ลิตร พร้อมตรวจสอบคุณภาพน้ำหลังการทำความสะอาด' },
        { src: 'https://images.unsplash.com/photo-1533077162801-86490c593afb?q=80&w=800&auto=format&fit=crop', images: [], title: 'นิคมอุตสาหกรรมภาคใต้', category: 'โรงงานอุตสาหกรรม', tag: 'ระบบบำบัดน้ำ', desc: 'ติดตั้งและดูแลระบบบำบัดน้ำเสียสำหรับโรงงานอุตสาหกรรมขนาดใหญ่' },
        { src: 'https://images.unsplash.com/photo-1541941392960-652036ca567e?q=80&w=800&auto=format&fit=crop', images: [], title: 'คอนโด ซีวิว ตรัง', category: 'คอนโดมิเนียม', tag: 'ติดตั้งระบบน้ำ', desc: 'วางระบบท่อน้ำและติดตั้งถังเก็บน้ำสำรองสำหรับอาคารสูง 20 ชั้น' },
        { src: 'https://images.unsplash.com/photo-1646488993053-8c182b628696?q=80&w=800&auto=format&fit=crop', images: [], title: 'โรงพยาบาลตรังรวมแพทย์', category: 'โรงพยาบาล', tag: 'ล้างถังน้ำ + บำบัด', desc: 'ทำความสะอาดระบบน้ำทั้งหมดตามมาตรฐานสาธารณสุข เพื่อความปลอดภัยของผู้ป่วย' },
        { src: 'https://images.unsplash.com/photo-1538474705339-e87de81450e8?q=80&w=800&auto=format&fit=crop', images: [], title: 'เทศบาลนครตรัง', category: 'ราชการ', tag: 'ระบบประปา', desc: 'ดูแลและซ่อมบำรุงระบบประปาชุมชน ครอบคลุมพื้นที่กว่า 3,000 ครัวเรือน' },
        { src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop', images: [], title: 'ห้างโรบินสัน สาขาตรัง', category: 'โรงแรม & รีสอร์ท', tag: 'ทำความสะอาดระบบ', desc: 'บำรุงรักษาระบบน้ำหล่อเย็นและตรวจสอบคุณภาพน้ำประจำปี' },
        { src: 'https://images.unsplash.com/photo-1593260654732-df52bea15d63?q=80&w=800&auto=format&fit=crop', images: [], title: 'โรงงานอาหารแช่แข็ง ตรัง', category: 'โรงงานอุตสาหกรรม', tag: 'ระบบน้ำอุตสาหกรรม', desc: 'ดูแลระบบน้ำสำหรับกระบวนการผลิตอาหาร ตามมาตรฐาน GMP และ HACCP' },
        { src: 'https://images.unsplash.com/photo-1639600993675-2281b2c939f0?q=80&w=800&auto=format&fit=crop', images: [], title: 'คอนโดมิเนียม ลากูน่า', category: 'คอนโดมิเนียม', tag: 'ล้างถังเก็บน้ำ', desc: 'บริการล้างถังน้ำครบวงจร พร้อมออกใบรับรองคุณภาพน้ำ' },
        { src: 'https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=800&auto=format&fit=crop', images: [], title: 'โรงพยาบาลส่งเสริมสุขภาพ', category: 'โรงพยาบาล', tag: 'บำบัดน้ำเสีย', desc: 'ติดตั้งระบบบำบัดน้ำเสียครบวงจร พร้อมระบบตรวจสอบอัตโนมัติ' },
      ],
    },
    caseStudy: {
      label: { type: String, default: 'Featured Case Study' },
      title: { type: String, default: 'โครงการล้างถังน้ำ นิคมอุตสาหกรรมภาคใต้' },
      description: { type: String, default: 'ถังขนาด 100,000 ลิตร พบคราบสนิมและตะกอนหนา PROBAX เข้าแก้ไขสำเร็จใน 2 วัน' },
      image: { type: String, default: 'https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=1400&auto=format&fit=crop' },
      stat1Value: { type: String, default: '2 วัน' },
      stat1Label: { type: String, default: 'ระยะเวลา' },
      stat2Value: { type: String, default: '100%' },
      stat2Label: { type: String, default: 'น้ำใสสะอาด' },
    },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV === 'development' && models.PortfolioSettings) {
  delete (models as Record<string, unknown>).PortfolioSettings
}

export const PortfolioSettings =
  models.PortfolioSettings ||
  model<IPortfolioSettings>('PortfolioSettings', PortfolioSettingsSchema)
