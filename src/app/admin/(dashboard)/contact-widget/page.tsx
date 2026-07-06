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
      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0"
      style={{ backgroundColor: meta.color }}
    >
      {Icon ? <Icon className="w-4 h-4" /> : meta.label[0]}
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
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
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
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm">ช่องทางการติดต่อ</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">เปิดสวิตช์และกรอกข้อมูลช่องทางที่ต้องการแสดง</p>
          </div>
          <div className="divide-y divide-slate-100">
            {data.channels.map(c => {
              const meta = CHANNEL_META[c.type]
              return (
                <div key={c.type} className="px-6 py-4 flex items-center gap-3">
                  <BrandDot type={c.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-semibold text-slate-700">{meta.label}</span>
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
                      className={cn(INPUT, !c.enabled && 'opacity-60')}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">{meta.hint}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
