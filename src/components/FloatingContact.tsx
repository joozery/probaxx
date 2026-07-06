'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Phone, Mail } from 'lucide-react'
import { CHANNEL_META, CHANNEL_ORDER, channelHref, type Channel, type ChannelType } from '@/lib/contactChannels'
import { cn } from '@/lib/utils'

interface WidgetSettings {
  enabled: boolean
  position: 'left' | 'right'
  channels: Channel[]
}

// Brand glyphs (24x24, currentColor). phone/email fall back to lucide icons.
const ICON: Partial<Record<ChannelType, React.ReactNode>> = {
  line: <path d="M24 10.3C24 5 18.6.7 12 .7S0 5 0 10.3c0 4.8 4.3 8.8 10 9.6.4.1.9.3 1.1.6.1.3.1.7 0 1l-.2 1c-.1.3-.2 1.2 1 .6 1.3-.5 6.9-4 9.4-7C23.2 14.4 24 12.5 24 10.3M7.7 13.5H5.3c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.1h1.8c.4 0 .6.3.6.6s-.3.7-.6.7m2.4-.6c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6zm5.7 0c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.3l-2.4-3.3v2.9c0 .3-.3.6-.7.6s-.6-.3-.6-.6V8.1c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.5 3.3V8.1c0-.3.3-.6.6-.6s.6.3.6.6zm3.9-3c.3 0 .6.3.6.6s-.3.6-.6.6H18v1.1h1.8c.3 0 .6.3.6.6s-.3.7-.6.7h-2.4c-.3 0-.6-.3-.6-.7V8.1c0-.3.3-.6.6-.6h2.4c.3 0 .6.3.6.6s-.3.6-.6.6H18v1.1z" />,
  messenger: <path d="M12 0C5.4 0 .3 4.9.3 11.4c0 3.4 1.4 6.3 3.7 8.4.2.2.3.4.3.7l.1 2.1c0 .7.7 1.1 1.3.8l2.3-1c.2-.1.5-.1.7 0 1 .3 2.1.4 3.2.4 6.6 0 11.7-4.8 11.7-11.4C23.7 4.9 18.6 0 12 0m7 8.7-3.4 5.4c-.5.9-1.7 1.1-2.5.5l-2.7-2c-.2-.2-.6-.2-.8 0l-3.7 2.8c-.5.4-1.1-.2-.8-.7L8.7 9.3c.5-.9 1.7-1.1 2.5-.5l2.7 2c.2.2.6.2.8 0l3.7-2.8c.5-.4 1.1.2.8.7" />,
  facebook: <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07" />,
  whatsapp: <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4M12 22c-1.8 0-3.5-.5-5-1.4l-3.5.9.9-3.4C3.5 15.6 3 13.8 3 12 3 7 7 3 12 3s9 4 9 9-4 9-9 9m0-20C6 2 1 7 1 12c0 2 .5 3.9 1.5 5.6L1 23l5.5-1.4C8.1 22.5 10 23 12 23c6 0 11-5 11-11S18 2 12 2" />,
  instagram: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32M12 16a4 4 0 110-8 4 4 0 010 8m6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88" />,
  tiktok: <path d="M19.6 6.8a5 5 0 01-3-1v6.8a6.2 6.2 0 11-6.2-6.2h.5V9a3 3 0 00-.5 0 3 3 0 103 3V.5h3a5 5 0 003 4.6z" />,
}

function ChannelIcon({ type }: { type: ChannelType }) {
  if (type === 'phone') return <Phone className="w-5 h-5" strokeWidth={2.2} />
  if (type === 'email') return <Mail className="w-5 h-5" strokeWidth={2.2} />
  return (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden>
      {ICON[type]}
    </svg>
  )
}

export default function FloatingContact() {
  const pathname = usePathname()
  const [settings, setSettings] = useState<WidgetSettings | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fetch('/api/contact-widget')
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (d) setSettings(d)
        // next frame → trigger the slide-in entrance
        requestAnimationFrame(() => setMounted(true))
      })
      .catch(() => {})
  }, [])

  // Never render inside the admin area
  if (pathname?.startsWith('/admin')) return null
  if (!settings || !settings.enabled) return null

  const channels = (settings.channels || [])
    .filter(c => c.enabled && c.value.trim())
    .sort((a, b) => CHANNEL_ORDER.indexOf(a.type) - CHANNEL_ORDER.indexOf(b.type))

  if (channels.length === 0) return null

  const isLeft = settings.position === 'left'

  return (
    <div
      className={cn(
        'fixed top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out',
        isLeft ? 'left-0' : 'right-0',
        mounted ? 'opacity-100 translate-x-0' : cn('opacity-0', isLeft ? '-translate-x-full' : 'translate-x-full')
      )}
    >
      <div
        className={cn(
          'flex flex-col overflow-hidden bg-white/95 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.18)] ring-1 ring-black/5 divide-y divide-black/5',
          isLeft ? 'rounded-r-2xl' : 'rounded-l-2xl'
        )}
      >
        {channels.map((c, i) => {
          const meta = CHANNEL_META[c.type]
          const isTel = c.type === 'phone' || c.type === 'email'
          return (
            <a
              key={`${c.type}-${i}`}
              href={channelHref(c.type, c.value)}
              target={isTel ? undefined : '_blank'}
              rel="noopener noreferrer"
              title={meta.label}
              aria-label={meta.label}
              className={cn('group relative flex items-center', isLeft ? 'flex-row' : 'flex-row-reverse')}
            >
              {/* Icon button — always visible, flush to the edge */}
              <span
                className="relative z-10 w-12 h-12 sm:w-[52px] sm:h-[52px] flex items-center justify-center text-white shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: meta.color }}
              >
                <ChannelIcon type={c.type} />
              </span>

              {/* Label — slides out from behind the button on hover/focus */}
              <span
                className={cn(
                  'block overflow-hidden transition-all duration-300 ease-out',
                  'max-w-0 opacity-0 group-hover:max-w-[220px] group-hover:opacity-100 group-focus-visible:max-w-[220px] group-focus-visible:opacity-100'
                )}
                style={{ backgroundColor: meta.color }}
              >
                <span className={cn(
                  'flex items-center h-12 sm:h-[52px] px-4 text-sm font-semibold text-white whitespace-nowrap',
                  isLeft ? 'justify-end' : 'justify-start'
                )}>
                  {meta.label}
                </span>
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
