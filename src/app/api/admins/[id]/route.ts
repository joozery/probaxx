import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongoose'
import Admin from '@/models/Admin'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10)
  } else {
    delete body.password
  }
  const admin = await Admin.findByIdAndUpdate(id, body, { new: true }).select('-password')
  return NextResponse.json(admin)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await Admin.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
