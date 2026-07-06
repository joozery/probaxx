import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import FooterSettings from '@/models/FooterSettings'
import { requireAdmin } from '@/lib/auth'

const DEFAULT = {
  logo: '/logo/logo.jpeg',
  description: 'ผู้เชี่ยวชาญงานล้างถังเก็บน้ำและถังบำบัดน้ำเสีย ด้วยทีมงานมืออาชีพที่ผ่านการฝึกอบรม มาตรฐานสูง เพื่อคุณภาพน้ำที่สะอาดและปลอดภัยสำหรับคุณและครอบครัว',
  certifications: ['ISO 9001', 'มาตรฐาน กรมอนามัย', 'ใบอนุญาต อย.'],
  socialLinks: [
    { label: 'Facebook', url: '#' },
    { label: 'YouTube', url: '#' },
  ],
  serviceLinks: [
    { label: 'ล้างถังเก็บน้ำ', href: '#services' },
    { label: 'ล้างถังบำบัดน้ำเสีย', href: '#services' },
    { label: 'ทำความสะอาดระบบน้ำ', href: '#services' },
    { label: 'ตรวจสอบคุณภาพน้ำ', href: '#services' },
  ],
  companyLinks: [
    { label: 'เกี่ยวกับเรา', href: '#about' },
    { label: 'ผลงานของเรา', href: '#portfolio' },
    { label: 'บทความ', href: '#blog' },
    { label: 'ติดต่อเรา', href: '#contact' },
  ],
  contact: {
    address: '155/10 หมู่ที่ 3 ต.บ้านโพธิ์ อ.เมืองตรัง จ.ตรัง 92000',
    phone: '085-556-4994',
    companyName: 'บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด',
    lineId: '@probax',
    email: '',
  },
  copyright: '© 2025 บริษัท มั่นคงวอเตอร์ซัพพลายส์ จำกัด All Rights Reserved.',
}

export async function GET() {
  await connectDB()
  let settings = await FooterSettings.findOne()
  if (!settings) {
    settings = await FooterSettings.create(DEFAULT)
  }
  return NextResponse.json(settings)
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  let settings = await FooterSettings.findOne()
  if (!settings) {
    settings = await FooterSettings.create({ ...DEFAULT, ...body })
  } else {
    Object.assign(settings, body)
    await settings.save()
  }
  return NextResponse.json(settings)
}
