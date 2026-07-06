import { Schema, Document, model, models } from 'mongoose'

export interface IAboutSettings extends Document {
  hero: {
    badge: string
    title: string
    titleBlue: string
    description: string
    image: string
  }
  why: {
    label: string
    title: string
    items: Array<{ title: string; desc: string }>
  }
  equipment: {
    label: string
    title: string
    titleBlue: string
    description: string
    image: string
    items: Array<{ title: string }>
  }
}

const AboutSettingsSchema = new Schema<IAboutSettings>(
  {
    hero: {
      badge: { type: String, default: 'ABOUT PRO BAX' },
      title: { type: String, default: 'เกี่ยวกับเรา' },
      titleBlue: { type: String, default: 'ผู้เชี่ยวชาญด้านระบบน้ำตัวจริง' },
      description: { type: String, default: 'เราคือผู้นำด้านบริการทำความสะอาดและดูแลรักษาระบบน้ำครบวงจร ด้วยประสบการณ์ที่ยาวนาน และทีมงานมืออาชีพที่พร้อมดูแลคุณด้วยมาตรฐานสูงสุด' },
      image: { type: String, default: '/cover/about_hero.png' },
    },
    why: {
      label: { type: String, default: 'WHY CHOOSE US' },
      title: { type: String, default: 'ทำไมต้องเลือก PRO BAX' },
      items: {
        type: [{ title: String, desc: String }],
        default: [
          { title: 'ทีมงานมืออาชีพ', desc: 'ช่างผู้เชี่ยวชาญ ผ่านการอบรมด้านระบบน้ำและพื้นที่อับอากาศ' },
          { title: 'มาตรฐานความปลอดภัย', desc: 'ปฏิบัติงานตามหลักความปลอดภัยสูงสุด (จป.วิชาชีพ ควบคุม)' },
          { title: 'เครื่องมือครบ', desc: 'อุปกรณ์ที่ทันสมัย ได้มาตรฐานอุตสาหกรรม พร้อมสำหรับทุกหน้างาน' },
          { title: 'ฉีด ฆ่าเชื้อทุกครั้ง', desc: 'ทำความสะอาดและพ่นน้ำยาฆ่าเชื้อที่ได้มาตรฐาน ปลอดภัยต่อการบริโภค' },
          { title: 'ตรวจวัดค่าน้ำหลังดำเนินการ', desc: 'มีกระบวนการตรวจสอบคุณภาพน้ำ ก่อนส่งมอบงานให้ลูกค้าทุกครั้ง' },
          { title: 'ประสบการณ์ด้านระบบน้ำ', desc: 'เชี่ยวชาญเฉพาะทางในเรื่องการบริหารและจัดการระบบน้ำมากกว่า 10 ปี' },
        ],
      },
    },
    equipment: {
      label: { type: String, default: 'SAFETY FIRST' },
      title: { type: String, default: 'อุปกรณ์และความปลอดภัย' },
      titleBlue: { type: String, default: 'ครบครันระดับสากล' },
      description: { type: String, default: 'เราให้ความสำคัญกับความปลอดภัยเป็นอันดับหนึ่ง จึงจัดเตรียมอุปกรณ์และเครื่องมือที่ทันสมัย ครบครันสำหรับทุกรูปแบบงาน เพื่อให้มั่นใจได้ว่าการปฏิบัติงานจะเป็นไปอย่างราบรื่นและปลอดภัยที่สุด' },
      image: { type: String, default: '/cover/about_equipment.png' },
      items: {
        type: [{ title: String }],
        default: [
          { title: 'เครื่องฉีดแรงดันสูง' },
          { title: 'ปั๊มสูบน้ำ สูบตะกอน' },
          { title: 'เครื่องตรวจวัดก๊าซ' },
          { title: 'PPE (ชุดนิรภัย)' },
          { title: 'พัดลมระบายอากาศ' },
          { title: 'อุปกรณ์งานอับอากาศ' },
        ],
      },
    },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV === 'development' && models.AboutSettings) {
  delete (models as Record<string, unknown>).AboutSettings
}

export const AboutSettings =
  models.AboutSettings ||
  model<IAboutSettings>('AboutSettings', AboutSettingsSchema)
