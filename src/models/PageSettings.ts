import { Schema, model, models } from 'mongoose'

export interface IPageSettings {
  _id?: string
  page: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  heroOverlay: number
}

const PageSettingsSchema = new Schema<IPageSettings>(
  {
    page: { type: String, required: true, unique: true, trim: true },
    heroTitle: { type: String, default: '' },
    heroDescription: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    heroOverlay: { type: Number, default: 40, min: 0, max: 90 },
  },
  { timestamps: true }
)

export const PageSettings = models.PageSettings || model<IPageSettings>('PageSettings', PageSettingsSchema)
