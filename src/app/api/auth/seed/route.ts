import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import Admin from '@/models/Admin'

// สร้าง admin คนแรก — ใช้ได้ครั้งเดียวเมื่อไม่มี admin ในระบบ
// ต้องแนบ ?secret=<SEED_SECRET> ให้ตรงกับ env เพื่อป้องกันคนนอกยิง endpoint นี้
export async function GET(req: NextRequest) {
  const seedSecret = process.env.SEED_SECRET
  const provided = req.nextUrl.searchParams.get('secret')
  if (!seedSecret || provided !== seedSecret) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await connectDB()
  const count = await Admin.countDocuments()
  if (count > 0) {
    return NextResponse.json({ message: 'มี admin อยู่แล้ว' }, { status: 400 })
  }

  const email = process.env.SEED_ADMIN_EMAIL
  const password = process.env.SEED_ADMIN_PASSWORD
  if (!email || !password) {
    return NextResponse.json(
      { error: 'ต้องตั้งค่า SEED_ADMIN_EMAIL และ SEED_ADMIN_PASSWORD ใน environment' },
      { status: 400 },
    )
  }

  const hashed = await bcrypt.hash(password, 10)
  await Admin.create({
    name: 'Super Admin',
    email: email.toLowerCase(),
    password: hashed,
    role: 'superadmin',
    active: true,
  })
  return NextResponse.json({ ok: true, message: `สร้าง admin สำเร็จ: ${email}` })
}
