import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { connectDB } from '@/lib/mongoose'
import { HomeSettings } from '@/models/HomeSettings'

export async function GET() {
  try {
    await connectDB()
    let settings = await HomeSettings.findOne().lean()
    if (!settings) {
      const doc = new HomeSettings({})
      await doc.save()
      settings = doc.toObject()
    }
    return NextResponse.json(settings)
  } catch (e) {
    console.error('[home-settings GET]', e)
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
  const settings = await HomeSettings.findOneAndUpdate(
    {},
    { $set: body },
    { new: true, upsert: true }
  )
  
  // Clear Next.js cache for the home page
  revalidatePath('/')
  
  return NextResponse.json(settings)
}
