import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongoose'
import { PortfolioSettings } from '@/models/PortfolioSettings'

export async function GET() {
  try {
    await connectDB()
    let settings = await PortfolioSettings.findOne().lean()
    if (!settings) {
      const doc = new PortfolioSettings({})
      await doc.save()
      settings = doc.toObject()
    }
    return NextResponse.json(settings)
  } catch (e) {
    console.error('[portfolio-settings GET]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const cookieStore = await cookies()
  if (!cookieStore.get('admin_session')?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const settings = await PortfolioSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  )
  return NextResponse.json(settings)
}
