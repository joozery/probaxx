'use client'
import { useEffect, useState } from 'react'
import { Plus, Trash2, Loader2, Save, GripVertical, LayoutTemplate, Phone, Link2, FileText, Award, Globe, CheckCircle2, MapPin, Mail, Smartphone, Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SocialLink { label: string; url: string }
interface NavLink { label: string; href: string }
interface Contact { address: string; phone: string; companyName: string; lineId: string; email: string }

interface FooterData {
  logo: string
  description: string
  certifications: string[]
  socialLinks: SocialLink[]
  serviceLinks: NavLink[]
  companyLinks: NavLink[]
  contact: Contact
  copyright: string
}

const EMPTY_FOOTER: FooterData = {
  logo: '',
  description: '',
  certifications: [],
  socialLinks: [],
  serviceLinks: [],
  companyLinks: [],
  contact: { address: '', phone: '', companyName: '', lineId: '', email: '' },
  copyright: '',
}

const INPUT = 'w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.04)]'

const LABEL = 'block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5'

function SectionCard({ icon: Icon, title, subtitle, children, accent = '#3b82f6', iconBg = 'bg-blue-50', iconColor = 'text-blue-600' }: {
  icon: React.ElementType
  title: string
  subtitle?: string
  children: React.ReactNode
  accent?: string
  iconBg?: string
  iconColor?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_1px_8px_-2px_rgba(0,0,0,0.05)] overflow-hidden">
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ background: accent }} />
      <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-4 h-4', iconColor)} />
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

function LinkRow({ labelVal, hrefVal, onLabelChange, onHrefChange, onRemove, labelPlaceholder = 'ชื่อ', hrefPlaceholder = 'URL' }: {
  labelVal: string; hrefVal: string
  onLabelChange: (v: string) => void; onHrefChange: (v: string) => void; onRemove: () => void
  labelPlaceholder?: string; hrefPlaceholder?: string
}) {
  return (
    <div className="flex items-center gap-2 group">
      <GripVertical className="w-4 h-4 text-slate-300 shrink-0 cursor-grab" />
      <input value={labelVal} onChange={e => onLabelChange(e.target.value)} placeholder={labelPlaceholder} className={cn(INPUT, 'flex-1')} />
      <input value={hrefVal} onChange={e => onHrefChange(e.target.value)} placeholder={hrefPlaceholder} className={cn(INPUT, 'flex-[2]')} />
      <button
        onClick={onRemove}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all border border-dashed border-blue-200 hover:border-blue-400"
    >
      <Plus className="w-3.5 h-3.5" />{label}
    </button>
  )
}

function LogoUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) onChange(url)
      else alert('อัปโหลดไม่สำเร็จ')
    } catch { alert('อัปโหลดไม่สำเร็จ') }
    setUploading(false); e.target.value = ''
  }

  return (
    <div className="flex flex-col sm:flex-row items-start gap-4">
      {/* Preview on dark background — matches how the logo appears in the real Footer */}
      <div className="relative w-48 h-24 rounded-xl overflow-hidden bg-[#071020] border border-slate-200 flex items-center justify-center shrink-0">
        {uploading && (
          <div className="absolute inset-0 z-10 bg-black/50 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
          </div>
        )}
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="logo preview" className="max-w-full max-h-full object-contain mix-blend-screen brightness-110" />
        ) : (
          <span className="text-xs text-white/40">ยังไม่มีโลโก้</span>
        )}
      </div>

      <div className="flex-1 w-full space-y-2">
        <div className="flex gap-2">
          <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-2 rounded-lg transition-colors">
            <Upload className="w-3.5 h-3.5" />อัปโหลดโลโก้
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          {value && (
            <button
              onClick={() => onChange('')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors border border-red-100"
            >
              <X className="w-3.5 h-3.5" />ลบ
            </button>
          )}
        </div>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder="หรือวาง URL รูปโลโก้" className={cn(INPUT, 'text-xs')} />
        <p className="text-[11px] text-slate-400">แนะนำไฟล์ PNG พื้นหลังโปร่งใส เพื่อให้แสดงบนพื้นหลังสีเข้มได้ดี</p>
      </div>
    </div>
  )
}

export default function FooterSettingsPage() {
  const [data, setData] = useState<FooterData>(EMPTY_FOOTER)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/footer').then(r => r.json()).then(d => {
      setData(d); setLoading(false)
    })
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/footer', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function set<K extends keyof FooterData>(key: K, value: FooterData[K]) {
    setData(prev => ({ ...prev, [key]: value }))
  }
  function setContact(key: keyof Contact, value: string) {
    setData(prev => ({ ...prev, contact: { ...prev.contact, [key]: value } }))
  }

  function addLink(key: 'serviceLinks' | 'companyLinks') {
    setData(prev => ({ ...prev, [key]: [...prev[key], { label: '', href: '' }] }))
  }
  function updateLink(key: 'serviceLinks' | 'companyLinks', i: number, field: 'label' | 'href', val: string) {
    setData(prev => { const arr = [...prev[key]]; arr[i] = { ...arr[i], [field]: val }; return { ...prev, [key]: arr } })
  }
  function removeLink(key: 'serviceLinks' | 'companyLinks', i: number) {
    setData(prev => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) }))
  }

  function addSocial() {
    setData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { label: '', url: '' }] }))
  }
  function updateSocial(i: number, field: 'label' | 'url', val: string) {
    setData(prev => { const arr = [...prev.socialLinks]; arr[i] = { ...arr[i], [field]: val }; return { ...prev, socialLinks: arr } })
  }
  function removeSocial(i: number) {
    setData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, idx) => idx !== i) }))
  }

  function addCert() { set('certifications', [...data.certifications, '']) }
  function updateCert(i: number, val: string) {
    const arr = [...data.certifications]; arr[i] = val; set('certifications', arr)
  }
  function removeCert(i: number) { set('certifications', data.certifications.filter((_, idx) => idx !== i)) }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
        <span className="text-sm font-medium">กำลังโหลดข้อมูล...</span>
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 shrink-0">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">จัดการ Footer</h1>
            <p className="text-slate-400 text-xs font-medium mt-0.5">แก้ไขข้อมูลที่แสดงในส่วนท้ายของเว็บไซต์</p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={cn(
            'inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md whitespace-nowrap',
            saved
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 disabled:opacity-60'
          )}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'บันทึกแล้ว!' : saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
        </button>
      </div>

      <div className="space-y-4">

        {/* Logo */}
        <SectionCard
          icon={ImageIcon} title="โลโก้"
          subtitle="โลโก้ที่แสดงในส่วน Footer ของเว็บไซต์"
          accent="#06b6d4" iconBg="bg-cyan-50" iconColor="text-cyan-600"
        >
          <LogoUpload value={data.logo} onChange={v => set('logo', v)} />
        </SectionCard>

        {/* Brand Description */}
        <SectionCard
          icon={FileText} title="คำอธิบายแบรนด์"
          subtitle="ข้อความแนะนำบริษัทที่แสดงใน Footer"
          accent="#3b82f6" iconBg="bg-blue-50" iconColor="text-blue-600"
        >
          <textarea
            rows={3}
            value={data.description}
            onChange={e => set('description', e.target.value)}
            placeholder="คำอธิบายสั้นๆ เกี่ยวกับบริษัทและบริการของเรา..."
            className={cn(INPUT, 'resize-none')}
          />
        </SectionCard>

        {/* Contact */}
        <SectionCard
          icon={Phone} title="ข้อมูลติดต่อ"
          subtitle="ที่อยู่ เบอร์โทร และช่องทางการติดต่อ"
          accent="#f97316" iconBg="bg-orange-50" iconColor="text-orange-500"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>ชื่อบริษัท</label>
              <div className="relative">
                <input value={data.contact.companyName} onChange={e => setContact('companyName', e.target.value)} placeholder="บริษัท..." className={INPUT} />
              </div>
            </div>
            <div>
              <label className={LABEL}>เบอร์โทรศัพท์</label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input value={data.contact.phone} onChange={e => setContact('phone', e.target.value)} placeholder="08x-xxx-xxxx" className={cn(INPUT, 'pl-9')} />
              </div>
            </div>
            <div>
              <label className={LABEL}>Line ID</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input value={data.contact.lineId} onChange={e => setContact('lineId', e.target.value)} placeholder="@probax" className={cn(INPUT, 'pl-9')} />
              </div>
            </div>
            <div>
              <label className={LABEL}>อีเมล</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <input value={data.contact.email} onChange={e => setContact('email', e.target.value)} placeholder="info@probax.co.th" className={cn(INPUT, 'pl-9')} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>ที่อยู่</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                <textarea rows={2} value={data.contact.address} onChange={e => setContact('address', e.target.value)} placeholder="ที่อยู่บริษัท" className={cn(INPUT, 'resize-none pl-9')} />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Links — 2 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard
            icon={Link2} title="ลิงก์บริการ"
            subtitle="เมนูหมวดบริการใน Footer"
            accent="#8b5cf6" iconBg="bg-violet-50" iconColor="text-violet-600"
          >
            <div className="space-y-2">
              {data.serviceLinks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">ยังไม่มีลิงก์ คลิกเพิ่มด้านล่าง</p>
              )}
              {data.serviceLinks.map((link, i) => (
                <LinkRow
                  key={i}
                  labelVal={link.label} hrefVal={link.href}
                  onLabelChange={v => updateLink('serviceLinks', i, 'label', v)}
                  onHrefChange={v => updateLink('serviceLinks', i, 'href', v)}
                  onRemove={() => removeLink('serviceLinks', i)}
                />
              ))}
            </div>
            <AddButton onClick={() => addLink('serviceLinks')} label="เพิ่มลิงก์บริการ" />
          </SectionCard>

          <SectionCard
            icon={Link2} title="ลิงก์บริษัท"
            subtitle="เมนูหมวดบริษัทใน Footer"
            accent="#10b981" iconBg="bg-emerald-50" iconColor="text-emerald-600"
          >
            <div className="space-y-2">
              {data.companyLinks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">ยังไม่มีลิงก์ คลิกเพิ่มด้านล่าง</p>
              )}
              {data.companyLinks.map((link, i) => (
                <LinkRow
                  key={i}
                  labelVal={link.label} hrefVal={link.href}
                  onLabelChange={v => updateLink('companyLinks', i, 'label', v)}
                  onHrefChange={v => updateLink('companyLinks', i, 'href', v)}
                  onRemove={() => removeLink('companyLinks', i)}
                />
              ))}
            </div>
            <AddButton onClick={() => addLink('companyLinks')} label="เพิ่มลิงก์บริษัท" />
          </SectionCard>
        </div>

        {/* Certifications & Social — 2 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SectionCard
            icon={Award} title="ใบรับรอง / มาตรฐาน"
            subtitle="มาตรฐานและการรับรองของบริษัท"
            accent="#f59e0b" iconBg="bg-amber-50" iconColor="text-amber-600"
          >
            <div className="space-y-2">
              {data.certifications.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">ยังไม่มีใบรับรอง</p>
              )}
              {data.certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  <input value={cert} onChange={e => updateCert(i, e.target.value)} placeholder="เช่น ISO 9001, มอก.xxx" className={cn(INPUT, 'flex-1')} />
                  <button onClick={() => removeCert(i)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <AddButton onClick={addCert} label="เพิ่มใบรับรอง" />
          </SectionCard>

          <SectionCard
            icon={Globe} title="โซเชียลมีเดีย"
            subtitle="ช่องทางโซเชียลของบริษัท"
            accent="#ec4899" iconBg="bg-pink-50" iconColor="text-pink-600"
          >
            <div className="space-y-2">
              {data.socialLinks.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-4 border-2 border-dashed border-slate-100 rounded-xl">ยังไม่มีโซเชียล</p>
              )}
              {data.socialLinks.map((s, i) => (
                <LinkRow
                  key={i}
                  labelVal={s.label} hrefVal={s.url}
                  onLabelChange={v => updateSocial(i, 'label', v)}
                  onHrefChange={v => updateSocial(i, 'url', v)}
                  onRemove={() => removeSocial(i)}
                  labelPlaceholder="Facebook, LINE..."
                  hrefPlaceholder="https://..."
                />
              ))}
            </div>
            <AddButton onClick={addSocial} label="เพิ่มโซเชียล" />
          </SectionCard>
        </div>

        {/* Copyright */}
        <SectionCard
          icon={FileText} title="Copyright"
          subtitle="ข้อความลิขสิทธิ์ที่แสดงด้านล่างสุด"
          accent="#64748b" iconBg="bg-slate-100" iconColor="text-slate-500"
        >
          <input
            value={data.copyright}
            onChange={e => set('copyright', e.target.value)}
            placeholder="© 2025 PROBAX Co., Ltd. All Rights Reserved."
            className={INPUT}
          />
        </SectionCard>

      </div>

    </div>
  )
}
