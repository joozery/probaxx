'use client'

import { useEffect, useState, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, CheckCircle2, Upload, X, Plus, Trash2,
  Sparkles, HelpCircle, ShieldCheck, ExternalLink, Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────── */
interface WhyItem       { title: string; desc: string }
interface EquipmentItem { title: string }

interface SettingsState {
  hero:      { badge: string; title: string; titleColor: string; titleBlue: string; titleBlueColor: string; description: string; descriptionColor: string; image: string }
  why:       { label: string; title: string; items: WhyItem[] }
  equipment: { label: string; title: string; titleColor: string; titleBlue: string; titleBlueColor: string; description: string; descriptionColor: string; image: string; items: EquipmentItem[] }
}

const DEFAULTS: SettingsState = {
  hero: { badge: 'ABOUT PRO BAX', title: 'เกี่ยวกับเรา', titleColor: '#ffffff', titleBlue: 'ผู้เชี่ยวชาญด้านระบบน้ำตัวจริง', titleBlueColor: '#38bdf8', description: '', descriptionColor: '#d1d5db', image: '/cover/about_hero.png' },
  why: { label: 'WHY CHOOSE US', title: 'ทำไมต้องเลือก PRO BAX', items: [] },
  equipment: { label: 'SAFETY FIRST', title: 'อุปกรณ์และความปลอดภัย', titleColor: '#0a1628', titleBlue: 'ครบครันระดับสากล', titleBlueColor: '#1d4ed8', description: '', descriptionColor: '#6b7280', image: '/cover/about_equipment.png', items: [] },
}

/* ─── Styles ─────────────────────────────────────────────────── */
const F = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all'
const L = 'block text-xs font-semibold text-gray-500 mb-1.5'

const TABS = [
  { value: 'hero',      label: 'Hero',                icon: Sparkles },
  { value: 'why',       label: 'ทำไมต้องเลือกเรา',   icon: HelpCircle },
  { value: 'equipment', label: 'อุปกรณ์ & ความปลอดภัย', icon: ShieldCheck },
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

/* ─── ColorField ─────────────────────────────────────────────── */
function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={L}>{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative w-10 h-10 shrink-0 rounded-lg border border-gray-200 overflow-hidden">
          <input type="color" value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : '#ffffff'}
            onChange={e => onChange(e.target.value)}
            className="absolute -inset-1 w-12 h-12 cursor-pointer" />
        </div>
        <input value={value} onChange={e => onChange(e.target.value)} className={F} placeholder="#ffffff" />
      </div>
    </div>
  )
}

/* ─── TextPreview ────────────────────────────────────────────── */
function TextPreview({ image, dark, children }: { image: string; dark?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={L}>พรีวิวข้อความ</label>
      <div className={cn('relative rounded-xl overflow-hidden border border-gray-200 p-5', dark ? 'bg-[#001b3a]' : 'bg-[#f2f8fc]')}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className={cn('absolute inset-0 bg-gradient-to-r',
          dark ? 'from-[#001b3a]/90 via-[#001b3a]/70 to-[#001b3a]/30' : 'from-white/70 via-transparent to-white/60')} />
        <div className="relative">{children}</div>
      </div>
      <p className="mt-1 text-[11px] text-gray-400">ตัวอย่างการแสดงผลบนพื้นหลังจริง (ขนาดย่อ)</p>
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

function Count({ n, unit }: { n: number; unit: string }) {
  return <span className="text-xs text-gray-400">{n} {unit}</span>
}

function Add({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-colors">
      <Plus className="w-4 h-4" />{label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AboutSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    fetch('/api/about-settings').then(r => r.json()).then((d: SettingsState) => {
      setSettings({ hero: { ...DEFAULTS.hero, ...d.hero }, why: d.why, equipment: { ...DEFAULTS.equipment, ...d.equipment } })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    await fetch('/api/about-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [settings])

  const upH = <K extends keyof SettingsState['hero']>(k: K, v: SettingsState['hero'][K]) => setSettings(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const upW = <K extends keyof SettingsState['why']>(k: K, v: SettingsState['why'][K]) => setSettings(p => ({ ...p, why: { ...p.why, [k]: v } }))
  const upE = <K extends keyof SettingsState['equipment']>(k: K, v: SettingsState['equipment'][K]) => setSettings(p => ({ ...p, equipment: { ...p.equipment, [k]: v } }))

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
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">ตั้งค่าหน้าเกี่ยวกับเรา</h1>
            <p className="text-xs text-gray-400">จัดการเนื้อหาทุก section ของหน้า /about</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <a href="/about" target="_blank" rel="noopener noreferrer"
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

        {/* ── HERO ── */}
        <Tabs.Content value="hero" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความหลัก">
              <Field label="ป้ายกำกับ (Badge)" value={settings.hero.badge} onChange={v => upH('badge', v)} hint="ข้อความตัวพิมพ์ใหญ่เหนือหัวข้อ" />
              <Field label="หัวข้อ (Title)" value={settings.hero.title} onChange={v => upH('title', v)} />
              <Field label="หัวข้อรอง (Subtitle)" value={settings.hero.titleBlue} onChange={v => upH('titleBlue', v)} hint="แสดงใต้หัวข้อหลัก" />
              <Field label="คำอธิบาย" value={settings.hero.description} onChange={v => upH('description', v)} rows={4} />
              <div className="grid sm:grid-cols-3 gap-3 pt-1 border-t border-gray-100">
                <ColorField label="สีหัวข้อ" value={settings.hero.titleColor} onChange={v => upH('titleColor', v)} />
                <ColorField label="สีหัวข้อรอง" value={settings.hero.titleBlueColor} onChange={v => upH('titleBlueColor', v)} />
                <ColorField label="สีคำอธิบาย" value={settings.hero.descriptionColor} onChange={v => upH('descriptionColor', v)} />
              </div>
              <TextPreview image={settings.hero.image} dark>
                <h1 className="text-2xl font-extrabold leading-tight mb-1" style={{ color: settings.hero.titleColor || '#ffffff' }}>{settings.hero.title}</h1>
                <h2 className="text-xl font-extrabold leading-tight mb-2" style={{ color: settings.hero.titleBlueColor || '#38bdf8' }}>{settings.hero.titleBlue}</h2>
                <p className="text-xs leading-relaxed max-w-md" style={{ color: settings.hero.descriptionColor || '#d1d5db' }}>{settings.hero.description}</p>
              </TextPreview>
            </Card>
            <Card title="รูปพื้นหลัง">
              <ImageUpload value={settings.hero.image} onChange={v => upH('image', v)} />
            </Card>
          </div>
        </Tabs.Content>

        {/* ── WHY ── */}
        <Tabs.Content value="why" className="outline-none space-y-5">
          <Card title="หัวข้อ Section">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Label (อังกฤษ)" value={settings.why.label} onChange={v => upW('label', v)} placeholder="WHY CHOOSE US" />
              <Field label="หัวข้อ" value={settings.why.title} onChange={v => upW('title', v)} />
            </div>
          </Card>

          <Card title="เหตุผล" right={<Count n={settings.why.items.length} unit="ข้อ" />}>
            <div className="grid sm:grid-cols-2 gap-4">
              {settings.why.items.map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3 relative group">
                  <button onClick={() => upW('items', settings.why.items.filter((_, j) => j !== i))}
                    className="absolute top-3 right-3 p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="inline-flex w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold items-center justify-center">{i + 1}</span>
                  <Field label="หัวข้อ" value={item.title} onChange={v => upW('items', settings.why.items.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <Field label="รายละเอียด" value={item.desc} onChange={v => upW('items', settings.why.items.map((x, j) => j === i ? { ...x, desc: v } : x))} rows={2} />
                </div>
              ))}
            </div>
            <Add label="เพิ่มเหตุผล" onClick={() => upW('items', [...settings.why.items, { title: '', desc: '' }])} />
          </Card>
        </Tabs.Content>

        {/* ── EQUIPMENT ── */}
        <Tabs.Content value="equipment" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความหลัก">
              <Field label="Label (อังกฤษ)" value={settings.equipment.label} onChange={v => upE('label', v)} placeholder="SAFETY FIRST" />
              <Field label="หัวข้อ" value={settings.equipment.title} onChange={v => upE('title', v)} />
              <Field label="หัวข้อต่อเนื่อง" value={settings.equipment.titleBlue} onChange={v => upE('titleBlue', v)} hint="แสดงต่อท้ายหัวข้อหลัก" />
              <Field label="คำอธิบาย" value={settings.equipment.description} onChange={v => upE('description', v)} rows={4} />
              <div className="grid sm:grid-cols-3 gap-3 pt-1 border-t border-gray-100">
                <ColorField label="สีหัวข้อ" value={settings.equipment.titleColor} onChange={v => upE('titleColor', v)} />
                <ColorField label="สีหัวข้อต่อเนื่อง" value={settings.equipment.titleBlueColor} onChange={v => upE('titleBlueColor', v)} />
                <ColorField label="สีคำอธิบาย" value={settings.equipment.descriptionColor} onChange={v => upE('descriptionColor', v)} />
              </div>
              <TextPreview image="">
                <p className="text-[#1d4ed8] font-bold text-[10px] tracking-widest uppercase mb-1">{settings.equipment.label}</p>
                <h2 className="text-2xl font-extrabold leading-tight mb-2">
                  <span style={{ color: settings.equipment.titleColor || '#0a1628' }}>{settings.equipment.title}</span><br />
                  <span style={{ color: settings.equipment.titleBlueColor || '#1d4ed8' }}>{settings.equipment.titleBlue}</span>
                </h2>
                <p className="text-xs leading-relaxed max-w-md" style={{ color: settings.equipment.descriptionColor || '#6b7280' }}>{settings.equipment.description}</p>
              </TextPreview>
            </Card>
            <Card title="รูปภาพประกอบ">
              <ImageUpload value={settings.equipment.image} onChange={v => upE('image', v)} />
            </Card>
          </div>

          <Card title="รายการอุปกรณ์" right={<Count n={settings.equipment.items.length} unit="รายการ" />}>
            <div className="space-y-2">
              {settings.equipment.items.map((eq, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <input value={eq.title} onChange={e => upE('items', settings.equipment.items.map((x, j) => j === i ? { title: e.target.value } : x))} className={F} placeholder="ชื่ออุปกรณ์..." />
                  <button onClick={() => upE('items', settings.equipment.items.filter((_, j) => j !== i))}
                    className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <Add label="เพิ่มอุปกรณ์" onClick={() => upE('items', [...settings.equipment.items, { title: '' }])} />
          </Card>
        </Tabs.Content>

      </Tabs.Root>
    </div>
  )
}
