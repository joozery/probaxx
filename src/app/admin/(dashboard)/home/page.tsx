'use client'

import { useEffect, useState, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, CheckCircle2, Upload, X, Plus, Trash2,
  Sparkles, HelpCircle, AlertTriangle, ListOrdered, ShieldCheck,
  Megaphone, ExternalLink, Home,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────── */
interface SettingsState {
  hero: { badge: string; title1: string; title2: string; title2Orange: string; title3: string; subtitle: string; image: string; features: Array<{ label: string }> }
  why: { badge: string; title1: string; titleOrange: string; title3: string; description: string; image: string; stats: Array<{ value: string; label: string }>; cards: Array<{ title: string; desc: string }> }
  symptoms: { badge: string; title1: string; titleOrange: string; title3: string; description: string; infoTitle: string; infoDesc: string; items: Array<{ image: string; title: string; desc: string }> }
  process: { title: string; titleOrange: string; steps: Array<{ title: string; desc: string }> }
  trust: { badge: string; title1: string; titleOrange: string; title3: string; description: string; items: Array<{ title: string; desc: string }> }
  cta: { title1: string; titleOrange: string; title3: string; description: string; image: string; features: Array<{ label: string; sub: string }>; hoursLabel: string; hours: string; phone: string; lineId: string }
}

const DEFAULTS: SettingsState = {
  hero: { badge: '', title1: '', title2: '', title2Orange: '', title3: '', subtitle: '', image: '', features: [] },
  why: { badge: '', title1: '', titleOrange: '', title3: '', description: '', image: '', stats: [], cards: [] },
  symptoms: { badge: '', title1: '', titleOrange: '', title3: '', description: '', infoTitle: '', infoDesc: '', items: [] },
  process: { title: '', titleOrange: '', steps: [] },
  trust: { badge: '', title1: '', titleOrange: '', title3: '', description: '', items: [] },
  cta: { title1: '', titleOrange: '', title3: '', description: '', image: '', features: [], hoursLabel: '', hours: '', phone: '', lineId: '' },
}

/* ─── Styles ─────────────────────────────────────────────────── */
const F = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all'
const L = 'block text-xs font-semibold text-gray-500 mb-1.5'

const TABS = [
  { value: 'hero',     label: 'Hero',           icon: Sparkles },
  { value: 'why',      label: 'ทำไมต้องล้าง',  icon: HelpCircle },
  { value: 'symptoms', label: 'อาการเตือน',     icon: AlertTriangle },
  { value: 'process',  label: 'ขั้นตอนบริการ',  icon: ListOrdered },
  { value: 'trust',    label: 'ความน่าเชื่อถือ', icon: ShieldCheck },
  { value: 'cta',      label: 'CTA',             icon: Megaphone },
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

function DelBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
      <Trash2 className="w-4 h-4" />
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function HomeSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    fetch('/api/home-settings').then(r => r.json()).then((d: SettingsState) => {
      setSettings({ hero: d.hero, why: d.why, symptoms: d.symptoms, process: d.process, trust: d.trust, cta: d.cta })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    await fetch('/api/home-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [settings])

  const upH  = <K extends keyof SettingsState['hero']>(k: K, v: SettingsState['hero'][K]) => setSettings(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const upW  = <K extends keyof SettingsState['why']>(k: K, v: SettingsState['why'][K]) => setSettings(p => ({ ...p, why: { ...p.why, [k]: v } }))
  const upSy = <K extends keyof SettingsState['symptoms']>(k: K, v: SettingsState['symptoms'][K]) => setSettings(p => ({ ...p, symptoms: { ...p.symptoms, [k]: v } }))
  const upPr = <K extends keyof SettingsState['process']>(k: K, v: SettingsState['process'][K]) => setSettings(p => ({ ...p, process: { ...p.process, [k]: v } }))
  const upT  = <K extends keyof SettingsState['trust']>(k: K, v: SettingsState['trust'][K]) => setSettings(p => ({ ...p, trust: { ...p.trust, [k]: v } }))
  const upC  = <K extends keyof SettingsState['cta']>(k: K, v: SettingsState['cta'][K]) => setSettings(p => ({ ...p, cta: { ...p.cta, [k]: v } }))

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
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">ตั้งค่าหน้าแรก</h1>
            <p className="text-xs text-gray-400">จัดการเนื้อหาทุก section ของหน้าแรกเว็บไซต์</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <a href="/" target="_blank" rel="noopener noreferrer"
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
            <Card title="ข้อความ Hero">
              <Field label="ป้ายกำกับ (Badge)" value={settings.hero.badge} onChange={v => upH('badge', v)} placeholder="Professional Service" />
              <div className="grid grid-cols-2 gap-3">
                <Field label="หัวข้อบรรทัด 1" value={settings.hero.title1} onChange={v => upH('title1', v)} placeholder="PROFESSIONAL" />
                <Field label="หัวข้อบรรทัด 3" value={settings.hero.title3} onChange={v => upH('title3', v)} placeholder="CLEANING" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="บรรทัด 2 (สีขาว)" value={settings.hero.title2} onChange={v => upH('title2', v)} placeholder="WATER " />
                <Field label="บรรทัด 2 (สีส้ม)" value={settings.hero.title2Orange} onChange={v => upH('title2Orange', v)} placeholder="TANK" />
              </div>
              <Field label="คำอธิบายใต้หัวข้อ" value={settings.hero.subtitle} onChange={v => upH('subtitle', v)} rows={2} />
            </Card>
            <Card title="รูปพื้นหลัง">
              <ImageUpload value={settings.hero.image} onChange={v => upH('image', v)} />
            </Card>
          </div>

          <Card title="จุดเด่นใต้หัวข้อ" right={<Count n={settings.hero.features.length} unit="รายการ" />}>
            <div className="space-y-2">
              {settings.hero.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  <input value={f.label} onChange={e => upH('features', settings.hero.features.map((x, j) => j === i ? { label: e.target.value } : x))} className={F} placeholder="เช่น ปลอดภัย ได้มาตรฐาน" />
                  <DelBtn onClick={() => upH('features', settings.hero.features.filter((_, j) => j !== i))} />
                </div>
              ))}
            </div>
            <Add label="เพิ่มจุดเด่น" onClick={() => upH('features', [...settings.hero.features, { label: '' }])} />
          </Card>
        </Tabs.Content>

        {/* ── WHY ── */}
        <Tabs.Content value="why" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความหลัก">
              <Field label="ป้ายกำกับ (Badge)" value={settings.why.badge} onChange={v => upW('badge', v)} placeholder="Why Clean Regularly" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="บรรทัด 1" value={settings.why.title1} onChange={v => upW('title1', v)} />
                <Field label="บรรทัด 2 (สีส้ม)" value={settings.why.titleOrange} onChange={v => upW('titleOrange', v)} />
                <Field label="บรรทัด 3" value={settings.why.title3} onChange={v => upW('title3', v)} />
              </div>
              <Field label="คำอธิบาย" value={settings.why.description} onChange={v => upW('description', v)} rows={3} />
            </Card>
            <Card title="รูปพื้นหลัง">
              <ImageUpload value={settings.why.image} onChange={v => upW('image', v)} />
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ตัวเลขสถิติ" right={<Count n={settings.why.stats.length} unit="รายการ" />}>
              <div className="space-y-2">
                {settings.why.stats.map((st, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={st.value} onChange={e => upW('stats', settings.why.stats.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} className={cn(F, 'w-24 text-center font-bold')} placeholder="10+" />
                    <input value={st.label} onChange={e => upW('stats', settings.why.stats.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} className={F} placeholder="ปีประสบการณ์" />
                    <DelBtn onClick={() => upW('stats', settings.why.stats.filter((_, j) => j !== i))} />
                  </div>
                ))}
              </div>
              <Add label="เพิ่มสถิติ" onClick={() => upW('stats', [...settings.why.stats, { value: '', label: '' }])} />
            </Card>

            <Card title="การ์ดประโยชน์" right={<Count n={settings.why.cards.length} unit="ใบ" />}>
              <div className="space-y-3">
                {settings.why.cards.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <input value={c.title} onChange={e => upW('cards', settings.why.cards.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className={F} placeholder="หัวข้อ" />
                      <input value={c.desc} onChange={e => upW('cards', settings.why.cards.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} className={F} placeholder="คำอธิบาย" />
                    </div>
                    <DelBtn onClick={() => upW('cards', settings.why.cards.filter((_, j) => j !== i))} />
                  </div>
                ))}
              </div>
              <Add label="เพิ่มการ์ด" onClick={() => upW('cards', [...settings.why.cards, { title: '', desc: '' }])} />
            </Card>
          </div>
        </Tabs.Content>

        {/* ── SYMPTOMS ── */}
        <Tabs.Content value="symptoms" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความหลัก">
              <Field label="ป้ายกำกับ (Badge)" value={settings.symptoms.badge} onChange={v => upSy('badge', v)} placeholder="Warning Signs" />
              <div className="grid grid-cols-3 gap-3">
                <Field label="บรรทัด 1" value={settings.symptoms.title1} onChange={v => upSy('title1', v)} />
                <Field label="คำเน้น (สีส้ม)" value={settings.symptoms.titleOrange} onChange={v => upSy('titleOrange', v)} />
                <Field label="คำต่อท้าย" value={settings.symptoms.title3} onChange={v => upSy('title3', v)} />
              </div>
              <Field label="คำอธิบาย" value={settings.symptoms.description} onChange={v => upSy('description', v)} rows={2} />
            </Card>
            <Card title="การ์ดข้อมูลด้านขวา">
              <Field label="หัวข้อ" value={settings.symptoms.infoTitle} onChange={v => upSy('infoTitle', v)} />
              <Field label="คำอธิบาย" value={settings.symptoms.infoDesc} onChange={v => upSy('infoDesc', v)} rows={3} />
            </Card>
          </div>

          <Card title="การ์ดอาการ" right={<Count n={settings.symptoms.items.length} unit="ใบ" />}>
            <div className="grid sm:grid-cols-2 gap-4">
              {settings.symptoms.items.map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3 relative group">
                  <button onClick={() => upSy('items', settings.symptoms.items.filter((_, j) => j !== i))}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ImageUpload value={item.image} onChange={url => upSy('items', settings.symptoms.items.map((x, j) => j === i ? { ...x, image: url } : x))} />
                  <Field label="หัวข้อ" value={item.title} onChange={v => upSy('items', settings.symptoms.items.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <Field label="คำอธิบาย" value={item.desc} onChange={v => upSy('items', settings.symptoms.items.map((x, j) => j === i ? { ...x, desc: v } : x))} rows={2} />
                </div>
              ))}
            </div>
            <Add label="เพิ่มการ์ดอาการ" onClick={() => upSy('items', [...settings.symptoms.items, { image: '', title: '', desc: '' }])} />
          </Card>
        </Tabs.Content>

        {/* ── PROCESS ── */}
        <Tabs.Content value="process" className="outline-none space-y-5">
          <Card title="หัวข้อ Section">
            <div className="grid grid-cols-2 gap-3">
              <Field label="หัวข้อ" value={settings.process.title} onChange={v => upPr('title', v)} placeholder="มาตรฐานการให้บริการ" />
              <Field label="คำต่อท้าย (สีส้ม)" value={settings.process.titleOrange} onChange={v => upPr('titleOrange', v)} placeholder="ของเรา" />
            </div>
          </Card>

          <Card title="ขั้นตอนบริการ" right={<Count n={settings.process.steps.length} unit="ขั้นตอน" />}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {settings.process.steps.map((step, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3 relative group">
                  <button onClick={() => upPr('steps', settings.process.steps.filter((_, j) => j !== i))}
                    className="absolute top-3 right-3 p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="inline-flex w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold items-center justify-center">{String(i + 1).padStart(2, '0')}</span>
                  <Field label="ชื่อขั้นตอน" value={step.title} onChange={v => upPr('steps', settings.process.steps.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <Field label="คำอธิบาย" value={step.desc} onChange={v => upPr('steps', settings.process.steps.map((x, j) => j === i ? { ...x, desc: v } : x))} rows={2} />
                </div>
              ))}
            </div>
            <Add label="เพิ่มขั้นตอน" onClick={() => upPr('steps', [...settings.process.steps, { title: '', desc: '' }])} />
          </Card>
        </Tabs.Content>

        {/* ── TRUST ── */}
        <Tabs.Content value="trust" className="outline-none space-y-5">
          <Card title="ข้อความหลัก">
            <Field label="ป้ายกำกับ (Badge)" value={settings.trust.badge} onChange={v => upT('badge', v)} placeholder="Why Trust Us" />
            <div className="grid grid-cols-3 gap-3">
              <Field label="บรรทัด 1" value={settings.trust.title1} onChange={v => upT('title1', v)} />
              <Field label="บรรทัด 2 (สีส้ม)" value={settings.trust.titleOrange} onChange={v => upT('titleOrange', v)} />
              <Field label="บรรทัด 3" value={settings.trust.title3} onChange={v => upT('title3', v)} />
            </div>
            <Field label="คำอธิบาย" value={settings.trust.description} onChange={v => upT('description', v)} rows={3} />
          </Card>

          <Card title="การ์ดความน่าเชื่อถือ" right={<Count n={settings.trust.items.length} unit="ใบ" />}>
            <div className="grid sm:grid-cols-2 gap-4">
              {settings.trust.items.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <div className="flex-1 space-y-2">
                    <input value={item.title} onChange={e => upT('items', settings.trust.items.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className={F} placeholder="หัวข้อ" />
                    <input value={item.desc} onChange={e => upT('items', settings.trust.items.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} className={F} placeholder="คำอธิบาย" />
                  </div>
                  <DelBtn onClick={() => upT('items', settings.trust.items.filter((_, j) => j !== i))} />
                </div>
              ))}
            </div>
            <Add label="เพิ่มการ์ด" onClick={() => upT('items', [...settings.trust.items, { title: '', desc: '' }])} />
          </Card>
        </Tabs.Content>

        {/* ── CTA ── */}
        <Tabs.Content value="cta" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความ CTA">
              <div className="grid grid-cols-3 gap-3">
                <Field label="บรรทัด 1" value={settings.cta.title1} onChange={v => upC('title1', v)} />
                <Field label="คำเน้น (สีส้ม)" value={settings.cta.titleOrange} onChange={v => upC('titleOrange', v)} />
                <Field label="คำต่อท้าย" value={settings.cta.title3} onChange={v => upC('title3', v)} />
              </div>
              <Field label="คำอธิบาย" value={settings.cta.description} onChange={v => upC('description', v)} rows={2} />
            </Card>
            <Card title="รูปพื้นหลัง">
              <ImageUpload value={settings.cta.image} onChange={v => upC('image', v)} />
            </Card>
          </div>

          <Card title="จุดเด่น 3 ข้อ" right={<Count n={settings.cta.features.length} unit="รายการ" />}>
            <div className="grid sm:grid-cols-3 gap-4">
              {settings.cta.features.map((f, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3 relative group">
                  <button onClick={() => upC('features', settings.cta.features.filter((_, j) => j !== i))}
                    className="absolute top-3 right-3 p-1.5 rounded-md text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Field label="หัวข้อ" value={f.label} onChange={v => upC('features', settings.cta.features.map((x, j) => j === i ? { ...x, label: v } : x))} />
                  <Field label="คำรอง" value={f.sub} onChange={v => upC('features', settings.cta.features.map((x, j) => j === i ? { ...x, sub: v } : x))} />
                </div>
              ))}
            </div>
            <Add label="เพิ่มจุดเด่น" onClick={() => upC('features', [...settings.cta.features, { label: '', sub: '' }])} />
          </Card>

          <Card title="แถบล่าง (เวลา & ติดต่อ)">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="ข้อความเวลาทำการ" value={settings.cta.hoursLabel} onChange={v => upC('hoursLabel', v)} placeholder="พร้อมให้บริการ ทุกวัน" />
              <Field label="เวลาทำการ" value={settings.cta.hours} onChange={v => upC('hours', v)} placeholder="08.00 – 18.00 น." />
              <Field label="เบอร์โทรศัพท์" value={settings.cta.phone} onChange={v => upC('phone', v)} placeholder="085-556-4994" />
              <Field label="LINE ID" value={settings.cta.lineId} onChange={v => upC('lineId', v)} placeholder="@probax" />
            </div>
          </Card>
        </Tabs.Content>

      </Tabs.Root>
    </div>
  )
}
