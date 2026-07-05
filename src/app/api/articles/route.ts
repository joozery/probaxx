import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { Article } from '@/models/Article'

export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const publishedOnly = searchParams.get('published') === 'true'
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = parseInt(searchParams.get('limit') ?? '12')

  const filter: Record<string, unknown> = {}
  if (publishedOnly) filter.published = true
  if (category && category !== 'all') filter.category = category

  const skip = (page - 1) * limit
  const [articles, total] = await Promise.all([
    Article.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Article.countDocuments(filter),
  ])

  return NextResponse.json({ articles, total, page, pages: Math.ceil(total / limit) })
}

function generateSlug(title: string): string {
  // Extract latin/numbers from title, fall back to timestamp
  const latin = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
  const base = latin.length >= 3 ? latin.slice(0, 80) : `article-${Date.now()}`
  return base
}

export async function POST(req: NextRequest) {
  await connectDB()
  const body = await req.json()

  if (!body.slug && body.title) {
    body.slug = generateSlug(body.title)
  }

  // Ensure unique slug
  let slug = body.slug
  let counter = 1
  while (await Article.exists({ slug })) {
    slug = `${body.slug}-${counter++}`
  }
  body.slug = slug

  // Auto readTime from content
  if (body.content) {
    const wordCount = body.content.replace(/<[^>]*>/g, '').split(/\s+/).length
    body.readTime = Math.max(1, Math.ceil(wordCount / 200))
  }

  const article = await Article.create(body)
  return NextResponse.json(article, { status: 201 })
}
