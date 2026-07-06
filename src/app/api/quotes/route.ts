import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Quote } from '@/models/Quote'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const quotes = await Quote.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json(quotes)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const quote = await Quote.create(body)
  return NextResponse.json(quote, { status: 201 })
}
