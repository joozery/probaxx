import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Quote } from '@/models/Quote'

export async function GET() {
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
