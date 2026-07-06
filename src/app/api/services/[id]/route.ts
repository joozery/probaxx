import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Service } from '@/models/Service'
import { requireAdmin } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  const body = await req.json()
  const updated = await Service.findByIdAndUpdate(id, body, { new: true })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  await Service.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
