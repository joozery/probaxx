'use client'
import { useEffect, useState } from 'react'
import { Loader2, Save, CheckCircle2, MessageCircle, Phone, Mail, ArrowLeftRight } from 'lucide-react'
import { CHANNEL_META, CHANNEL_ORDER, type Channel, type ChannelType } from '@/lib/contactChannels'
import { cn } from '@/lib/utils'

interface WidgetData {
  enabled: boolean
  position: 'left' | 'right'
  channels: Channel[]
}

const INPUT =
  'w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]'

const ICON: Partial<Record<ChannelType, React.ReactNode>> = {
  line: <path d="M24 10.3C24 5 18.6.7 12 .7S0 5 0 10.3c0 4.8 4.3 8.8 10 9.6.4.1.9.3 1.1.6.1.3.1.7 0 1l-.2 1c-.1.3-.2 1.2 1 .6 1.3-.5 6.9-4 9.4-7C23.2 14.4 24 12.5 24 10.3M7.7 13.5H5.3c-.3 0-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6v4.1h1.8c.4 0 .6.3.6.6s-.3.7-.6.7m2.4-.6c0 .3-.3.6-.6.6s-.6-.3-.6-.6V8.1c0-.3.3-.6.6-.6s.6.3.6.6zm5.7 0c0 .3-.2.5-.4.6h-.2c-.2 0-.4-.1-.5-.3l-2.4-3.3v2.9c0 .3-.3.6-.7.6s-.6-.3-.6-.6V8.1c0-.3.2-.5.4-.6h.2c.2 0 .4.1.5.3l2.5 3.3V8.1c0-.3.3-.6.6-.6s.6.3.6.6zm3.9-3c.3 0 .6.3.6.6s-.3.6-.6.6H18v1.1h1.8c.3 0 .6.3.6.6s-.3.7-.6.7h-2.4c-.3 0-.6-.3-.6-.7V8.1c0-.3.3-.6.6-.6h2.4c.3 0 .6.3.6.6s-.3.6-.6.6H18v1.1z" />,
  messenger: <path d="M12 0C5.4 0 .3 4.9.3 11.4c0 3.4 1.4 6.3 3.7 8.4.2.2.3.4.3.7l.1 2.1c0 .7.7 1.1 1.3.8l2.3-1c.2-.1.5-.1.7 0 1 .3 2.1.4 3.2.4 6.6 0 11.7-4.8 11.7-11.4C23.7 4.9 18.6 0 12 0m7 8.7-3.4 5.4c-.5.9-1.7 1.1-2.5.5l-2.7-2c-.2-.2-.6-.2-.8 0l-3.7 2.8c-.5.4-1.1-.2-.8-.7L8.7 9.3c.5-.9 1.7-1.1 2.5-.5l2.7 2c.2.2.6.2.8 0l3.7-2.8c.5-.4 1.1.2.8.7" />,
  facebook: <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07" />,
  whatsapp: <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.2-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.7.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.3-.2-.6-.4M12 22c-1.8 0-3.5-.5-5-1.4l-3.5.9.9-3.4C3.5 15.6 3 13.8 3 12 3 7 7 3 12 3s9 4 9 9-4 9-9 9m0-20C6 2 1 7 1 12c0 2 .5 3.9 1.5 5.6L1 23l5.5-1.4C8.1 22.5 10 23 12 23c6 0 11-5 11-11S18 2 12 2" />,
  instagram: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23 8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32M12 16a4 4 0 110-8 4 4 0 010 8m6.41-11.85a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88" />,
  tiktok: <path d="M19.6 6.8a5 5 0 01-3-1v6.8a6.2 6.2 0 11-6.2-6.2h.5V9a3 3 0 00-.5 0 3 3 0 103 3V.5h3a5 5 0 003 4.6z" />,
}

// Ensure every supported channel type has a row, in canonical order.
function normalize(channels: Channel[]): Channel[] {
  return CHANNEL_ORDER.map(type => {
    const found = channels.find(c => c.type === type)
    return found ?? { type, value: '', enabled: false }
  })
}

function BrandDot({ type }: { type: ChannelType }) {
  const meta = CHANNEL_META[type]
  const Icon = type === 'phone' ? Phone : type === 'email' ? Mail : null
  return (
    <span
      className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white shrink-0 shadow-sm"
      style={{ backgroundColor: meta.color }}
    >
      {Icon ? (
        <Icon className="w-5 h-5" strokeWidth={2.2} />
      ) : (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden>
          {ICON[type]}
        </svg>
      )}
    </span>
  )
}

export default function ContactWidgetPage() {
  const [data, setData] = useState<WidgetData>({ enabled: true, position: 'right', channels: normalize([]) })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/contact-widget')
      .then(r => r.json())
      .then((d: WidgetData) => {
        setData({ enabled: d.enabled, position: d.position || 'right', channels: normalize(d.channels || []) })
        setLoading(false)
      })
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/contact-widget', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function updateChannel(type: ChannelType, patch: Partial<Channel>) {
    setData(prev => ({
      ...prev,
      channels: prev.channels.map(c => (c.type === type ? { ...c, ...patch } : c)),
    }))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
        <span className="text-sm font-medium">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 shrink-0">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">ปุ่มติดต่อลอย (Floating)</h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5">ตั้งค่าปุ่มติดต่อที่ลอยอยู่ด้านข้างหน้าเว็บไซต์</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={cn(
            'inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md whitespace-nowrap',
            saved ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 disabled:opacity-60'
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'บันทึกแล้ว!' : saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </button>
      </div>

      <div className="space-y-4">
        {/* General */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.05)] p-6 space-y-5">
          {/* Enable toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-800 text-sm">เปิดใช้งานปุ่มติดต่อลอย</p>
              <p className="text-xs text-slate-400 mt-0.5">แสดง/ซ่อนปุ่มติดต่อบนหน้าเว็บไซต์</p>
            </div>
            <button
              onClick={() => setData(p => ({ ...p, enabled: !p.enabled }))}
              className={cn('relative w-12 h-7 rounded-full transition-colors shrink-0', data.enabled ? 'bg-emerald-500' : 'bg-slate-200')}
            >
              <span className={cn('absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all', data.enabled ? 'left-6' : 'left-1')} />
            </button>
          </div>

          {/* Position */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5">
            <div>
              <p className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <ArrowLeftRight className="w-3.5 h-3.5 text-slate-400" />ตำแหน่งที่แสดง
              </p>
              <p className="text-xs text-slate-400 mt-0.5">มุมล่างซ้ายหรือขวาของหน้าจอ</p>
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1 shrink-0">
              {(['left', 'right'] as const).map(pos => (
                <button
                  key={pos}
                  onClick={() => setData(p => ({ ...p, position: pos }))}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-xs font-semibold transition-all',
                    data.position === pos ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {pos === 'left' ? 'ซ้าย' : 'ขวา'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Channels */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="font-bold text-slate-800 text-sm">ช่องทางการติดต่อ</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">เปิดสวิตช์และกรอกข้อมูลช่องทางที่ต้องการแสดงบนปุ่มลอย</p>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.channels.map(c => {
              const meta = CHANNEL_META[c.type]
              return (
                <div 
                  key={c.type} 
                  className={cn(
                    "rounded-xl border p-5 transition-all shadow-sm flex flex-col justify-between", 
                    c.enabled ? "border-slate-200 bg-white" : "border-slate-100 bg-slate-50 opacity-80"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <BrandDot type={c.type} />
                      <div>
                        <h3 className={cn("font-bold text-sm", c.enabled ? "text-slate-800" : "text-slate-600")}>{meta.label}</h3>
                        <p className="text-[10.5px] text-slate-400 mt-0.5 max-w-[160px] leading-snug">{meta.hint}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateChannel(c.type, { enabled: !c.enabled })}
                      className={cn('relative w-10 h-6 rounded-full transition-colors shrink-0', c.enabled ? 'bg-emerald-500' : 'bg-slate-200')}
                    >
                      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all', c.enabled ? 'left-5' : 'left-1')} />
                    </button>
                  </div>
                  <input
                    value={c.value}
                    onChange={e => updateChannel(c.type, { value: e.target.value })}
                    placeholder={meta.placeholder}
                    className={cn(INPUT, !c.enabled && 'bg-slate-100/50')}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
