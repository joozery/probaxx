'use client'

import { useEffect, useState, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, CheckCircle2, Upload, X,
  Sparkles, Phone, Megaphone, ExternalLink, MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────── */
interface SettingsState {
  info: {
    phone: string; phoneContactName: string; lineId: string; email: string
    address: string; companyName: string; hoursLine1: string; hoursLine2: string
  }
  hero: { badge: string; title: string; description: string; image: string }
  quickBar: { text: string }
  cta: { title: string; description: string }
}

const DEFAULTS: SettingsState = {
  info: { phone: '', phoneContactName: '', lineId: '', email: '', address: '', companyName: '', hoursLine1: '', hoursLine2: '' },
  hero: { badge: 'GET IN TOUCH', title: 'ติดต่อเรา', description: '', image: '/cover/contact_hero.png' },
  quickBar: { text: '' },
  cta: { title: '', description: '' },
}

/* ─── Styles ─────────────────────────────────────────────────── */
const F = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all'
const L = 'block text-xs font-semibold text-gray-500 mb-1.5'

const TABS = [
  { value: 'info', label: 'ข้อมูลติดต่อ', icon: Phone },
  { value: 'hero', label: 'Hero',          icon: Sparkles },
  { value: 'cta',  label: 'แถบด่วน & CTA', icon: Megaphone },
]

/* ─── Field ──────────────────────────────────────────────────── */
function Field({ label, value, onChange, rows, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <label className={L}>{label}</label>
      {rows
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={cn(F, 'resize-none')} placeholder={placeholder} />
        : <input value={value} onChange={e => onChange(e.target.value)} className={F} placeholder={placeholder} />}
      {hint && <p className="mt-1 text-[11px] text-gray-400">{hint}</p>}
    </div>
  )
}

/* ─── ImageUpload ─────────────────────────────────────────────── */
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) onChange(url)
    } catch { alert('อัปโหลดไม่สำเร็จ') }
    setUploading(false); e.target.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-50 border border-gray-200 group">
        {uploading && (
          <div className="absolute inset-0 z-10 bg-white/80 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          </div>
        )}
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <label className="cursor-pointer bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-50">
                <Upload className="w-3.5 h-3.5" />เปลี่ยน
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              <button onClick={() => onChange('')} className="bg-white text-red-500 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-gray-50">
                <X className="w-3.5 h-3.5" />ลบ
              </button>
            </div>
          </>
        ) : (
          <label className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-gray-100/50 transition-colors">
            <Upload className="w-5 h-5 text-gray-300" />
            <span className="text-xs text-gray-400">คลิกเพื่ออัปโหลด</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
      </div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder="หรือวาง URL รูปภาพ" className={cn(F, 'text-xs py-2')} />
    </div>
  )
}

/* ─── Card ───────────────────────────────────────────────────── */
function Card({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
      <header className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        {right}
      </header>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ContactSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState('info')

  useEffect(() => {
    fetch('/api/contact-settings').then(r => r.json()).then((d: SettingsState) => {
      setSettings({ info: d.info, hero: d.hero, quickBar: d.quickBar, cta: d.cta })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    await fetch('/api/contact-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [settings])

  const upI = <K extends keyof SettingsState['info']>(k: K, v: SettingsState['info'][K]) => setSettings(p => ({ ...p, info: { ...p.info, [k]: v } }))
  const upH = <K extends keyof SettingsState['hero']>(k: K, v: SettingsState['hero'][K]) => setSettings(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const upQ = (v: string) => setSettings(p => ({ ...p, quickBar: { text: v } }))
  const upC = <K extends keyof SettingsState['cta']>(k: K, v: SettingsState['cta'][K]) => setSettings(p => ({ ...p, cta: { ...p.cta, [k]: v } }))

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh] gap-2.5 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">กำลังโหลด...</span>
    </div>
  )

  return (
    <div className="p-6 lg:p-8">

      {/* ── Page header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0a1628] flex items-center justify-center">
            <Phone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">ตั้งค่าหน้าติดต่อเรา</h1>
            <p className="text-xs text-gray-400">จัดการเนื้อหาทุก section ของหน้า /contact</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <a href="/contact" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-white border border-gray-200 px-3.5 py-2 rounded-lg transition-colors">
            <ExternalLink className="w-3.5 h-3.5" />ดูหน้าเว็บ
          </a>
          <button onClick={save} disabled={saving}
            className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all',
              saved ? 'bg-emerald-500 text-white' : 'bg-[#1d4ed8] hover:bg-blue-700 text-white disabled:opacity-60')}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'บันทึกแล้ว' : saving ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
          </button>
        </div>
      </div>

      <Tabs.Root value={active} onValueChange={setActive}>

        {/* ── Tabs ── */}
        <Tabs.List className="inline-flex items-center gap-1 p-1 mb-6 bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-x-auto max-w-full">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <Tabs.Trigger key={tab.value} value={tab.value}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors outline-none
                  data-[state=active]:bg-[#0a1628] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-800 data-[state=inactive]:hover:bg-gray-50">
                <Icon className="w-3.5 h-3.5" />{tab.label}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        {/* ── INFO ── */}
        <Tabs.Content value="info" className="outline-none space-y-5">
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
            ข้อมูลชุดนี้ใช้ทั้งหน้า — ปุ่มโทร, LINE, อีเมล และแผนที่ Google Maps จะอัปเดตตามอัตโนมัติ
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ช่องทางติดต่อ">
              <div className="grid grid-cols-[1fr_120px] gap-3">
                <Field label="เบอร์โทรศัพท์" value={settings.info.phone} onChange={v => upI('phone', v)} placeholder="085-556-4994" />
                <Field label="ชื่อผู้ติดต่อ" value={settings.info.phoneContactName} onChange={v => upI('phoneContactName', v)} placeholder="ก้อง" />
              </div>
              <Field label="LINE ID" value={settings.info.lineId} onChange={v => upI('lineId', v)} placeholder="@probax" />
              <Field label="อีเมล" value={settings.info.email} onChange={v => upI('email', v)} placeholder="contact@probax.co.th" />
            </Card>

            <Card title="ที่อยู่ & เวลาทำการ">
              <Field label="ที่อยู่" value={settings.info.address} onChange={v => upI('address', v)} rows={2}
                hint="แผนที่ Google Maps จะปักหมุดตามที่อยู่นี้" />
              <Field label="ชื่อบริษัท" value={settings.info.companyName} onChange={v => upI('companyName', v)} />
              <Field label="เวลาทำการ (บรรทัดแรก)" value={settings.info.hoursLine1} onChange={v => upI('hoursLine1', v)} placeholder="จันทร์ – เสาร์: 08:00 – 17:00 น." />
              <Field label="เวลาทำการ (บรรทัดสอง)" value={settings.info.hoursLine2} onChange={v => upI('hoursLine2', v)} placeholder="หยุดวันอาทิตย์..." />
            </Card>
          </div>

          {/* Map preview */}
          {settings.info.address && (
            <Card title="ตัวอย่างแผนที่" right={<MapPin className="w-4 h-4 text-gray-300" />}>
              <div className="relative w-full h-56 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.info.address)}&hl=th&z=15&output=embed`}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  title="Map preview"
                />
              </div>
            </Card>
          )}
        </Tabs.Content>

        {/* ── HERO ── */}
        <Tabs.Content value="hero" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความ Hero">
              <Field label="ป้ายกำกับ (Badge)" value={settings.hero.badge} onChange={v => upH('badge', v)} placeholder="GET IN TOUCH" />
              <Field label="หัวข้อ" value={settings.hero.title} onChange={v => upH('title', v)} placeholder="ติดต่อเรา" />
              <Field label="คำอธิบาย" value={settings.hero.description} onChange={v => upH('description', v)} rows={4} />
            </Card>
            <Card title="รูปพื้นหลัง">
              <ImageUpload value={settings.hero.image} onChange={v => upH('image', v)} />
            </Card>
          </div>
        </Tabs.Content>

        {/* ── QUICKBAR & CTA ── */}
        <Tabs.Content value="cta" className="outline-none space-y-5">
          <Card title="แถบข้อความด่วน (ใต้ Hero)">
            <Field label="ข้อความ" value={settings.quickBar.text} onChange={upQ} placeholder="ต้องการความช่วยเหลือด่วน? ..."
              hint="แสดงในแถบสีเข้มใต้ Hero พร้อมเบอร์โทรและอีเมล" />
          </Card>

          <Card title="CTA ท้ายหน้า">
            <Field label="หัวข้อ" value={settings.cta.title} onChange={v => upC('title', v)} placeholder="พร้อมเริ่มต้นดูแลระบบน้ำของคุณ?" />
            <Field label="คำอธิบาย" value={settings.cta.description} onChange={v => upC('description', v)} rows={3} />
            <p className="text-[11px] text-gray-400">ปุ่มโทรและ LINE ในส่วนนี้ใช้ข้อมูลจากแท็บ &quot;ข้อมูลติดต่อ&quot; อัตโนมัติ</p>
          </Card>
        </Tabs.Content>

      </Tabs.Root>
    </div>
  )
}
