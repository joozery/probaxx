import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongoose'
import { AboutSettings } from '@/models/AboutSettings'

export async function GET() {
  try {
    await connectDB()
    let settings = await AboutSettings.findOne().lean()
    if (!settings) {
      const doc = new AboutSettings({})
      await doc.save()
      settings = doc.toObject()
    }
    return NextResponse.json(settings)
  } catch (e) {
    console.error('[about-settings GET]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  const settings = await AboutSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  )
  
  revalidatePath('/about')
  
  return NextResponse.json(settings)
}
