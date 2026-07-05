import { Schema, model, models } from 'mongoose'

export interface IQuote {
  _id?: string
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
  status: 'pending' | 'inprogress' | 'done' | 'cancelled'
  createdAt?: Date
  updatedAt?: Date
}

const QuoteSchema = new Schema<IQuote>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    service: { type: String, default: '' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'inprogress', 'done', 'cancelled'], default: 'pending' },
  },
  { timestamps: true }
)

export const Quote = models.Quote || model<IQuote>('Quote', QuoteSchema)
