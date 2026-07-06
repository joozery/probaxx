import mongoose, { Schema } from 'mongoose'

const FooterSettingsSchema = new Schema(
  {
    logo: { type: String, default: '/logo/logo.jpeg' },
    description: { type: String, default: '' },
    certifications: [{ type: String }],
    socialLinks: [{ label: String, url: String }],
    serviceLinks: [{ label: String, href: String }],
    companyLinks: [{ label: String, href: String }],
    contact: {
      address: { type: String, default: '' },
      phone: { type: String, default: '' },
      companyName: { type: String, default: '' },
      lineId: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    copyright: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.models.FooterSettings || mongoose.model('FooterSettings', FooterSettingsSchema)
