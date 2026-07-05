import { Schema, model, models } from 'mongoose'

export interface IArticle {
  _id?: string
  title: string
  category: string
  excerpt: string
  published: boolean
  createdAt?: Date
  updatedAt?: Date
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    category: { type: String, default: 'ความรู้ทั่วไป' },
    excerpt: { type: String, default: '' },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Article = models.Article || model<IArticle>('Article', ArticleSchema)
