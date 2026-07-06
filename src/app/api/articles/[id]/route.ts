import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Article } from '@/models/Article'
import { requireAdmin } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params

  // Support lookup by MongoDB _id or by slug
  const isObjectId = /^[a-f\d]{24}$/i.test(id)
  const article = isObjectId
    ? await Article.findById(id).lean()
    : await Article.findOne({ slug: id }).lean()

  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(article)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  const body = await req.json()

  // Auto readTime from content
  if (body.content) {
    const wordCount = body.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    body.readTime = Math.max(1, Math.ceil(wordCount / 200))
  }

  const updated = await Article.findByIdAndUpdate(id, body, { new: true })
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(updated)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  await Article.findByIdAndDelete(id)
  return NextResponse.json({ ok: true })
}
