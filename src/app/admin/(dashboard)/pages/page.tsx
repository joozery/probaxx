'use client'
import { useEffect, useState, useRef } from 'react'
import {
  Loader2, Save, CheckCircle2, Image as ImageIcon,
  Type, AlignLeft, Eye, Upload, X, Sliders,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroSettings {
  heroTitle: string
  heroDescription: string
  heroImage: string
  heroOverlay: number
}

const DEFAULTS: HeroSettings = {
  heroTitle: 'บทความ & ข่าวสาร',
  heroDescription: 'รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้',
  heroImage: '/cover/heroarticle.png',
  heroOverlay: 40,
}

const INPUT = 'w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]'
const LABEL = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5'

function Card({ children, accent = '#3b82f6', icon: Icon, title, subtitle }: {
  children: React.ReactNode
  accent?: string
  icon: React.ElementType
  title: string
  subtitle?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.06)] overflow-hidden">
      <div className="h-0.5 w-full" style={{ background: accent }} />
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}18` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
        <div>
          <h2 className="font-bold text-slate-800 text-sm leading-none">{title}</h2>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function PagesSettingsPage() {
  const [data, setData] = useState<HeroSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/page-settings/articles')
      .then(r => r.json())
      .then(d => { setData({ heroTitle: d.heroTitle, heroDescription: d.heroDescription, heroImage: d.heroImage, heroOverlay: d.heroOverlay }); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function set<K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) {
    setData(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  async function save() {
    setSaving(true)
    await fetch('/api/page-settings/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function uploadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) set('heroImage', url)
    } catch { alert('อัปโหลดไม่สำเร็จ') }
    setUploading(false)
    e.target.value = ''
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
    </div>
  )

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0a1628] flex items-center justify-center shadow-lg shrink-0">
            <Sliders className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">ตั้งค่าหน้าบทความ</h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5">แก้ไข Hero Section ของหน้า /articles</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/articles"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1d4ed8] border border-slate-200 hover:border-[#1d4ed8] px-4 py-2.5 rounded-xl transition-all"
          >
            <Eye className="w-3.5 h-3.5" />ดูหน้าจริง
          </a>
          <button
            onClick={save}
            disabled={saving}
            className={cn(
              'inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md whitespace-nowrap',
              saved
                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                : 'bg-[#0a1628] hover:bg-[#1a2e4a] text-white shadow-slate-900/20 disabled:opacity-60'
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'บันทึกแล้ว!' : saving ? 'กำลังบันทึก...' : 'บันทึก'}
          </button>
        </div>
      </div>

      <div className="space-y-4">

        {/* Live Preview */}
        <div className="relative rounded-2xl overflow-hidden h-44 bg-[#0a1628] shadow-lg">
          {data.heroImage && (
            <img
              src={data.heroImage}
              alt="preview"
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div
            className="absolute inset-0"
            style={{ background: `rgba(10,22,40,${data.heroOverlay / 100})` }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-3 font-semibold">Preview</p>
            <h2 className="text-white font-extrabold text-xl md:text-2xl drop-shadow-md leading-tight mb-2">
              {data.heroTitle || 'ชื่อหัวข้อ...'}
            </h2>
            <p className="text-white/70 text-xs leading-relaxed max-w-lg line-clamp-2">
              {data.heroDescription || 'คำอธิบายหน้า...'}
            </p>
          </div>
        </div>

        {/* Text */}
        <Card icon={Type} title="ข้อความ" subtitle="หัวข้อและคำอธิบายใน Hero Section" accent="#3b82f6">
          <div className="space-y-4">
            <div>
              <label className={LABEL}>หัวข้อ (Title)</label>
              <input
                value={data.heroTitle}
                onChange={e => set('heroTitle', e.target.value)}
                placeholder="เช่น บทความ & ข่าวสาร"
                className={INPUT}
              />
            </div>
            <div>
              <label className={LABEL}>
                คำอธิบาย (Description)
                <span className={cn('ml-2 normal-case font-normal', data.heroDescription.length > 120 ? 'text-red-400' : 'text-slate-400')}>
                  {data.heroDescription.length}/120
                </span>
              </label>
              <textarea
                rows={2}
                value={data.heroDescription}
                onChange={e => set('heroDescription', e.target.value)}
                placeholder="คำอธิบายสั้นๆ ที่แสดงใต้หัวข้อ"
                className={cn(INPUT, 'resize-none')}
              />
            </div>
          </div>
        </Card>

        {/* Background Image */}
        <Card icon={ImageIcon} title="รูปพื้นหลัง" subtitle="Background image ของ Hero Section" accent="#f97316">
          <div className="space-y-3">
            {/* Current image */}
            {data.heroImage ? (
              <div className="relative rounded-xl overflow-hidden h-28 bg-slate-100 group">
                <img src={data.heroImage} alt="bg" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <label className="cursor-pointer bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />เปลี่ยนรูป
                    <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
                  </label>
                  <button
                    onClick={() => set('heroImage', '')}
                    className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />ลบ
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#f97316] hover:bg-orange-50/30 transition-all group">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-slate-300 group-hover:text-[#f97316] transition-colors mb-1.5" />
                    <span className="text-xs text-slate-400 group-hover:text-[#f97316] font-medium">คลิกเพื่ออัปโหลด</span>
                    <span className="text-[10px] text-slate-300 mt-0.5">PNG, JPG, WebP · แนะนำ 1920×600</span>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadImage} />
              </label>
            )}

            {/* URL input */}
            <div>
              <label className={LABEL}>หรือใส่ URL รูปภาพ</label>
              <input
                value={data.heroImage}
                onChange={e => set('heroImage', e.target.value)}
                placeholder="https://... หรือ /cover/heroarticle.png"
                className={INPUT}
              />
            </div>
          </div>
        </Card>

        {/* Overlay */}
        <Card icon={AlignLeft} title="ความเข้มของ Overlay" subtitle="ปรับความมืดทับรูปพื้นหลัง" accent="#8b5cf6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">ใส (밝게)</span>
              <span className="text-sm font-bold text-slate-800 tabular-nums">{data.heroOverlay}%</span>
              <span className="text-sm text-slate-500">เข้ม (어둡게)</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={data.heroOverlay}
              onChange={e => set('heroOverlay', Number(e.target.value))}
              className="w-full accent-[#8b5cf6] h-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-300 font-mono">
              {[0, 20, 40, 60, 80, 90].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('heroOverlay', v)}
                  className={cn('hover:text-violet-500 transition-colors', data.heroOverlay === v && 'text-violet-600 font-bold')}
                >
                  {v}%
                </button>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
}
