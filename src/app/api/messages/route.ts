import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Message } from '@/models/Message'

export async function GET() {
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
