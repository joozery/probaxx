import mongoose, { Schema } from 'mongoose'

const ChannelSchema = new Schema(
  {
    type: { type: String, required: true },
    value: { type: String, default: '' },
    enabled: { type: Boolean, default: true },
  },
  { _id: false }
)

const ContactWidgetSchema = new Schema(
  {
    enabled: { type: Boolean, default: true },
    position: { type: String, default: 'right' }, // 'left' | 'right'
    channels: { type: [ChannelSchema], default: [] },
  },
  { timestamps: true }
)

export default mongoose.models.ContactWidget || mongoose.model('ContactWidget', ContactWidgetSchema)
