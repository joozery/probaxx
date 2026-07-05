import mongoose, { Schema, model, models } from 'mongoose'

export interface IMessage {
  _id?: string
  name: string
  phone: string
  email?: string
  service?: string
  message: string
  status: 'new' | 'read' | 'contacted'
  createdAt?: Date
  updatedAt?: Date
}

const MessageSchema = new Schema<IMessage>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    service: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'contacted'], default: 'new' },
  },
  { timestamps: true }
)

export const Message = models.Message || model<IMessage>('Message', MessageSchema)
