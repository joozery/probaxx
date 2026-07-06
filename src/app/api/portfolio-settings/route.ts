import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
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
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  const settings = await PortfolioSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  )
  
  revalidatePath('/portfolio')
  revalidatePath('/services') // Because services uses portfolio data
  
  return NextResponse.json(settings)
}
