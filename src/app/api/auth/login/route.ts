import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import Admin from '@/models/Admin'

export async function POST(req: Request) {
  await connectDB()
  const { email, password } = await req.json()

  const admin = await Admin.findOne({ email: email.toLowerCase(), active: true })
  if (!admin) {
    return NextResponse.json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
  }

  const match = await bcrypt.compare(password, admin.password)
  if (!match) {
    return NextResponse.json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 })
  }

  const cookieStore = await cookies()
  cookieStore.set('admin_session', admin._id.toString(), {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  return NextResponse.json({ ok: true, name: admin.name, role: admin.role })
}
