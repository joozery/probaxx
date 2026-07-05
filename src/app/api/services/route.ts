import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Service } from '@/models/Service'

export async function GET() {
  await connectDB()
  const services = await Service.find().sort({ order: 1 }).lean()
  return NextResponse.json(services)
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()
  const service = await Service.create(body)
  return NextResponse.json(service, { status: 201 })
}
