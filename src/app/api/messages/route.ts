import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Message } from '@/models/Message'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const messages = await Message.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(messages)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const msg = await Message.create(body)
  return NextResponse.json(msg, { status: 201 })
}
