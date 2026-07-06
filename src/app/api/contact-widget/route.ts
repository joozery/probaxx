import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import ContactWidget from '@/models/ContactWidget'
import { requireAdmin } from '@/lib/auth'

const DEFAULT = {
  enabled: true,
  position: 'right',
  channels: [
    { type: 'phone', value: '085-556-4994', enabled: true },
    { type: 'line', value: '@probax', enabled: true },
    { type: 'messenger', value: '', enabled: false },
    { type: 'facebook', value: '', enabled: false },
  ],
}

export async function GET() {
  await connectDB()
  let settings = await ContactWidget.findOne()
  if (!settings) settings = await ContactWidget.create(DEFAULT)
  return NextResponse.json(settings)
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  let settings = await ContactWidget.findOne()
  if (!settings) {
    settings = await ContactWidget.create({ ...DEFAULT, ...body })
  } else {
    Object.assign(settings, body)
    await settings.save()
  }
  return NextResponse.json(settings)
}
