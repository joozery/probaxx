'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Plus, MoreVertical, Pencil, Trash2, X, FileText,
  Loader2, ExternalLink, PenLine, Image as ImageIcon,
  Save, CheckCircle2, Upload, Type, AlignLeft, Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* ─── Types ─── */
interface Article {
  _id: string; title: string; slug: string; category: string
  excerpt: string; published: boolean; coverImage: string
  views: number; readTime: number; createdAt: string
}
interface Category { _id: string; name: string; color: string }
interface HeroSettings {
  heroTitle: string; heroDescription: string
  heroImage: string; heroOverlay: number
}

const HERO_DEFAULT: HeroSettings = {
  heroTitle: 'บทความ & ข่าวสาร',
  heroDescription: 'รวบรวมสาระความรู้เกี่ยวกับการดูแลรักษาระบบน้ำ ถังเก็บน้ำ และสุขภาพที่คุณควรรู้',
  heroImage: '/cover/heroarticle.png',
  heroOverlay: 40,
}

const INPUT = 'w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all'

/* ─── Main ─── */
export default function ArticlesPage() {
  /* articles */
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  /* hero settings */
  const [hero, setHero] = useState<HeroSettings>(HERO_DEFAULT)
  const [heroSaving, setHeroSaving] = useState(false)
  const [heroSaved, setHeroSaved] = useState(false)
  const [heroUploading, setHeroUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function getCatColor(name: string) {
    return categories.find(c => c.name === name)?.color ?? 'bg-gray-100 text-gray-600'
  }

  /* load everything once */
  useEffect(() => {
    Promise.all([
      fetch('/api/articles').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/page-settings/articles').then(r => r.json()),
    ]).then(([artData, catData, heroData]) => {
      setArticles(artData.articles ?? artData)
      setCategories(catData)
      setHero({
        heroTitle: heroData.heroTitle ?? HERO_DEFAULT.heroTitle,
        heroDescription: heroData.heroDescription ?? HERO_DEFAULT.heroDescription,
        heroImage: heroData.heroImage ?? HERO_DEFAULT.heroImage,
        heroOverlay: heroData.heroOverlay ?? HERO_DEFAULT.heroOverlay,
      })
      setLoading(false)
    })
  }, [])

  async function togglePublished(id: string, current: boolean) {
    setArticles(prev => prev.map(a => a._id === id ? { ...a, published: !current } : a))
    await fetch(`/api/articles/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !current }) })
  }

  /* hero handlers */
  function setH<K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) {
    setHero(prev => ({ ...prev, [key]: value }))
    setHeroSaved(false)
  }

  async function saveHero() {
    setHeroSaving(true)
    await fetch('/api/page-settings/articles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero),
    })
    setHeroSaving(false); setHeroSaved(true)
    setTimeout(() => setHeroSaved(false), 2500)
  }

  async function uploadHeroImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setHeroUploading(true)
    const fd = new FormData(); fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) setH('heroImage', url)
    } catch { alert('อัปโหลดไม่สำเร็จ') }
    setHeroUploading(false); e.target.value = ''
  }

  return (
    <div className="p-6 md:p-8">

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a1628]">บทความ</h1>
          <p className="text-gray-400 text-sm mt-1">จัดการบทความและเนื้อหาบนเว็บไซต์</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#1a2e4a] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />เพิ่มบทความ
        </Link>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="articles">
        <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
          {[
            { value: 'articles', label: 'บทความทั้งหมด', icon: FileText },
            { value: 'hero', label: 'Hero Section', icon: ImageIcon },
          ].map(({ value, label, icon: Icon }) => (
            <Tabs.Trigger
              key={value}
              value={value}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 transition-all data-[state=active]:bg-white data-[state=active]:text-[#0a1628] data-[state=active]:shadow-sm"
            >
              <Icon className="w-4 h-4" />{label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* ── Tab: Articles ── */}
        <Tabs.Content value="articles">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">กำลังโหลด...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {articles.map((a) => (
                <div key={a._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-1.5 bg-gradient-to-r from-[#0a1628] to-[#1d4ed8]" />
                  {a.coverImage && (
                    <div className="h-32 overflow-hidden bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.coverImage} alt={a.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', getCatColor(a.category))}>
                        {a.category}
                      </span>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-[150px]" align="end">
                            <DropdownMenu.Item asChild>
                              <Link href={`/admin/articles/${a._id}`} className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-[#0a1628]">
                                <PenLine className="w-3.5 h-3.5 text-[#1d4ed8]" />แก้ไขเนื้อหา
                              </Link>
                            </DropdownMenu.Item>
                            {a.slug && (
                              <DropdownMenu.Item asChild>
                                <a href={`/articles/${a.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-[#0a1628]">
                                  <ExternalLink className="w-3.5 h-3.5 text-gray-400" />ดูหน้าจริง
                                </a>
                              </DropdownMenu.Item>
                            )}
                            <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:outline-none text-red-600" onSelect={() => setDeleteId(a._id)}>
                              <Trash2 className="w-3.5 h-3.5" />ลบ
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </div>

                    <div className="flex items-start gap-2 mb-2">
                      <FileText className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
                      <h3 className="text-sm font-bold text-[#0a1628] leading-snug line-clamp-2">{a.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">{a.excerpt}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-3 text-[10px] text-gray-400">
                        <span>{new Date(a.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {a.views > 0 && <span>· {a.views} ครั้ง</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 font-medium">{a.published ? 'เผยแพร่' : 'แบบร่าง'}</span>
                        <Switch.Root
                          checked={a.published}
                          onCheckedChange={() => togglePublished(a._id, a.published)}
                          className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none', a.published ? 'bg-green-500' : 'bg-gray-300')}
                        >
                          <Switch.Thumb className="block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5" />
                        </Switch.Root>
                      </div>
                    </div>

                    <Link
                      href={`/admin/articles/${a._id}`}
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-all"
                    >
                      <Pencil className="w-3 h-3" />แก้ไขเนื้อหาบทความ
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Tabs.Content>

        {/* ── Tab: Hero Section ── */}
        <Tabs.Content value="hero">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

            {/* ── Left: controls ── */}
            <div className="space-y-4">

              {/* Text */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-0.5 bg-[#3b82f6]" />
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Type className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0a1628] leading-none">ข้อความ</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">หัวข้อและคำอธิบายบน Hero</p>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">หัวข้อ (Title)</label>
                    <input
                      value={hero.heroTitle}
                      onChange={e => setH('heroTitle', e.target.value)}
                      placeholder="เช่น บทความ & ข่าวสาร"
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">คำอธิบาย (Description)</label>
                      <span className={cn('text-[10px] font-semibold tabular-nums', hero.heroDescription.length > 120 ? 'text-red-400' : 'text-gray-300')}>
                        {hero.heroDescription.length} / 120
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={hero.heroDescription}
                      onChange={e => setH('heroDescription', e.target.value)}
                      placeholder="คำอธิบายสั้นๆ ที่แสดงใต้หัวข้อ"
                      className={cn(INPUT, 'resize-none')}
                    />
                  </div>
                </div>
              </div>

              {/* Background image */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-0.5 bg-[#f97316]" />
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0a1628] leading-none">รูปพื้นหลัง</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">แนะนำ 1920×600 px · PNG, JPG, WebP</p>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  {hero.heroImage ? (
                    <div className="relative rounded-xl overflow-hidden aspect-[16/5] group bg-gray-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={hero.heroImage} alt="bg" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <label className="cursor-pointer bg-white text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-gray-100 transition-colors shadow-sm">
                          <Upload className="w-3.5 h-3.5" />เปลี่ยนรูป
                          <input type="file" accept="image/*" className="hidden" onChange={uploadHeroImage} />
                        </label>
                        <button onClick={() => setH('heroImage', '')} className="bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-red-600 transition-colors shadow-sm">
                          <X className="w-3.5 h-3.5" />ลบ
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center aspect-[16/5] border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#f97316] hover:bg-orange-50/30 transition-all group">
                      {heroUploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-300" /> : (
                        <>
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center mb-2 transition-colors">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-[#f97316] transition-colors" />
                          </div>
                          <span className="text-sm font-semibold text-gray-500 group-hover:text-[#f97316] transition-colors">คลิกเพื่ออัปโหลดรูป</span>
                          <span className="text-[11px] text-gray-400 mt-1">PNG, JPG, WebP · แนะนำ 1920×600 px</span>
                        </>
                      )}
                      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={uploadHeroImage} />
                    </label>
                  )}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">หรือใส่ URL รูปภาพ</label>
                    <input
                      value={hero.heroImage}
                      onChange={e => setH('heroImage', e.target.value)}
                      placeholder="/cover/heroarticle.png  หรือ  https://..."
                      className={INPUT}
                    />
                  </div>
                </div>
              </div>

              {/* Overlay */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-0.5 bg-[#8b5cf6]" />
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <AlignLeft className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0a1628] leading-none">Overlay</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">ความเข้มของชั้นสีทับรูปพื้นหลัง</p>
                  </div>
                  <span className="ml-auto text-lg font-extrabold text-[#0a1628] tabular-nums">{hero.heroOverlay}%</span>
                </div>
                <div className="p-5 space-y-3">
                  <div className="relative">
                    <div className="h-3 rounded-full overflow-hidden" style={{
                      background: 'linear-gradient(to right, rgba(10,22,40,0), rgba(10,22,40,0.9))'
                    }} />
                    <input
                      type="range" min={0} max={90} step={5}
                      value={hero.heroOverlay}
                      onChange={e => setH('heroOverlay', Number(e.target.value))}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
                    />
                    <div className="absolute top-0 h-3 flex items-center pointer-events-none"
                      style={{ left: `calc(${(hero.heroOverlay / 90) * 100}% - 8px)` }}>
                      <div className="w-5 h-5 rounded-full bg-white border-2 border-violet-500 shadow-md -mt-1" />
                    </div>
                  </div>
                  <div className="flex justify-between gap-1">
                    {[0, 20, 40, 60, 80, 90].map(v => (
                      <button key={v} type="button" onClick={() => setH('heroOverlay', v)}
                        className={cn(
                          'flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all',
                          hero.heroOverlay === v
                            ? 'bg-violet-100 text-violet-700 ring-1 ring-violet-300'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                        )}>
                        {v}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: sticky preview + save ── */}
            <div className="xl:sticky xl:top-6 space-y-3">

              {/* Browser chrome mockup */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-[#0a1628] to-[#1d4ed8]" />
                {/* Mock browser bar */}
                <div className="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2 bg-gray-50">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 bg-white border border-gray-200 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-300" />
                    <span className="text-[10px] text-gray-400 font-mono truncate">probax.com/articles</span>
                  </div>
                </div>
                {/* Preview area */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/7' }}>
                  <div className="absolute inset-0 bg-[#0a1628]">
                    {hero.heroImage && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={hero.heroImage} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0" style={{ background: `rgba(10,22,40,${hero.heroOverlay / 100})` }} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                    <p className="text-[8px] text-white/30 uppercase tracking-[0.2em] font-bold mb-1.5">Hero Section</p>
                    <h2 className="text-white font-extrabold text-sm leading-tight mb-1.5 drop-shadow">
                      {hero.heroTitle || 'ชื่อหัวข้อ...'}
                    </h2>
                    <p className="text-white/60 text-[9px] leading-relaxed max-w-[200px] line-clamp-2">
                      {hero.heroDescription || 'คำอธิบายหน้า...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={saveHero}
                disabled={heroSaving}
                className={cn(
                  'w-full inline-flex items-center justify-center gap-2 text-sm font-bold py-3 rounded-2xl transition-all shadow-sm',
                  heroSaved
                    ? 'bg-emerald-500 text-white shadow-emerald-200'
                    : 'bg-[#0a1628] hover:bg-[#1a2e4a] text-white disabled:opacity-50'
                )}
              >
                {heroSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : heroSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {heroSaved ? 'บันทึกแล้ว!' : heroSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
              </button>

              <a
                href="/articles"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-2xl border border-gray-200 text-gray-500 hover:border-[#1d4ed8] hover:text-[#1d4ed8] transition-all"
              >
                <Eye className="w-3.5 h-3.5" />เปิดดูหน้าจริง
              </a>

              <p className="text-center text-[10px] text-gray-300">การเปลี่ยนแปลงจะมีผลหลังกด &ldquo;บันทึก&rdquo;</p>
            </div>

          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* Delete Confirm */}
      <Dialog.Root open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-sm z-50 p-6 focus:outline-none">
            <Dialog.Title className="text-base font-extrabold text-[#0a1628] mb-2">ยืนยันการลบ</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-5">คุณต้องการลบบทความนี้ใช่ไหม? การกระทำนี้ไม่สามารถย้อนกลับได้</Dialog.Description>
            <div className="flex gap-2">
              <Dialog.Close className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">ยกเลิก</Dialog.Close>
              <button onClick={async () => {
                if (!deleteId) return
                setArticles(prev => prev.filter(a => a._id !== deleteId))
                setDeleteId(null)
                await fetch(`/api/articles/${deleteId}`, { method: 'DELETE' })
              }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">ลบ</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
