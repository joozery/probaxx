import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongoose'
import { ContactSettings } from '@/models/ContactSettings'

export async function GET() {
  try {
    await connectDB()
    let settings = await ContactSettings.findOne().lean()
    if (!settings) {
      const doc = new ContactSettings({})
      await doc.save()
      settings = doc.toObject()
    }
    return NextResponse.json(settings)
  } catch (e) {
    console.error('[contact-settings GET]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  const settings = await ContactSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  )
  
  revalidatePath('/contact')
  revalidatePath('/', 'layout') // Since contact data is often used globally
  
  return NextResponse.json(settings)
}
