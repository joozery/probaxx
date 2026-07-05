import { Schema, model, models } from 'mongoose'

export interface IArticle {
  _id?: string
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  author: string
  readTime: number
  published: boolean
  metaTitle: string
  metaDescription: string
  views: number
  createdAt?: Date
  updatedAt?: Date
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, default: 'ความรู้ทั่วไป' },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    tags: [{ type: String }],
    author: { type: String, default: 'ทีม PROBAX' },
    readTime: { type: Number, default: 3 },
    published: { type: Boolean, default: false },
    metaTitle: { type: String, default: '' },
    metaDescription: { type: String, default: '' },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
)

ArticleSchema.index({ published: 1, createdAt: -1 })
ArticleSchema.index({ category: 1, published: 1 })

export const Article = models.Article || model<IArticle>('Article', ArticleSchema)
