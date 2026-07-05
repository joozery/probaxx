import { Schema, model, models } from 'mongoose'

export interface IService {
  _id?: string
  title: string
  description: string
  icon: string
  active: boolean
  order: number
  createdAt?: Date
  updatedAt?: Date
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    icon: { type: String, default: '💧' },
    active: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Service = models.Service || model<IService>('Service', ServiceSchema)
