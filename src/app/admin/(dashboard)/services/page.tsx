'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, CheckCircle2, Upload, X, Plus, Trash2,
  Eye, Settings2, GripVertical, ChevronUp, ChevronDown, Check
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Feature { title: string; desc: string }
interface ServiceItem { title: string; desc: string; image: string }
interface Symptom { label: string }
interface Benefit { title: string; desc: string }
interface Client { name: string; clientType: string; abbr: string }
interface GalleryItem { src: string; alt: string }
interface CaseStudy { image: string; title: string; description: string; duration: string; result: string }
interface FaqItem { question: string; answer: string }

interface SettingsState {
  hero: {
    title: string
    subtitle: string
    description: string
    image: string
    features: Feature[]
  }
  services: {
    sectionTitle: string
    items: ServiceItem[]
  }
  why: {
    title: string
    titleBlue: string
    description: string
    image: string
    symptoms: Symptom[]
    benefits: Benefit[]
  }
  portfolio: {
    sectionTitle: string
    clients: Client[]
    gallery: GalleryItem[]
    caseStudy: CaseStudy
  }
  faq: {
    items: FaqItem[]
  }
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const INPUT = 'w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white border focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-sm text-slate-800 placeholder:text-slate-400 transition-all shadow-sm'
const LABEL = 'block text-[13px] font-semibold text-slate-700 mb-2'
const HELP_TEXT = 'text-xs text-slate-500 mt-1.5'

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function ImageField({
  label,
  value,
  onChange,
  className
}: {
  label: string
  value: string
  onChange: (url: string) => void
  className?: string
}) {
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
    <div className={className}>
      <label className={LABEL}>{label}</label>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {value ? (
          <div className="relative rounded-xl overflow-hidden w-full sm:w-48 h-32 bg-slate-100 group shrink-0 shadow-sm border border-slate-200">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-all flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <label className="cursor-pointer bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5 shadow-sm">
                <Upload className="w-3.5 h-3.5" />เปลี่ยน
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
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
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
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

function SaveButton({
  saving,
  saved,
  onClick,
}: {
  saving: boolean
  saved: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-sm w-full sm:w-auto min-w-[140px]',
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

// ─── Default fallback ─────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: SettingsState = {
  hero: {
    title: 'บริการล้างถังเก็บน้ำ',
    subtitle: 'สะอาด ปลอดภัย ได้มาตรฐาน',
    description: 'เราดูแลความสะอาดของถังเก็บน้ำ ด้วยทีมงานมืออาชีพ อุปกรณ์ครบครัน ปลอดภัยทั้งคุณและคนในครอบครัว',
    image: '/cover/coverherosr.png',
    features: [
      { title: 'ปลอดภัย', desc: 'ไม่เป็นอันตรายต่อสุขภาพ' },
      { title: 'ทีมงานมืออาชีพ', desc: 'ประสบการณ์กว่า 10 ปี' },
      { title: 'ได้มาตรฐาน', desc: 'ตามมาตรฐานการทำงาน' },
    ],
  },
  services: {
    sectionTitle: 'บริการของเรา',
    items: [
      { title: 'ล้างถังเก็บน้ำ', desc: 'ล้างทำความสะอาดถังเก็บน้ำบนดินและใต้ดิน', image: '/article/service_tank_cleaning.png' },
      { title: 'ล้างถังบำบัดน้ำเสีย', desc: 'บริการสูบสิ่งปฏิกูลและทำความสะอาดถังบำบัดน้ำเสีย', image: '/article/service_wastewater_tank.png' },
      { title: 'ระบบบำบัดน้ำเสีย', desc: 'ออกแบบ ติดตั้ง และปรับปรุงระบบบำบัดน้ำเสีย', image: '/article/service_wastewater_system.png' },
      { title: 'ผู้ควบคุมระบบบำบัดน้ำเสีย', desc: 'บริการดูแลและเดินระบบบำบัดน้ำเสียโดยผู้เชี่ยวชาญ', image: '/article/service_wastewater_operator.png' },
    ],
  },
  why: {
    title: 'ทำไมต้องล้างถังเก็บน้ำ',
    titleBlue: 'อย่างน้อยทุก 6 เดือน?',
    description: 'ถังเก็บน้ำที่ไม่ได้รับการดูแล จะเป็นแหล่งสะสมของตะกอน สิ่งสกปรก แบคทีเรีย และเชื้อโรคต่างๆ',
    image: '/article/coversevice.png',
    symptoms: [
      { label: 'ตะกอนดินและสิ่งสกปรก' },
      { label: 'คราบตะไคร่น้ำ' },
      { label: 'แบคทีเรียและเชื้อโรค' },
      { label: 'สนิมและสารตกค้าง' },
    ],
    benefits: [
      { title: 'สุขภาพดี', desc: 'ลดความเสี่ยงในการเกิดโรค' },
      { title: 'น้ำใส สะอาด', desc: 'ปลอดภัยต่อการอุปโภคบริโภค' },
      { title: 'ยืดอายุการใช้งาน', desc: 'ของถังและระบบน้ำ' },
      { title: 'ประหยัดค่าใช้จ่าย', desc: 'ลดปัญหาการอุดตัน และซ่อมบำรุง' },
    ],
  },
  portfolio: {
    sectionTitle: 'ผลงานที่ผ่านมา',
    clients: [
      { name: 'โรงแรมทวินโลตัส', clientType: 'โรงแรม & รีสอร์ท', abbr: 'TL' },
      { name: 'นิคมอุตสาหกรรมภาคใต้', clientType: 'โรงงานอุตสาหกรรม', abbr: 'SI' },
    ],
    gallery: [
      { src: 'https://images.unsplash.com/photo-1705708551758-76b153fa536e?q=80&w=800&auto=format&fit=crop', alt: 'ถังเก็บน้ำขนาดใหญ่' },
    ],
    caseStudy: {
      image: 'https://images.unsplash.com/photo-1779517226302-029fb0f68ba1?q=80&w=1200&auto=format&fit=crop',
      title: 'โครงการล้างถังเก็บน้ำใส นิคมอุตสาหกรรม',
      description: 'พบปัญหาคราบสนิมและตะกอนดินสะสมหนาในถังเก็บน้ำขนาด 100,000 ลิตร',
      duration: '2 วัน',
      result: 'น้ำใสสะอาด 100%',
    },
  },
  faq: {
    items: [
      { question: 'ควรล้างถังเก็บน้ำทุกกี่เดือน?', answer: 'ตามมาตรฐานกระทรวงสาธารณสุข แนะนำให้ล้างทุกๆ 6 เดือน' },
    ],
  },
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ServicesSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  // Per-tab save state
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch('/api/services-settings')
      .then(r => r.json())
      .then((d: SettingsState) => {
        setSettings({
          hero: d.hero,
          services: d.services,
          why: d.why,
          portfolio: d.portfolio,
          faq: d.faq,
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const saveTab = useCallback(async (tab: string) => {
    setSaving(p => ({ ...p, [tab]: true }))
    await fetch('/api/services-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(p => ({ ...p, [tab]: false }))
    setSaved(p => ({ ...p, [tab]: true }))
    setTimeout(() => setSaved(p => ({ ...p, [tab]: false })), 2500)
  }, [settings])

  function updateHero<K extends keyof SettingsState['hero']>(key: K, val: SettingsState['hero'][K]) {
    setSettings(p => ({ ...p, hero: { ...p.hero, [key]: val } }))
  }
  function updateServices<K extends keyof SettingsState['services']>(key: K, val: SettingsState['services'][K]) {
    setSettings(p => ({ ...p, services: { ...p.services, [key]: val } }))
  }
  function updateWhy<K extends keyof SettingsState['why']>(key: K, val: SettingsState['why'][K]) {
    setSettings(p => ({ ...p, why: { ...p.why, [key]: val } }))
  }
  function updatePortfolio<K extends keyof SettingsState['portfolio']>(key: K, val: SettingsState['portfolio'][K]) {
    setSettings(p => ({ ...p, portfolio: { ...p.portfolio, [key]: val } }))
  }
  function updateFaq<K extends keyof SettingsState['faq']>(key: K, val: SettingsState['faq'][K]) {
    setSettings(p => ({ ...p, faq: { ...p.faq, [key]: val } }))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-slate-500 text-sm animate-pulse">กำลังโหลดข้อมูล...</p>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto min-h-screen pb-32">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0">
            <Settings2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">ตั้งค่าหน้าบริการ</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการเนื้อหาในหน้า /services ทั้งหมด</p>
          </div>
        </div>
        <a
          href="/services"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-5 py-3 rounded-xl transition-all"
        >
          <Eye className="w-4 h-4" />ดูหน้าเว็บไซต์จริง
        </a>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="hero" className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <Tabs.List className="flex flex-row lg:flex-col gap-2 sticky top-8 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {[
              { value: 'hero', label: '1. ส่วนบนสุด (Hero)' },
              { value: 'services', label: '2. รายการบริการ' },
              { value: 'why', label: '3. ทำไมต้องล้าง' },
              { value: 'portfolio', label: '4. ผลงานที่ผ่านมา' },
              { value: 'faq', label: '5. คำถามที่พบบ่อย' },
            ].map(tab => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  'flex items-center w-full px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all whitespace-nowrap',
                  'data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-blue-500/20',
                  'data-[state=inactive]:bg-white data-[state=inactive]:text-slate-600 data-[state=inactive]:hover:bg-slate-50 border border-transparent data-[state=inactive]:border-slate-200/60'
                )}
              >
                {tab.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {/* ── Tab: Hero ── */}
          <Tabs.Content value="hero" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionCard title="ข้อความหลัก" subtitle="ส่วนหัวแรกสุดเมื่อผู้ใช้เข้ามาที่หน้าบริการ">
              <div className="space-y-5">
                <div>
                  <label className={LABEL}>หัวข้อ (Title)</label>
                  <input value={settings.hero.title} onChange={e => updateHero('title', e.target.value)} className={INPUT} />
                </div>
                <div>
                  <label className={LABEL}>หัวข้อรอง (Subtitle)</label>
                  <input value={settings.hero.subtitle} onChange={e => updateHero('subtitle', e.target.value)} className={INPUT} />
                  <p className={HELP_TEXT}>ข้อความสีฟ้าโดดเด่นใต้หัวข้อ</p>
                </div>
                <div>
                  <label className={LABEL}>คำอธิบาย</label>
                  <textarea rows={3} value={settings.hero.description} onChange={e => updateHero('description', e.target.value)} className={cn(INPUT, 'resize-none')} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="รูปภาพประกอบ" subtitle="รูปภาพพื้นหลังหรือรูปที่แสดงด้านข้าง">
              <ImageField label="เลือกรูปภาพ" value={settings.hero.image} onChange={v => updateHero('image', v)} />
            </SectionCard>

            <SectionCard title="จุดเด่น (Features)" subtitle="จุดขาย 3 ข้อที่จะแสดงคู่กับภาพหลัก">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {settings.hero.features.map((f, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm mb-2">
                      {i + 1}
                    </div>
                    <div>
                      <label className={LABEL}>หัวข้อ</label>
                      <input
                        value={f.title}
                        onChange={e => {
                          const updated = settings.hero.features.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)
                          updateHero('features', updated)
                        }}
                        className={INPUT}
                      />
                    </div>
                    <div>
                      <label className={LABEL}>คำอธิบายสั้นๆ</label>
                      <input
                        value={f.desc}
                        onChange={e => {
                          const updated = settings.hero.features.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x)
                          updateHero('features', updated)
                        }}
                        className={INPUT}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.hero} saved={!!saved.hero} onClick={() => saveTab('hero')} />
            </div>
          </Tabs.Content>

          {/* ── Tab: Services ── */}
          <Tabs.Content value="services" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionCard title="ส่วนหัว (Section Header)">
              <div>
                <label className={LABEL}>หัวข้อส่วน</label>
                <input value={settings.services.sectionTitle} onChange={e => updateServices('sectionTitle', e.target.value)} className={INPUT} />
              </div>
            </SectionCard>

            <div className="space-y-6">
              {settings.services.items.map((item, i) => (
                <SectionCard 
                  key={i} 
                  title={`บริการย่อยที่ ${i + 1}`}
                  headerAction={
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                      Service #{i + 1}
                    </span>
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-5">
                      <div>
                        <label className={LABEL}>ชื่อบริการ</label>
                        <input
                          value={item.title}
                          onChange={e => {
                            const updated = settings.services.items.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)
                            updateServices('items', updated)
                          }}
                          className={INPUT}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>รายละเอียดแบบย่อ</label>
                        <textarea
                          rows={4}
                          value={item.desc}
                          onChange={e => {
                            const updated = settings.services.items.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x)
                            updateServices('items', updated)
                          }}
                          className={cn(INPUT, 'resize-none')}
                        />
                      </div>
                    </div>
                    <div>
                      <ImageField
                        label="รูปภาพประกอบ"
                        value={item.image}
                        onChange={url => {
                          const updated = settings.services.items.map((x, idx) => idx === i ? { ...x, image: url } : x)
                          updateServices('items', updated)
                        }}
                      />
                    </div>
                  </div>
                </SectionCard>
              ))}
            </div>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.services} saved={!!saved.services} onClick={() => saveTab('services')} />
            </div>
          </Tabs.Content>

          {/* ── Tab: Why ── */}
          <Tabs.Content value="why" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionCard title="ข้อความหลัก">
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={LABEL}>หัวข้อหลัก</label>
                    <input value={settings.why.title} onChange={e => updateWhy('title', e.target.value)} className={INPUT} />
                  </div>
                  <div>
                    <label className={LABEL}>หัวข้อต่อเนื่อง (สีน้ำเงิน)</label>
                    <input value={settings.why.titleBlue} onChange={e => updateWhy('titleBlue', e.target.value)} className={INPUT} />
                  </div>
                </div>
                <div>
                  <label className={LABEL}>คำอธิบาย</label>
                  <textarea rows={3} value={settings.why.description} onChange={e => updateWhy('description', e.target.value)} className={cn(INPUT, 'resize-none')} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="รูปภาพประกอบ">
              <ImageField label="อัปโหลดรูป" value={settings.why.image} onChange={v => updateWhy('image', v)} />
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SectionCard title="ปัญหา (Symptoms)">
                <div className="space-y-3">
                  {settings.why.symptoms.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-2 pr-3 rounded-xl border border-slate-200/60 group">
                      <div className="cursor-grab text-slate-300 px-1">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <input
                        value={s.label}
                        onChange={e => {
                          const updated = settings.why.symptoms.map((x, idx) => idx === i ? { label: e.target.value } : x)
                          updateWhy('symptoms', updated)
                        }}
                        className={cn(INPUT, 'flex-1 py-2')}
                        placeholder="กรอกปัญหา..."
                      />
                      <button
                        onClick={() => updateWhy('symptoms', settings.why.symptoms.filter((_, idx) => idx !== i))}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateWhy('symptoms', [...settings.why.symptoms, { label: '' }])}
                  className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/50"
                >
                  <Plus className="w-4 h-4" />เพิ่มรายการ
                </button>
              </SectionCard>

              <SectionCard title="ผลลัพธ์ที่ดี (Benefits)">
                <div className="space-y-4">
                  {settings.why.benefits.map((b, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3 relative group">
                      <button
                        onClick={() => updateWhy('benefits', settings.why.benefits.filter((_, idx) => idx !== i))}
                        className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="pr-8">
                        <label className={LABEL}>หัวข้อ</label>
                        <input
                          value={b.title}
                          onChange={e => {
                            const updated = settings.why.benefits.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x)
                            updateWhy('benefits', updated)
                          }}
                          className={cn(INPUT, 'py-2')}
                        />
                      </div>
                      <div>
                        <label className={LABEL}>คำอธิบาย</label>
                        <input
                          value={b.desc}
                          onChange={e => {
                            const updated = settings.why.benefits.map((x, idx) => idx === i ? { ...x, desc: e.target.value } : x)
                            updateWhy('benefits', updated)
                          }}
                          className={cn(INPUT, 'py-2')}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => updateWhy('benefits', [...settings.why.benefits, { title: '', desc: '' }])}
                  className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/50"
                >
                  <Plus className="w-4 h-4" />เพิ่มรายการ
                </button>
              </SectionCard>
            </div>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.why} saved={!!saved.why} onClick={() => saveTab('why')} />
            </div>
          </Tabs.Content>

          {/* ── Tab: Portfolio ── */}
          <Tabs.Content value="portfolio" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionCard title="ส่วนหัว (Section Header)">
              <div>
                <label className={LABEL}>หัวข้อส่วน</label>
                <input value={settings.portfolio.sectionTitle} onChange={e => updatePortfolio('sectionTitle', e.target.value)} className={INPUT} />
              </div>
            </SectionCard>

            <SectionCard title="ลูกค้ารายใหญ่ (Clients Logos)">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {settings.portfolio.clients.map((c, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 relative group">
                    <button
                      onClick={() => updatePortfolio('clients', settings.portfolio.clients.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-white text-slate-400 hover:text-red-500 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="space-y-3">
                      <div>
                        <label className={LABEL}>ชื่อบริษัท</label>
                        <input
                          value={c.name}
                          onChange={e => {
                            const updated = settings.portfolio.clients.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x)
                            updatePortfolio('clients', updated)
                          }}
                          className={cn(INPUT, 'py-2')}
                        />
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className={LABEL}>ประเภทธุรกิจ</label>
                          <input
                            value={c.clientType}
                            onChange={e => {
                              const updated = settings.portfolio.clients.map((x, idx) => idx === i ? { ...x, clientType: e.target.value } : x)
                              updatePortfolio('clients', updated)
                            }}
                            className={cn(INPUT, 'py-2')}
                          />
                        </div>
                        <div className="w-20">
                          <label className={LABEL}>อักษรย่อ</label>
                          <input
                            value={c.abbr}
                            onChange={e => {
                              const updated = settings.portfolio.clients.map((x, idx) => idx === i ? { ...x, abbr: e.target.value } : x)
                              updatePortfolio('clients', updated)
                            }}
                            className={cn(INPUT, 'py-2 font-mono text-center uppercase')}
                            maxLength={4}
                            placeholder="เช่น TL"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updatePortfolio('clients', [...settings.portfolio.clients, { name: '', clientType: '', abbr: '' }])}
                className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/50"
              >
                <Plus className="w-4 h-4" />เพิ่มลูกค้ารายใหม่
              </button>
            </SectionCard>

            <SectionCard title="แกลเลอรี่รูปภาพ">
              <div className="space-y-4">
                {settings.portfolio.gallery.map((g, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 relative group flex flex-col md:flex-row gap-6 items-start">
                    <button
                      onClick={() => updatePortfolio('gallery', settings.portfolio.gallery.filter((_, idx) => idx !== i))}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-white text-slate-400 hover:text-red-500 shadow-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ImageField
                      label={`รูปที่ ${i + 1}`}
                      value={g.src}
                      onChange={url => {
                        const updated = settings.portfolio.gallery.map((x, idx) => idx === i ? { ...x, src: url } : x)
                        updatePortfolio('gallery', updated)
                      }}
                      className="w-full md:w-auto shrink-0"
                    />
                    <div className="flex-1 w-full pt-2">
                      <label className={LABEL}>คำบรรยายภาพ (Alt text)</label>
                      <input
                        value={g.alt}
                        onChange={e => {
                          const updated = settings.portfolio.gallery.map((x, idx) => idx === i ? { ...x, alt: e.target.value } : x)
                          updatePortfolio('gallery', updated)
                        }}
                        className={INPUT}
                        placeholder="อธิบายว่าภาพนี้คืออะไร..."
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updatePortfolio('gallery', [...settings.portfolio.gallery, { src: '', alt: '' }])}
                className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/50"
              >
                <Plus className="w-5 h-5" />เพิ่มรูปในแกลเลอรี่
              </button>
            </SectionCard>

            <SectionCard title="กรณีศึกษาเด่น (Featured Case Study)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ImageField
                  label="รูปภาพประกอบหลัก"
                  value={settings.portfolio.caseStudy.image}
                  onChange={url => updatePortfolio('caseStudy', { ...settings.portfolio.caseStudy, image: url })}
                />
                <div className="space-y-5">
                  <div>
                    <label className={LABEL}>หัวข้อ (ชื่อโปรเจกต์)</label>
                    <input
                      value={settings.portfolio.caseStudy.title}
                      onChange={e => updatePortfolio('caseStudy', { ...settings.portfolio.caseStudy, title: e.target.value })}
                      className={INPUT}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={LABEL}>ระยะเวลา</label>
                      <input
                        value={settings.portfolio.caseStudy.duration}
                        onChange={e => updatePortfolio('caseStudy', { ...settings.portfolio.caseStudy, duration: e.target.value })}
                        className={INPUT}
                        placeholder="เช่น 2 วัน"
                      />
                    </div>
                    <div>
                      <label className={LABEL}>ผลลัพธ์</label>
                      <input
                        value={settings.portfolio.caseStudy.result}
                        onChange={e => updatePortfolio('caseStudy', { ...settings.portfolio.caseStudy, result: e.target.value })}
                        className={INPUT}
                        placeholder="เช่น น้ำใส 100%"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={LABEL}>เรื่องราว / ปัญหาที่เจอ</label>
                    <textarea
                      rows={4}
                      value={settings.portfolio.caseStudy.description}
                      onChange={e => updatePortfolio('caseStudy', { ...settings.portfolio.caseStudy, description: e.target.value })}
                      className={cn(INPUT, 'resize-none')}
                    />
                  </div>
                </div>
              </div>
            </SectionCard>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.portfolio} saved={!!saved.portfolio} onClick={() => saveTab('portfolio')} />
            </div>
          </Tabs.Content>

          {/* ── Tab: FAQ ── */}
          <Tabs.Content value="faq" className="outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionCard title="คำถามที่พบบ่อย (FAQ)">
              <div className="space-y-4">
                {settings.faq.items.map((item, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex gap-4 group">
                    <div className="flex flex-col items-center justify-start gap-1 pt-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          if (i === 0) return
                          const updated = [...settings.faq.items]
                          ;[updated[i - 1], updated[i]] = [updated[i], updated[i - 1]]
                          updateFaq('items', updated)
                        }}
                        disabled={i === 0}
                        className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                      <button
                        onClick={() => {
                          if (i === settings.faq.items.length - 1) return
                          const updated = [...settings.faq.items]
                          ;[updated[i], updated[i + 1]] = [updated[i + 1], updated[i]]
                          updateFaq('items', updated)
                        }}
                        disabled={i === settings.faq.items.length - 1}
                        className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div>
                        <label className={LABEL}>คำถาม</label>
                        <input
                          value={item.question}
                          onChange={e => {
                            const updated = settings.faq.items.map((x, idx) => idx === i ? { ...x, question: e.target.value } : x)
                            updateFaq('items', updated)
                          }}
                          className={INPUT}
                          placeholder="พิมพ์คำถาม..."
                        />
                      </div>
                      <div>
                        <label className={LABEL}>คำตอบ</label>
                        <textarea
                          rows={3}
                          value={item.answer}
                          onChange={e => {
                            const updated = settings.faq.items.map((x, idx) => idx === i ? { ...x, answer: e.target.value } : x)
                            updateFaq('items', updated)
                          }}
                          className={cn(INPUT, 'resize-none')}
                          placeholder="พิมพ์คำตอบ..."
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => updateFaq('items', settings.faq.items.filter((_, idx) => idx !== i))}
                        className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 shadow-sm transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => updateFaq('items', [...settings.faq.items, { question: '', answer: '' }])}
                className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 font-semibold text-sm hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 bg-slate-50/50 hover:bg-blue-50/50"
              >
                <Plus className="w-5 h-5" />เพิ่ม Q&A
              </button>
            </SectionCard>

            <div className="sticky bottom-6 z-10 flex justify-end bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 mt-8">
              <SaveButton saving={!!saving.faq} saved={!!saved.faq} onClick={() => saveTab('faq')} />
            </div>
          </Tabs.Content>
          
        </div>
      </Tabs.Root>
    </div>
  )
}
