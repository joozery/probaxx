import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { PageSettings } from '@/models/PageSettings'

const DEFAULTS: Record<string, Omit<import('@/models/PageSettings').IPageSettings, '_id' | 'page'>> = {
  articles: {
    heroTitle: 'บทความ & ข่าวสาร',
    heroDescription: 'รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้',
    heroImage: '/cover/heroarticle.png',
    heroOverlay: 40,
  },
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  await connectDB()
  const { page } = await params
  let settings = await PageSettings.findOne({ page }).lean()
  if (!settings) {
    const defaults = DEFAULTS[page] ?? { heroTitle: '', heroDescription: '', heroImage: '', heroOverlay: 40 }
    settings = await PageSettings.create({ page, ...defaults })
  }
  return NextResponse.json(settings)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  await connectDB()
  const { page } = await params
  const body = await req.json()
  const settings = await PageSettings.findOneAndUpdate(
    { page },
    { $set: body },
    { new: true, upsert: true }
  )
  return NextResponse.json(settings)
}
