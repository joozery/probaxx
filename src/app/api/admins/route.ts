import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import Admin from '@/models/Admin'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const admins = await Admin.find().select('-password').sort({ createdAt: -1 })
  return NextResponse.json(admins)
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  const hashed = await bcrypt.hash(body.password, 10)
  const admin = await Admin.create({ ...body, password: hashed })
  const { password: _, ...safe } = admin.toObject()
  return NextResponse.json(safe, { status: 201 })
}
