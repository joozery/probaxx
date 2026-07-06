import { Schema, Document, model, models } from 'mongoose'

export interface IContactSettings extends Document {
  info: {
    phone: string
    phoneContactName: string
    lineId: string
    email: string
    address: string
    companyName: string
    hoursLine1: string
    hoursLine2: string
  }
  hero: {
    badge: string
    title: string
    description: string
    image: string
  }
  quickBar: {
    text: string
  }
  cta: {
    title: string
    description: string
  }
}

const ContactSettingsSchema = new Schema<IContactSettings>(
  {
    info: {
      phone: { type: String, default: '085-556-4994' },
      phoneContactName: { type: String, default: 'ก้อง' },
      lineId: { type: String, default: '@probax' },
      email: { type: String, default: 'contact@probax.co.th' },
      address: { type: String, default: '155/10 หมู่ที่ 3 ต.บ้านโพธิ์ อ.เมืองตรัง จ.ตรัง 92000' },
      companyName: { type: String, default: 'บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด' },
      hoursLine1: { type: String, default: 'จันทร์ – เสาร์: 08:00 – 17:00 น.' },
      hoursLine2: { type: String, default: 'หยุดวันอาทิตย์และวันหยุดนักขัตฤกษ์' },
    },
    hero: {
      badge: { type: String, default: 'GET IN TOUCH' },
      title: { type: String, default: 'ติดต่อเรา' },
      description: { type: String, default: 'ทีมงาน PRO BAX พร้อมให้คำปรึกษา ประเมินราคา และให้บริการแก้ไขปัญหาระบบน้ำแบบครบวงจร ทักมาคุยกับเราได้เลยครับ' },
      image: { type: String, default: '/cover/contact_hero.png' },
    },
    quickBar: {
      text: { type: String, default: 'ต้องการความช่วยเหลือด่วน? เราพร้อมตอบทุกวัน จ.–ส. 08:00–17:00 น.' },
    },
    cta: {
      title: { type: String, default: 'พร้อมเริ่มต้นดูแลระบบน้ำของคุณ?' },
      description: { type: String, default: 'ขอรับคำปรึกษาฟรี ทีมงาน PRO BAX พร้อมออกสำรวจและประเมินราคาให้ถึงที่โดยไม่มีค่าใช้จ่าย' },
    },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV === 'development' && models.ContactSettings) {
  delete (models as Record<string, unknown>).ContactSettings
}

export const ContactSettings =
  models.ContactSettings ||
  model<IContactSettings>('ContactSettings', ContactSettingsSchema)
