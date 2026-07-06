// Shared config for the floating contact widget — used by both the public
// widget and the admin settings page.

export type ChannelType =
  | 'phone'
  | 'line'
  | 'messenger'
  | 'facebook'
  | 'whatsapp'
  | 'email'
  | 'instagram'
  | 'tiktok'

export interface Channel {
  type: ChannelType
  value: string
  enabled: boolean
}

export const CHANNEL_META: Record<
  ChannelType,
  { label: string; color: string; placeholder: string; hint: string }
> = {
  phone: { label: 'โทรศัพท์', color: '#22c55e', placeholder: '085-556-4994', hint: 'เบอร์โทรศัพท์' },
  line: { label: 'LINE', color: '#06c755', placeholder: '@probax', hint: 'LINE ID (เช่น @probax) หรือวาง URL เต็ม' },
  messenger: { label: 'Messenger', color: '#0084ff', placeholder: 'ชื่อเพจ', hint: 'ชื่อเพจ (m.me/ชื่อ) หรือวาง URL เต็ม' },
  facebook: { label: 'Facebook', color: '#1877f2', placeholder: 'ชื่อเพจ', hint: 'ชื่อเพจ หรือวาง URL เต็ม' },
  whatsapp: { label: 'WhatsApp', color: '#25d366', placeholder: '66855564994', hint: 'เบอร์รูปแบบสากล ไม่มีเครื่องหมาย +' },
  email: { label: 'อีเมล', color: '#ef4444', placeholder: 'info@probax.co.th', hint: 'อีเมล' },
  instagram: { label: 'Instagram', color: '#e4405f', placeholder: 'username', hint: 'ชื่อผู้ใช้ หรือวาง URL เต็ม' },
  tiktok: { label: 'TikTok', color: '#111827', placeholder: 'username', hint: 'ชื่อผู้ใช้ หรือวาง URL เต็ม' },
}

// Display / configuration order
export const CHANNEL_ORDER: ChannelType[] = [
  'phone',
  'line',
  'messenger',
  'facebook',
  'whatsapp',
  'email',
  'instagram',
  'tiktok',
]

// Turn a stored value into a usable href. Accepts either a bare handle/number
// or a full URL (which is passed through untouched).
export function channelHref(type: ChannelType, value: string): string {
  const v = value.trim()
  const isUrl = /^https?:\/\//i.test(v)
  switch (type) {
    case 'phone':
      return `tel:${v.replace(/[^0-9+]/g, '')}`
    case 'email':
      return `mailto:${v}`
    case 'whatsapp':
      return `https://wa.me/${v.replace(/[^0-9]/g, '')}`
    case 'line':
      return isUrl ? v : `https://line.me/R/ti/p/${encodeURIComponent(v)}`
    case 'messenger':
      return isUrl ? v : `https://m.me/${v.replace(/^@/, '')}`
    case 'facebook':
      return isUrl ? v : `https://facebook.com/${v.replace(/^@/, '')}`
    case 'instagram':
      return isUrl ? v : `https://instagram.com/${v.replace(/^@/, '')}`
    case 'tiktok':
      return isUrl ? v : `https://tiktok.com/@${v.replace(/^@/, '')}`
    default:
      return v
  }
}
