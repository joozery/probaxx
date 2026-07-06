import { Schema, Document, model, models } from 'mongoose'

export interface IHomeSettings extends Document {
  hero: {
    badge: string
    title1: string
    title2: string
    title2Orange: string
    title3: string
    subtitle: string
    image: string
    features: Array<{ label: string }>
    showVideo: boolean
    videoUrl: string
  }
  why: {
    badge: string
    title1: string
    titleOrange: string
    title3: string
    description: string
    image: string
    stats: Array<{ value: string; label: string }>
    cards: Array<{ title: string; desc: string }>
  }
  symptoms: {
    badge: string
    title1: string
    titleOrange: string
    title3: string
    description: string
    infoTitle: string
    infoDesc: string
    items: Array<{ image: string; title: string; desc: string }>
  }
  process: {
    title: string
    titleOrange: string
    steps: Array<{ icon?: string; title: string; desc: string }>
  }
  trust: {
    badge: string
    title1: string
    titleOrange: string
    title3: string
    description: string
    items: Array<{ title: string; desc: string }>
  }
  cta: {
    title1: string
    titleOrange: string
    title3: string
    description: string
    image: string
    features: Array<{ label: string; sub: string }>
    hoursLabel: string
    hours: string
    phone: string
    lineId: string
  }
}

const HomeSettingsSchema = new Schema<IHomeSettings>(
  {
    hero: {
      badge: { type: String, default: 'Professional Service' },
      title1: { type: String, default: 'PROFESSIONAL' },
      title2: { type: String, default: 'WATER ' },
      title2Orange: { type: String, default: 'TANK' },
      title3: { type: String, default: 'CLEANING' },
      subtitle: { type: String, default: 'ผู้เชี่ยวชาญงานล้างถังเก็บน้ำและถังบำบัดน้ำเสีย' },
      image: { type: String, default: '/cover/cover.png' },
      showVideo: { type: Boolean, default: false },
      videoUrl: { type: String, default: '' },
      features: {
        type: [{ label: String }],
        default: [
          { label: 'ปลอดภัย ได้มาตรฐาน' },
          { label: 'ทีมงานมืออาชีพ ประสบการณ์สูง' },
          { label: 'ตรวจสอบคุณภาพน้ำ ก่อน-หลังล้าง' },
          { label: 'เป็นมิตรต่อสิ่งแวดล้อม ใช้อุปกรณ์ปลอดภัย' },
        ],
      },
    },
    why: {
      badge: { type: String, default: 'Why Clean Regularly' },
      title1: { type: String, default: 'ทำไมต้อง' },
      titleOrange: { type: String, default: 'ล้างถังเก็บน้ำ' },
      title3: { type: String, default: 'เป็นประจำ?' },
      description: { type: String, default: 'การล้างถังเก็บน้ำและถังบำบัดน้ำเสียอย่างสม่ำเสมอ ช่วยให้ระบบน้ำทำงานได้อย่างมีประสิทธิภาพ น้ำสะอาดปลอดภัย และยืดอายุการใช้งานของระบบ' },
      image: { type: String, default: '/cover/coverwhy.png' },
      stats: {
        type: [{ value: String, label: String }],
        default: [
          { value: '10+', label: 'ปีประสบการณ์' },
          { value: '500+', label: 'โปรเจกต์สำเร็จ' },
          { value: '100%', label: 'ลูกค้าพึงพอใจ' },
        ],
      },
      cards: {
        type: [{ title: String, desc: String }],
        default: [
          { title: 'ความสะอาด', desc: 'ขจัดตะกอนสกปรก แบคทีเรีย และสิ่งปนเปื้อนในน้ำให้หมดจด' },
          { title: 'คุณภาพน้ำ', desc: 'น้ำสะอาด ปลอดภัย เหมาะสำหรับการอุปโภคและบริโภคทุกวัน' },
          { title: 'ลดตะกอน', desc: 'ลดการสะสมของตะกอน สิ่งสกปรก และตะไคร่ภายในถัง' },
          { title: 'ยืดอายุระบบ', desc: 'ยืดอายุการใช้งานถังและระบบน้ำ ให้ทำงานได้ยาวนานขึ้น' },
        ],
      },
    },
    symptoms: {
      badge: { type: String, default: 'Warning Signs' },
      title1: { type: String, default: 'อาการที่บ่งบอกว่า' },
      titleOrange: { type: String, default: 'ควรล้างถัง' },
      title3: { type: String, default: 'ได้แล้ว' },
      description: { type: String, default: 'หากพบอาการเหล่านี้ ควรติดต่อผู้เชี่ยวชาญ เพื่อตรวจสอบและล้างถังโดยเร็ว' },
      infoTitle: { type: String, default: 'การล้างถังเก็บน้ำเป็นประจำ' },
      infoDesc: { type: String, default: 'ช่วยให้คุณและครอบครัว ปลอดภัยจากสิ่งปนเปื้อน และมั่นใจในคุณภาพน้ำที่ดีในทุกวัน' },
      items: {
        type: [{ image: String, title: String, desc: String }],
        default: [
          { image: '/symptoms/smell.png', title: 'น้ำมีกลิ่น', desc: 'กลิ่นเหม็น อับ หรือ ผิดปกติจากน้ำประปา' },
          { image: '/symptoms/turbid.png', title: 'น้ำขุ่น', desc: 'น้ำขุ่น มีสิ่ง ตกตะกอนปนเปื้อน' },
          { image: '/symptoms/sediment.png', title: 'มีตะกอน', desc: 'ตะกอน ตะไคร่ หรือ สนิมเกาะผนังถัง' },
          { image: '/symptoms/overdue.png', title: 'ไม่เคยล้างเกิน 1 ปี', desc: 'ไม่ได้ทำความสะอาด มากกว่า 1 ปี' },
        ],
      },
    },
    process: {
      title: { type: String, default: 'มาตรฐานการให้บริการ' },
      titleOrange: { type: String, default: 'ของเรา' },
      steps: {
        type: [{ icon: String, title: String, desc: String }],
        default: [
          { icon: '', title: 'ประเมินหน้างาน', desc: 'สำรวจหน้างานและ ตรวจสอบอุปกรณ์เบื้องต้น' },
          { icon: '', title: 'วางแผนการทำงาน', desc: 'วางแผนและเตรียมอุปกรณ์ สารเคมีและอุปกรณ์ล้าง' },
          { icon: '', title: 'ล้างทำความสะอาด', desc: 'ล้างตะกอน สิ่งปนเปื้อน และสิ่งปนเปื้อนอย่างละเอียด' },
          { icon: '', title: 'ตรวจสอบคุณภาพน้ำ', desc: 'ตรวจสอบคุณภาพน้ำ ก่อน-หลังล้าง' },
          { icon: '', title: 'สรุปรายงานผล', desc: 'สรุปรายงานผล พร้อมรายงานการตรวจสอบ' },
          { icon: '', title: 'บริการหลังการขาย', desc: 'ติดตามผล แก้ไขปัญหา และพร้อมให้บริการ' },
        ],
      },
    },
    trust: {
      badge: { type: String, default: 'Why Trust Us' },
      title1: { type: String, default: 'มั่นใจในมาตรฐาน' },
      titleOrange: { type: String, default: 'ปลอดภัย 100%' },
      title3: { type: String, default: 'ด้วยทีมงานมืออาชีพ' },
      description: { type: String, default: 'เราใส่ใจทุกขั้นตอน ด้วยทีมงานที่ผ่านการฝึกอบรม และมีใบรับรองมาตรฐาน เพื่อให้คุณมั่นใจได้ 100% ในความสะอาด ปลอดภัย และได้มาตรฐานทุกครั้ง' },
      items: {
        type: [{ title: String, desc: String }],
        default: [
          { title: 'ปลอดภัย', desc: 'ใช้อุปกรณ์ป้องกันครบชุด ปลอดภัยต่อผู้ใช้งาน' },
          { title: 'ใส่ใจทุกรายละเอียด', desc: 'ใส่ใจในทุกรายละเอียดของงาน ทำความสะอาดทุกจุด' },
          { title: 'มาตรฐานสากล', desc: 'ดำเนินงานตามมาตรฐาน ISO และ GMP' },
          { title: 'เป็นมิตรต่อสิ่งแวดล้อม', desc: 'ใช้น้ำยามาตรฐาน ไม่เป็นอันตราย ต่อสิ่งแวดล้อม' },
        ],
      },
    },
    cta: {
      title1: { type: String, default: 'ให้เราดูแล' },
      titleOrange: { type: String, default: 'ระบบน้ำ' },
      title3: { type: String, default: 'ของคุณ' },
      description: { type: String, default: 'สะอาด ปลอดภัย ได้มาตรฐาน ใส่ใจทุกรายละเอียด' },
      image: { type: String, default: '/cover/ctabg.png' },
      features: {
        type: [{ label: String, sub: String }],
        default: [
          { label: 'ปลอดภัย', sub: 'ทีมงานมืออาชีพ' },
          { label: 'ได้มาตรฐาน', sub: 'มาตรฐานสากล' },
          { label: 'ใส่ใจทุกขั้นตอน', sub: 'บริการด้วยใจ' },
        ],
      },
      hoursLabel: { type: String, default: 'พร้อมให้บริการ ทุกวัน' },
      hours: { type: String, default: '08.00 – 18.00 น.' },
      phone: { type: String, default: '085-556-4994' },
      lineId: { type: String, default: '@probax' },
    },
  },
  { timestamps: true }
)

if (process.env.NODE_ENV === 'development' && models.HomeSettings) {
  delete (models as Record<string, unknown>).HomeSettings
}

export const HomeSettings =
  models.HomeSettings ||
  model<IHomeSettings>('HomeSettings', HomeSettingsSchema)
