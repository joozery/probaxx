import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Category } from '@/models/Category'
import { requireAdmin } from '@/lib/auth'

const DEFAULT_CATEGORIES = [
  { name: 'ความรู้ทั่วไป', color: 'bg-blue-50 text-blue-700' },
  { name: 'เคล็ดลับ', color: 'bg-green-50 text-green-700' },
  { name: 'กฎหมาย & มาตรฐาน', color: 'bg-red-50 text-red-700' },
  { name: 'เทคนิค', color: 'bg-purple-50 text-purple-700' },
  { name: 'คู่มือผู้ใช้', color: 'bg-orange-50 text-orange-700' },
  { name: 'ราคา & โปรโมชัน', color: 'bg-yellow-50 text-yellow-700' },
  { name: 'สุขภาพ & ความปลอดภัย', color: 'bg-pink-50 text-pink-700' },
]

export async function GET() {
  await connectDB()
  let categories = await Category.find().sort({ createdAt: 1 }).lean()

  // Seed defaults if empty
  if (categories.length === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES)
    categories = await Category.find().sort({ createdAt: 1 }).lean()
  }

  return NextResponse.json(categories)
}

export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { name, color } = await req.json()
  if (!name?.trim()) return NextResponse.json({ error: 'Name required' }, { status: 400 })

  const exists = await Category.findOne({ name: name.trim() })
  if (exists) return NextResponse.json({ error: 'มีหมวดหมู่นี้แล้ว' }, { status: 409 })

  const category = await Category.create({ name: name.trim(), color: color ?? 'bg-gray-50 text-gray-700' })
  return NextResponse.json(category, { status: 201 })
}
