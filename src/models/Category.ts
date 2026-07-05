import { Schema, model, models } from 'mongoose'

export interface ICategory {
  _id?: string
  name: string
  color: string
  createdAt?: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    color: { type: String, default: 'bg-blue-50 text-blue-700' },
  },
  { timestamps: true }
)

export const Category = models.Category || model<ICategory>('Category', CategorySchema)
