import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongoose'
import Admin from '@/models/Admin'

export async function GET() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session) return NextResponse.json(null, { status: 401 })

  await connectDB()
  const admin = await Admin.findById(session).select('name email role')
  if (!admin) return NextResponse.json(null, { status: 401 })

  return NextResponse.json({ name: admin.name, email: admin.email, role: admin.role })
}
