'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, CheckCircle2, Upload, X, Plus, Trash2,
  Sparkles, ImageIcon, Trophy, ExternalLink, BarChart3, Settings2, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Types ──────────────────────────────────────────────────── */
interface Stat { value: string; label: string }
interface PortfolioItem { src: string; images: string[]; title: string; category: string; tag: string; desc: string }

interface SettingsState {
  hero: { badge: string; title: string; titleOrange: string; description: string }
  stats: Stat[]
  items: PortfolioItem[]
  caseStudy: {
    label: string; title: string; description: string; image: string
    stat1Value: string; stat1Label: string; stat2Value: string; stat2Label: string
  }
}

const DEFAULTS: SettingsState = {
  hero: { badge: 'Our Portfolio', title: 'ผลงาน', titleOrange: 'ของเรา', description: '' },
  stats: [],
  items: [],
  caseStudy: { label: 'Featured Case Study', title: '', description: '', image: '', stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '' },
}

/* ─── Styles ─────────────────────────────────────────────────── */
const INPUT = 'w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-800 placeholder:text-slate-400 transition-all shadow-sm'
const LABEL = 'block text-[13px] font-semibold text-slate-700 mb-2'
const HELP_TEXT = 'text-xs text-slate-500 mt-1.5'

const TABS = [
  { value: 'hero',      label: '1. Hero & สถิติ', icon: Sparkles },
  { value: 'items',     label: '2. จัดการผลงาน',  icon: ImageIcon },
  { value: 'casestudy', label: '3. Case Study',   icon: BarChart3 },
]

/* ─── Sub-components ─────────────────────────────────────────────────────────── */
function SectionCard({ title, subtitle, children, headerAction }: { title: string; subtitle?: string; children: React.ReactNode; headerAction?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden mb-8 transition-all hover:shadow-md">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        </div>
        {headerAction}
      </div>
      <div className="p-6 sm:p-8 space-y-6">{children}</div>
    </div>
  )
}

function Field({ label, value, onChange, rows, placeholder, hint }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; hint?: string
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      {rows
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={cn(INPUT, 'resize-none')} placeholder={placeholder} />
        : <input value={value} onChange={e => onChange(e.target.value)} className={INPUT} placeholder={placeholder} />}
      {hint && <p className={HELP_TEXT}>{hint}</p>}
    </div>
  )
}

function ImageUpload({ label, value, onChange }: { label?: string; value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) onChange(url)
    } catch { alert('อัปโหลดไม่สำเร็จ') }
    setUploading(false)
    e.target.value = ''
  }

  return (
    <div>
      {label && <label className={LABEL}>{label}</label>}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {value ? (
          <div className="relative rounded-xl overflow-hidden w-full sm:w-48 h-32 bg-slate-100 group shrink-0 shadow-sm border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <label className="cursor-pointer bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm">
                <Upload className="w-3.5 h-3.5" />เปลี่ยน
                <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
              </label>
              <button
                onClick={() => onChange('')}
                className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <X className="w-3.5 h-3.5" />ลบรูป
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full sm:w-48 h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group shrink-0">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <span className="text-xs text-slate-500 group-hover:text-blue-600 font-medium">อัปโหลดรูปภาพ</span>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
        )}
        <div className="flex-1 w-full space-y-2">
          <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="หรือวาง URL รูปภาพ..."
            className={INPUT}
          />
          <p className={HELP_TEXT}>รองรับไฟล์ .png, .jpg, .webp ขนาดไม่เกิน 5MB</p>
        </div>
      </div>
    </div>
  )
}

function GalleryAddSlot({ onAdd }: { onAdd: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setUploading(true)
    for (const file of files) {
      try {
        const fd = new FormData(); fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const { url } = await res.json()
        if (url) onAdd(url)
      } catch { alert('อัปโหลดไม่สำเร็จ') }
    }
    setUploading(false); e.target.value = ''
  }

  return (
    <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/40 transition-colors bg-slate-50/50">
      {uploading
        ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        : <><Plus className="w-5 h-5" /><span className="text-[11px] font-medium">เพิ่มรูป</span></>}
      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
    </label>
  )
}

function SaveButton({ saving, saved, onClick }: { saving: boolean; saved: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm w-full sm:w-auto min-w-[160px]',
        saved
          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20'
          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 disabled:opacity-60'
      )}
    >
      {saving ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : saved ? (
        <Check className="w-4 h-4" />
      ) : (
        <Save className="w-4 h-4" />
      )}
      {saved ? 'บันทึกสำเร็จ' : saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function PortfolioSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  
  // Per-tab save state
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/portfolio-settings').then(r => r.json()).then((d: SettingsState) => {
      setSettings({ hero: d.hero, stats: d.stats, items: d.items, caseStudy: d.caseStudy })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const saveTab = useCallback(async (tab: string) => {
    setSaving(p => ({ ...p, [tab]: true }))
    await fetch('/api/portfolio-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(p => ({ ...p, [tab]: false }))
    setSaved(p => ({ ...p, [tab]: true }))
    setTimeout(() => setSaved(p => ({ ...p, [tab]: false })), 2500)
  }, [settings])

  const upH = <K extends keyof SettingsState['hero']>(k: K, v: SettingsState['hero'][K]) => setSettings(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const upStats = (v: Stat[]) => setSettings(p => ({ ...p, stats: v }))
  const upItems = (v: PortfolioItem[]) => setSettings(p => ({ ...p, items: v }))
  const upCS = <K extends keyof SettingsState['caseStudy']>(k: K, v: SettingsState['caseStudy'][K]) => setSettings(p => ({ ...p, caseStudy: { ...p.caseStudy, [k]: v } }))

  const categories = Array.from(new Set(settings.items.map(i => i.category).filter(Boolean)))

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <p className="text-slate-500 text-sm animate-pulse">กำลังโหลดข้อมูล...</p>
    </div>
  )

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen pb-32">

      {/* ── Page header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ตั้งค่าหน้าผลงาน</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการเนื้อหาทุก section ของหน้า /portfolio</p>
          </div>
        </div>
        <a href="/portfolio" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-5 py-3 rounded-xl transition-all">
          <ExternalLink className="w-4 h-4" />ดูหน้าเว็บไซต์จริง
        </a>
      </div>

      <Tabs.Root defaultValue="hero" className="flex flex-col lg:flex-row gap-8">
        
        {/* ── Tabs List ── */}
        <div className="lg:w-64 shrink-0">
          <Tabs.List className="flex flex-row lg:flex-col gap-2 sticky top-8 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <Tabs.Trigger key={tab.value} value={tab.value}
                  className={cn(
                    'flex items-center gap-2.5 w-full px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap',
                    'data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-indigo-500/20',
                    'data-[state=inactive]:bg-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-50 border border-transparent data-[state=inactive]:border-slate-200/60'
                  )}>
                  <Icon className="w-4 h-4" />{tab.label}
                </Tabs.Trigger>
              )
            })}
          </Tabs.List>
        </div>

        {/* ── Content Area ── */}
        <div className="flex-1">
          
          {/* ── HERO & STATS ── */}
          <Tabs.Content value="hero" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionCard title="ข้อความ Hero" subtitle="ข้อความส่วนบนสุดของหน้าผลงาน">
              <div className="grid sm:grid-cols-3 gap-5">
                <Field label="ป้ายกำกับ (Badge)" value={settings.hero.badge} onChange={v => upH('badge', v)} placeholder="Our Portfolio" />
                <Field label="หัวข้อ (สีขาว)" value={settings.hero.title} onChange={v => upH('title', v)} placeholder="ผลงาน" />
                <Field label="หัวข้อต่อ (สีส้ม)" value={settings.hero.titleOrange} onChange={v => upH('titleOrange', v)} placeholder="ของเรา" />
              </div>
              <Field label="คำอธิบาย" value={settings.hero.description} onChange={v => upH('description', v)} rows={3} hint="เว้นบรรทัดใหม่ได้โดยการกด Enter" />
            </SectionCard>

            <SectionCard 
              title="ตัวเลขสถิติ" 
              subtitle="ข้อมูลไฮไลต์จำนวน 4 แถว"
              headerAction={<span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">{settings.stats.length} รายการ</span>}
            >
              <div className="grid sm:grid-cols-2 gap-5">
                {settings.stats.map((st, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 relative group">
                    <button onClick={() => upStats(settings.stats.filter((_, j) => j !== i))}
                      className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="space-y-4 pr-8">
                      <Field label="ตัวเลข" value={st.value} onChange={v => upStats(settings.stats.map((x, j) => j === i ? { ...x, value: v } : x))} placeholder="500+" />
                      <Field label="คำอธิบาย" value={st.label} onChange={v => upStats(settings.stats.map((x, j) => j === i ? { ...x, label: v } : x))} placeholder="โครงการสำเร็จ" />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => upStats([...settings.stats, { value: '', label: '' }])}
                className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-indigo-50/50"
              >
                <Plus className="w-4 h-4" />เพิ่มสถิติ
              </button>
            </SectionCard>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.hero} saved={!!saved.hero} onClick={() => saveTab('hero')} />
            </div>
          </Tabs.Content>

          {/* ── ITEMS ── */}
          <Tabs.Content value="items" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8 flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600 shrink-0">
                <Settings2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-indigo-900 text-sm mb-1">การสร้างหมวดหมู่แบบอัตโนมัติ</h4>
                <p className="text-sm text-indigo-700/80 leading-relaxed">
                  แถบปุ่มกรองผลงานในหน้าเว็บ จะดึงข้อมูลจากช่อง "หมวดหมู่" ของผลงานที่คุณกรอกไว้อัตโนมัติ 
                  <br className="hidden md:block"/>ตอนนี้น่าจะมีหมวดหมู่คือ: <strong className="text-indigo-900 bg-indigo-100/50 px-2 py-0.5 rounded-md ml-1">{categories.length > 0 ? categories.join(', ') : '-'}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {settings.items.map((item, i) => (
                <SectionCard key={i} title={`ผลงานที่ ${i + 1}`}
                  headerAction={
                    <button onClick={() => upItems(settings.items.filter((_, j) => j !== i))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> ลบผลงาน
                    </button>
                  }>
                  
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-5">
                      <Field label="ชื่อโปรเจกต์" value={item.title} onChange={v => upItems(settings.items.map((x, j) => j === i ? { ...x, title: v } : x))} />
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="หมวดหมู่" value={item.category} onChange={v => upItems(settings.items.map((x, j) => j === i ? { ...x, category: v } : x))} placeholder="โรงพยาบาล" />
                        <Field label="ป้ายกำกับ (Tag)" value={item.tag} onChange={v => upItems(settings.items.map((x, j) => j === i ? { ...x, tag: v } : x))} placeholder="ล้างถังเก็บน้ำ" />
                      </div>
                      <Field label="คำอธิบาย" value={item.desc} onChange={v => upItems(settings.items.map((x, j) => j === i ? { ...x, desc: v } : x))} rows={4} />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      <ImageUpload label="รูปปก (แสดงหน้าการ์ด)" value={item.src} onChange={url => upItems(settings.items.map((x, j) => j === i ? { ...x, src: url } : x))} />
                      
                      <div className="pt-2 border-t border-slate-100">
                        <label className={LABEL}>
                          รูปภาพเพิ่มเติม ({(item.images ?? []).length} รูป)
                        </label>
                        <p className={HELP_TEXT + " mb-3"}>คลิกการ์ดแล้วจะเลื่อนดูรูปเพิ่มเติมในแบบ Lightbox</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {(item.images ?? []).map((img, gi) => (
                            <div key={gi} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group/img shadow-sm">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => upItems(settings.items.map((x, j) => j === i ? { ...x, images: (x.images ?? []).filter((_, k) => k !== gi) } : x))}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity backdrop-blur-[2px]">
                                <span className="bg-red-500 text-white p-1.5 rounded-lg shadow-sm"><X className="w-4 h-4" /></span>
                              </button>
                            </div>
                          ))}
                          <GalleryAddSlot onAdd={url => upItems(settings.items.map((x, j) => j === i ? { ...x, images: [...(x.images ?? []), url] } : x))} />
                        </div>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>

            <button
              onClick={() => upItems([...settings.items, { src: '', images: [], title: '', category: '', tag: '', desc: '' }])}
              className="w-full py-5 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors flex flex-col items-center justify-center gap-2"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              เพิ่มผลงานใหม่
            </button>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.items} saved={!!saved.items} onClick={() => saveTab('items')} />
            </div>
          </Tabs.Content>

          {/* ── CASE STUDY ── */}
          <Tabs.Content value="casestudy" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <SectionCard title="เนื้อหาเคสตัวอย่าง">
                <div className="space-y-5">
                  <Field label="ป้ายกำกับ (Label)" value={settings.caseStudy.label} onChange={v => upCS('label', v)} placeholder="Featured Case Study" />
                  <Field label="หัวข้อ (ชื่อเคส)" value={settings.caseStudy.title} onChange={v => upCS('title', v)} rows={2} hint="ขึ้นบรรทัดใหม่ได้ด้วยการกด Enter" />
                  <Field label="คำอธิบายสรุป" value={settings.caseStudy.description} onChange={v => upCS('description', v)} rows={3} />
                </div>
              </SectionCard>
              
              <SectionCard title="ภาพประกอบเคส">
                <ImageUpload value={settings.caseStudy.image} onChange={url => upCS('image', url)} />
              </SectionCard>
            </div>

            <SectionCard title="สถิติไฮไลต์ของเคส (Highlighted Stats)">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-2xl border border-slate-200/60 p-6 space-y-4 bg-orange-50/30">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 font-bold text-xs">
                    สถิติที่ 1 (ธีมสีส้ม)
                  </div>
                  <Field label="ตัวเลขโดดเด่น" value={settings.caseStudy.stat1Value} onChange={v => upCS('stat1Value', v)} placeholder="2 วัน" />
                  <Field label="คำอธิบาย" value={settings.caseStudy.stat1Label} onChange={v => upCS('stat1Label', v)} placeholder="ระยะเวลา" />
                </div>
                
                <div className="rounded-2xl border border-slate-200/60 p-6 space-y-4 bg-emerald-50/30">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs">
                    สถิติที่ 2 (ธีมสีเขียว)
                  </div>
                  <Field label="ตัวเลขโดดเด่น" value={settings.caseStudy.stat2Value} onChange={v => upCS('stat2Value', v)} placeholder="100%" />
                  <Field label="คำอธิบาย" value={settings.caseStudy.stat2Label} onChange={v => upCS('stat2Label', v)} placeholder="น้ำใสสะอาด" />
                </div>
              </div>
            </SectionCard>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.casestudy} saved={!!saved.casestudy} onClick={() => saveTab('casestudy')} />
            </div>
          </Tabs.Content>

        </div>
      </Tabs.Root>
    </div>
  )
}
