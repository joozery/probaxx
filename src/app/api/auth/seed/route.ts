import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import Admin from '@/models/Admin'

// สร้าง admin คนแรก — ใช้ได้ครั้งเดียวเมื่อไม่มี admin ในระบบ
export async function GET() {
  await connectDB()
  const count = await Admin.countDocuments()
  if (count > 0) {
    return NextResponse.json({ message: 'มี admin อยู่แล้ว' }, { status: 400 })
  }
  const hashed = await bcrypt.hash('admin1234', 10)
  await Admin.create({
    name: 'Super Admin',
    email: 'admin@probax.co.th',
    password: hashed,
    role: 'superadmin',
    active: true,
  })
  return NextResponse.json({ ok: true, message: 'สร้าง admin สำเร็จ: admin@probax.co.th / admin1234' })
}
