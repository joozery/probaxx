'use client'

import { useEffect, useState, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, CheckCircle2, Upload, X, Plus, Trash2,
  ChevronUp, ChevronDown, ImageIcon, Sparkles, HelpCircle,
  Trophy, LayoutGrid, ExternalLink, Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────── */
interface Feature     { title: string; desc: string }
interface ServiceItem { title: string; desc: string; image: string }
interface Symptom     { label: string }
interface Benefit     { title: string; desc: string }
interface Client      { name: string; clientType: string; abbr: string; logo: string }
interface GalleryItem { src: string; alt: string }
interface CaseStudy   { image: string; title: string; description: string; duration: string; result: string }
interface FaqItem     { question: string; answer: string }

interface SettingsState {
  hero:      { title: string; subtitle: string; description: string; image: string; features: Feature[] }
  services:  { sectionTitle: string; items: ServiceItem[] }
  why:       { title: string; titleBlue: string; description: string; image: string; symptoms: Symptom[]; benefits: Benefit[] }
  portfolio: { sectionTitle: string; clients: Client[]; gallery: GalleryItem[]; caseStudy: CaseStudy }
  faq:       { items: FaqItem[] }
}

/* ─── Defaults ───────────────────────────────────────────────── */
const DEFAULTS: SettingsState = {
  hero: { title: 'บริการล้างถังเก็บน้ำ', subtitle: 'สะอาด ปลอดภัย ได้มาตรฐาน', description: 'เราดูแลความสะอาดของถังเก็บน้ำ ด้วยทีมงานมืออาชีพ', image: '/cover/coverherosr.png', features: [{ title: 'ปลอดภัย', desc: 'ไม่เป็นอันตรายต่อสุขภาพ' }, { title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์กว่า 10 ปี' }, { title: 'ได้มาตรฐาน', desc: 'ตามมาตรฐานการทำงาน' }] },
  services: { sectionTitle: 'บริการของเรา', items: [] },
  why: { title: 'ทำไมต้องล้างถังเก็บน้ำ', titleBlue: 'อย่างน้อยทุก 6 เดือน?', description: '', image: '', symptoms: [], benefits: [] },
  portfolio: { sectionTitle: 'ผลงานที่ผ่านมา', clients: [], gallery: [], caseStudy: { image: '', title: '', description: '', duration: '', result: '' } },
  faq: { items: [] },
}

/* ─── Styles ─────────────────────────────────────────────────── */
const F = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-gray-200 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-all'
const L = 'block text-xs font-semibold text-gray-500 mb-1.5'

const TABS = [
  { value: 'hero',      label: 'Hero',        icon: Sparkles },
  { value: 'services',  label: 'บริการ',      icon: LayoutGrid },
  { value: 'why',       label: 'ทำไมต้องล้าง', icon: HelpCircle },
  { value: 'portfolio', label: 'ผลงาน',       icon: Trophy },
  { value: 'faq',       label: 'FAQ',          icon: HelpCircle },
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
      const data = await res.json()
      if (data.url) onChange(data.url)
      else if (data.error) alert('อัปโหลดล้มเหลว: ' + data.error)
      else alert('อัปโหลดไม่สำเร็จ')
    } catch { alert('อัปโหลดไม่สำเร็จ (ระบบเครือข่าย)') }
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

/* ─── ClientLogoUpload ────────────────────────────────────────── */
function ClientLogoUpload({ logo, abbr, onChange }: { logo: string; abbr: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) onChange(data.url)
      else if (data.error) alert('อัปโหลดล้มเหลว: ' + data.error)
      else alert('อัปโหลดไม่สำเร็จ')
    } catch { alert('อัปโหลดไม่สำเร็จ (ระบบเครือข่าย)') }
    setUploading(false); e.target.value = ''
  }

  return (
    <div className="relative shrink-0 group">
      <label className="block w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden cursor-pointer hover:border-blue-400 transition-colors">
        {uploading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          </div>
        ) : logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-gray-300 group-hover:text-blue-500 transition-colors">
            {abbr
              ? <span className="text-xs font-bold text-gray-400">{abbr}</span>
              : <Upload className="w-4 h-4" />}
            <span className="text-[9px] leading-none">โลโก้</span>
          </div>
        )}
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
      {logo && (
        <button onClick={() => onChange('')}
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <X className="w-3 h-3" />
        </button>
      )}
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

/* ─── Add button ─────────────────────────────────────────────── */
function Add({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-colors">
      <Plus className="w-4 h-4" />{label}
    </button>
  )
}

/* ─── IconBtn ─────────────────────────────────────────────────── */
function IconBtn({ onClick, disabled, danger, children }: {
  onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode
}) {
  return (
    <button onClick={onClick} disabled={disabled}
      className={cn('p-1.5 rounded-md transition-colors disabled:opacity-25',
        danger ? 'text-gray-400 hover:text-red-500 hover:bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100')}>
      {children}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function ServicesSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState('hero')

  useEffect(() => {
    fetch('/api/services-settings').then(r => r.json()).then((d: SettingsState) => {
      setSettings({ hero: d.hero, services: d.services, why: d.why, portfolio: d.portfolio, faq: d.faq })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    await fetch('/api/services-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [settings])

  const upH  = <K extends keyof SettingsState['hero']>(k: K, v: SettingsState['hero'][K]) => setSettings(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const upSv = <K extends keyof SettingsState['services']>(k: K, v: SettingsState['services'][K]) => setSettings(p => ({ ...p, services: { ...p.services, [k]: v } }))
  const upW  = <K extends keyof SettingsState['why']>(k: K, v: SettingsState['why'][K]) => setSettings(p => ({ ...p, why: { ...p.why, [k]: v } }))
  const upP  = <K extends keyof SettingsState['portfolio']>(k: K, v: SettingsState['portfolio'][K]) => setSettings(p => ({ ...p, portfolio: { ...p.portfolio, [k]: v } }))
  const upF  = <K extends keyof SettingsState['faq']>(k: K, v: SettingsState['faq'][K]) => setSettings(p => ({ ...p, faq: { ...p.faq, [k]: v } }))

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
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">ตั้งค่าหน้าบริการ</h1>
            <p className="text-xs text-gray-400">จัดการเนื้อหาทุก section ของหน้า /services</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <a href="/services" target="_blank" rel="noopener noreferrer"
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
              <Field label="หัวข้อ (Title)" value={settings.hero.title} onChange={v => upH('title', v)} />
              <Field label="หัวข้อรอง (Subtitle)" value={settings.hero.subtitle} onChange={v => upH('subtitle', v)} hint="แสดงเป็นสีฟ้าใต้หัวข้อหลัก" />
              <Field label="คำอธิบาย" value={settings.hero.description} onChange={v => upH('description', v)} rows={4} />
            </Card>
            <Card title="รูปพื้นหลัง">
              <ImageUpload value={settings.hero.image} onChange={v => upH('image', v)} />
            </Card>
          </div>

          <Card title="จุดเด่น 3 ข้อ (Features)">
            <div className="grid sm:grid-cols-3 gap-4">
              {settings.hero.features.map((f, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 space-y-3">
                  <span className="inline-flex w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold items-center justify-center">{i + 1}</span>
                  <Field label="ชื่อ" value={f.title} onChange={v => upH('features', settings.hero.features.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <Field label="รายละเอียด" value={f.desc} onChange={v => upH('features', settings.hero.features.map((x, j) => j === i ? { ...x, desc: v } : x))} />
                </div>
              ))}
            </div>
          </Card>
        </Tabs.Content>

        {/* ── SERVICES ── */}
        <Tabs.Content value="services" className="outline-none space-y-5">
          <Card title="หัวข้อ Section">
            <Field label="Section Title" value={settings.services.sectionTitle} onChange={v => upSv('sectionTitle', v)} />
          </Card>

          {settings.services.items.map((item, i) => (
            <Card key={i} title={`บริการที่ ${i + 1}`} right={<span className="text-xs text-gray-400">{item.title}</span>}>
              <div className="grid lg:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <Field label="ชื่อบริการ" value={item.title} onChange={v => upSv('items', settings.services.items.map((x, j) => j === i ? { ...x, title: v } : x))} />
                  <Field label="คำอธิบาย" value={item.desc} onChange={v => upSv('items', settings.services.items.map((x, j) => j === i ? { ...x, desc: v } : x))} rows={4} />
                </div>
                <div>
                  <label className={L}>รูปภาพ</label>
                  <ImageUpload value={item.image} onChange={url => upSv('items', settings.services.items.map((x, j) => j === i ? { ...x, image: url } : x))} />
                </div>
              </div>
            </Card>
          ))}
        </Tabs.Content>

        {/* ── WHY ── */}
        <Tabs.Content value="why" className="outline-none space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ข้อความหลัก">
              <Field label="หัวข้อหลัก" value={settings.why.title} onChange={v => upW('title', v)} />
              <Field label="หัวข้อต่อเนื่อง" value={settings.why.titleBlue} onChange={v => upW('titleBlue', v)} hint="แสดงเป็นสีน้ำเงินต่อท้ายหัวข้อหลัก" />
              <Field label="คำอธิบาย" value={settings.why.description} onChange={v => upW('description', v)} rows={4} />
            </Card>
            <Card title="รูปภาพประกอบ">
              <ImageUpload value={settings.why.image} onChange={v => upW('image', v)} />
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <Card title="ปัญหาที่พบ" right={<Count n={settings.why.symptoms.length} unit="รายการ" />}>
              <div className="space-y-2">
                {settings.why.symptoms.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input value={s.label} onChange={e => upW('symptoms', settings.why.symptoms.map((x, j) => j === i ? { label: e.target.value } : x))} className={F} placeholder="กรอกปัญหา..." />
                    <IconBtn danger onClick={() => upW('symptoms', settings.why.symptoms.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                ))}
              </div>
              <Add label="เพิ่มรายการ" onClick={() => upW('symptoms', [...settings.why.symptoms, { label: '' }])} />
            </Card>

            <Card title="ผลลัพธ์ที่ดี" right={<Count n={settings.why.benefits.length} unit="รายการ" />}>
              <div className="space-y-3">
                {settings.why.benefits.map((b, i) => (
                  <div key={i} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <input value={b.title} onChange={e => upW('benefits', settings.why.benefits.map((x, j) => j === i ? { ...x, title: e.target.value } : x))} className={F} placeholder="หัวข้อ" />
                      <input value={b.desc} onChange={e => upW('benefits', settings.why.benefits.map((x, j) => j === i ? { ...x, desc: e.target.value } : x))} className={F} placeholder="คำอธิบาย" />
                    </div>
                    <IconBtn danger onClick={() => upW('benefits', settings.why.benefits.filter((_, j) => j !== i))}>
                      <Trash2 className="w-4 h-4" />
                    </IconBtn>
                  </div>
                ))}
              </div>
              <Add label="เพิ่มรายการ" onClick={() => upW('benefits', [...settings.why.benefits, { title: '', desc: '' }])} />
            </Card>
          </div>
        </Tabs.Content>

        {/* ── PORTFOLIO ── */}
        <Tabs.Content value="portfolio" className="outline-none space-y-5">
          <Card title="หัวข้อ Section">
            <Field label="Section Title" value={settings.portfolio.sectionTitle} onChange={v => upP('sectionTitle', v)} />
          </Card>

          <Card title="ลูกค้า" right={<Count n={settings.portfolio.clients.length} unit="ราย" />}>
            <div className="space-y-2">
              {settings.portfolio.clients.map((c, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <ClientLogoUpload
                    logo={c.logo}
                    abbr={c.abbr}
                    onChange={url => upP('clients', settings.portfolio.clients.map((x, j) => j === i ? { ...x, logo: url } : x))}
                  />
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input value={c.name} onChange={e => upP('clients', settings.portfolio.clients.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className={F} placeholder="ชื่อบริษัท" />
                    <input value={c.clientType} onChange={e => upP('clients', settings.portfolio.clients.map((x, j) => j === i ? { ...x, clientType: e.target.value } : x))} className={F} placeholder="ประเภทธุรกิจ" />
                  </div>
                  <IconBtn danger onClick={() => upP('clients', settings.portfolio.clients.filter((_, j) => j !== i))}>
                    <Trash2 className="w-4 h-4" />
                  </IconBtn>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-gray-400">ถ้าไม่อัปโหลดโลโก้ หน้าเว็บจะแสดงอักษรย่อแทน</p>
            <Add label="เพิ่มลูกค้า" onClick={() => upP('clients', [...settings.portfolio.clients, { name: '', clientType: '', abbr: '', logo: '' }])} />
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5 flex items-start gap-3">
            <ImageIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 leading-relaxed">
              <b>แกลเลอรี่ผลงานและ Case Study</b> ในหน้านี้ดึงข้อมูลจากหน้า &quot;จัดการผลงาน&quot; โดยอัตโนมัติ (แสดง 8 ผลงานแรก)
              — ไปแก้ไขได้ที่{' '}
              <a href="/admin/portfolio" className="font-bold underline hover:text-amber-900">จัดการผลงาน →</a>
            </div>
          </div>
        </Tabs.Content>

        {/* ── FAQ ── */}
        <Tabs.Content value="faq" className="outline-none space-y-5">
          <Card title="คำถามที่พบบ่อย" right={<Count n={settings.faq.items.length} unit="คำถาม" />}>
            <div className="space-y-3">
              {settings.faq.items.map((item, i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div className="flex-1 space-y-2.5">
                      <input value={item.question} onChange={e => upF('items', settings.faq.items.map((x, j) => j === i ? { ...x, question: e.target.value } : x))} className={F} placeholder="คำถาม" />
                      <textarea rows={3} value={item.answer} onChange={e => upF('items', settings.faq.items.map((x, j) => j === i ? { ...x, answer: e.target.value } : x))} className={cn(F, 'resize-none')} placeholder="คำตอบ" />
                    </div>
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <IconBtn disabled={i === 0} onClick={() => { const u = [...settings.faq.items]; [u[i-1], u[i]] = [u[i], u[i-1]]; upF('items', u) }}>
                        <ChevronUp className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn disabled={i >= settings.faq.items.length - 1} onClick={() => { const u = [...settings.faq.items]; [u[i], u[i+1]] = [u[i+1], u[i]]; upF('items', u) }}>
                        <ChevronDown className="w-4 h-4" />
                      </IconBtn>
                      <IconBtn danger onClick={() => upF('items', settings.faq.items.filter((_, j) => j !== i))}>
                        <Trash2 className="w-4 h-4" />
                      </IconBtn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Add label="เพิ่มคำถาม" onClick={() => upF('items', [...settings.faq.items, { question: '', answer: '' }])} />
          </Card>
        </Tabs.Content>

      </Tabs.Root>
    </div>
  )
}
