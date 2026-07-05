'use client'
import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import * as Switch from '@radix-ui/react-switch'
import * as Tabs from '@radix-ui/react-tabs'
import {
  ArrowLeft, Save, Eye, Loader2, AlertCircle,
  Globe, Tag, Image as ImageIcon, Search, CheckCircle2,
  Plus, X, Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-200 rounded-xl h-[500px] flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin text-gray-300" />
    </div>
  ),
})

interface Category {
  _id: string
  name: string
  color: string
}

interface Draft {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  coverImage: string
  tags: string[]
  author: string
  published: boolean
  metaTitle: string
  metaDescription: string
}

const EMPTY: Draft = {
  title: '', slug: '', category: '', excerpt: '', content: '',
  coverImage: '', tags: [], author: 'ทีม PROBAX', published: false,
  metaTitle: '', metaDescription: '',
}

const COLOR_OPTIONS = [
  { label: 'น้ำเงิน', value: 'bg-blue-50 text-blue-700' },
  { label: 'เขียว', value: 'bg-green-50 text-green-700' },
  { label: 'แดง', value: 'bg-red-50 text-red-700' },
  { label: 'ม่วง', value: 'bg-purple-50 text-purple-700' },
  { label: 'ส้ม', value: 'bg-orange-50 text-orange-700' },
  { label: 'เหลือง', value: 'bg-yellow-50 text-yellow-700' },
  { label: 'ชมพู', value: 'bg-pink-50 text-pink-700' },
  { label: 'เทา', value: 'bg-gray-100 text-gray-600' },
]

function slugify(text: string) {
  const latin = text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
  return latin.length >= 3 ? latin.slice(0, 80) : `article-${Date.now()}`
}

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  // Categories state
  const [categories, setCategories] = useState<Category[]>([])
  const [catLoading, setCatLoading] = useState(true)
  const [showAddCat, setShowAddCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatColor, setNewCatColor] = useState(COLOR_OPTIONS[0].value)
  const [addingCat, setAddingCat] = useState(false)
  const [catError, setCatError] = useState('')

  const set = useCallback(<K extends keyof Draft>(key: K, value: Draft[K]) => {
    setDraft(prev => ({ ...prev, [key]: value }))
    setSaved(false)
  }, [])

  // Load categories
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then((data: Category[]) => {
        setCategories(data)
        // Set default category for new article
        if (isNew && data.length > 0) {
          setDraft(prev => ({ ...prev, category: prev.category || data[0].name }))
        }
        setCatLoading(false)
      })
      .catch(() => setCatLoading(false))
  }, [isNew])

  // Load article for edit
  useEffect(() => {
    if (isNew) return
    fetch(`/api/articles/${id}`)
      .then(r => r.json())
      .then(data => {
        setDraft({
          title: data.title ?? '',
          slug: data.slug ?? '',
          category: data.category ?? '',
          excerpt: data.excerpt ?? '',
          content: data.content ?? '',
          coverImage: data.coverImage ?? '',
          tags: data.tags ?? [],
          author: data.author ?? 'ทีม PROBAX',
          published: data.published ?? false,
          metaTitle: data.metaTitle ?? '',
          metaDescription: data.metaDescription ?? '',
        })
        setSlugManual(true)
        setLoading(false)
      })
      .catch(() => { setError('โหลดข้อมูลไม่สำเร็จ'); setLoading(false) })
  }, [id, isNew])

  useEffect(() => {
    if (!slugManual && draft.title) set('slug', slugify(draft.title))
  }, [draft.title, slugManual, set])

  useEffect(() => {
    if (!draft.metaTitle && draft.title) set('metaTitle', draft.title)
  }, [draft.title]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!draft.metaDescription && draft.excerpt) set('metaDescription', draft.excerpt)
  }, [draft.excerpt]) // eslint-disable-line react-hooks/exhaustive-deps

  async function save(publish?: boolean) {
    if (!draft.title.trim()) { setError('กรุณากรอกหัวข้อบทความ'); return }
    setSaving(true); setError('')
    const body = { ...draft, ...(publish !== undefined ? { published: publish } : {}) }
    try {
      const res = isNew
        ? await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch(`/api/articles/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Save failed')
      const data = await res.json()
      setSaved(true)
      if (isNew) router.replace(`/admin/articles/${data._id}`)
    } catch {
      setError('บันทึกไม่สำเร็จ กรุณาลองใหม่')
    } finally {
      setSaving(false)
    }
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) set('coverImage', url)
    } catch { alert('อัปโหลดรูปปกไม่สำเร็จ') }
    setUploadingCover(false)
    e.target.value = ''
  }

  function addTag() {
    const tag = tagInput.trim()
    if (!tag || draft.tags.includes(tag)) { setTagInput(''); return }
    set('tags', [...draft.tags, tag])
    setTagInput('')
  }

  async function addCategory() {
    const name = newCatName.trim()
    if (!name) return
    setAddingCat(true); setCatError('')
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, color: newCatColor }),
      })
      const data = await res.json()
      if (!res.ok) { setCatError(data.error ?? 'เกิดข้อผิดพลาด'); return }
      setCategories(prev => [...prev, data])
      set('category', data.name)
      setNewCatName('')
      setNewCatColor(COLOR_OPTIONS[0].value)
      setShowAddCat(false)
    } catch {
      setCatError('เกิดข้อผิดพลาด')
    } finally {
      setAddingCat(false)
    }
  }

  async function deleteCategory(cat: Category) {
    if (!confirm(`ลบหมวดหมู่ "${cat.name}" ใช่ไหม?`)) return
    await fetch(`/api/categories/${cat._id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c._id !== cat._id))
    if (draft.category === cat.name && categories.length > 1) {
      const next = categories.find(c => c._id !== cat._id)
      if (next) set('category', next.name)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
    </div>
  )

  const metaTitleLen = draft.metaTitle.length
  const metaDescLen = draft.metaDescription.length
  const currentCat = categories.find(c => c.name === draft.category)

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/admin/articles" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="min-w-0">
            <p className="text-xs text-gray-400">{isNew ? 'บทความใหม่' : 'แก้ไขบทความ'}</p>
            <h1 className="text-sm font-bold text-[#0a1628] truncate max-w-xs md:max-w-md">
              {draft.title || 'ยังไม่มีชื่อ'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {saved && (
            <span className="hidden md:flex items-center gap-1 text-xs text-green-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />บันทึกแล้ว
            </span>
          )}
          {error && (
            <span className="hidden md:flex items-center gap-1 text-xs text-red-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />{error}
            </span>
          )}
          {draft.slug && !isNew && (
            <a
              href={`/articles/${draft.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />ดูตัวอย่าง
            </a>
          )}
          <button
            onClick={() => save()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            บันทึกแบบร่าง
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a1628] hover:bg-[#1a2e4a] text-white text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            {draft.published ? 'อัปเดต' : 'เผยแพร่'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        {/* Left */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <input
              value={draft.title}
              onChange={e => set('title', e.target.value)}
              placeholder="หัวข้อบทความ..."
              className="w-full text-2xl font-extrabold text-[#0a1628] placeholder:text-gray-300 focus:outline-none"
            />
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-400 shrink-0">Slug:</span>
              <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5">
                <span className="text-xs text-gray-400 shrink-0">/articles/</span>
                <input
                  value={draft.slug}
                  onChange={e => { setSlugManual(true); set('slug', e.target.value.toLowerCase().replace(/\s/g, '-')) }}
                  className="flex-1 text-xs text-gray-700 bg-transparent focus:outline-none font-mono"
                  placeholder="slug-ของบทความ"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-[#0a1628] mb-2">บทสรุปย่อ (Excerpt)</label>
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={e => set('excerpt', e.target.value)}
              placeholder="สรุปเนื้อหาบทความสั้นๆ (แสดงในหน้ารายการและ meta description)"
              className="w-full text-sm text-gray-700 placeholder:text-gray-300 focus:outline-none resize-none leading-relaxed"
            />
            <p className="text-[11px] text-gray-400 mt-1">{draft.excerpt.length} / 160 ตัวอักษร</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 pt-4 pb-2 border-b border-gray-100">
              <span className="text-xs font-bold text-[#0a1628]">เนื้อหา</span>
            </div>
            <div className="p-3">
              <RichEditor value={draft.content} onChange={v => set('content', v)} />
            </div>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="space-y-4">
          <Tabs.Root defaultValue="general">
            <Tabs.List className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm mb-4">
              {[
                { value: 'general', label: 'ทั่วไป', icon: Tag },
                { value: 'seo', label: 'SEO', icon: Search },
                { value: 'media', label: 'สื่อ', icon: ImageIcon },
              ].map(({ value, label, icon: Icon }) => (
                <Tabs.Trigger
                  key={value}
                  value={value}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-gray-500 transition-all data-[state=active]:bg-[#0a1628] data-[state=active]:text-white"
                >
                  <Icon className="w-3.5 h-3.5" />{label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* General Tab */}
            <Tabs.Content value="general" className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">

                {/* Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#0a1628]">สถานะ</p>
                    <p className="text-xs text-gray-400">{draft.published ? 'เผยแพร่แล้ว' : 'แบบร่าง'}</p>
                  </div>
                  <Switch.Root
                    checked={draft.published}
                    onCheckedChange={v => set('published', v)}
                    className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none', draft.published ? 'bg-green-500' : 'bg-gray-300')}
                  >
                    <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                  </Switch.Root>
                </div>

                {/* Category */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#0a1628]">หมวดหมู่</label>
                    <button
                      type="button"
                      onClick={() => { setShowAddCat(v => !v); setCatError('') }}
                      className="flex items-center gap-1 text-[10px] font-semibold text-[#1d4ed8] hover:text-[#0a1628] transition-colors"
                    >
                      <Plus className="w-3 h-3" />เพิ่มหมวดหมู่
                    </button>
                  </div>

                  {/* Selected badge + dropdown */}
                  <div className="space-y-2">
                    {catLoading ? (
                      <div className="flex items-center gap-2 py-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-300" />
                        <span className="text-xs text-gray-400">กำลังโหลด...</span>
                      </div>
                    ) : (
                      <select
                        value={draft.category}
                        onChange={e => set('category', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                      >
                        {categories.map(c => (
                          <option key={c._id} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    )}

                    {/* Color badge preview */}
                    {currentCat && (
                      <span className={cn('inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full', currentCat.color)}>
                        {currentCat.name}
                      </span>
                    )}
                  </div>

                  {/* Inline add category form */}
                  {showAddCat && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2.5">
                      <p className="text-[11px] font-bold text-[#0a1628]">หมวดหมู่ใหม่</p>
                      <input
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                        placeholder="ชื่อหมวดหมู่"
                        autoFocus
                        className="w-full px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                      />
                      {/* Color picker */}
                      <div>
                        <p className="text-[10px] text-gray-400 mb-1.5">สีป้าย</p>
                        <div className="flex flex-wrap gap-1.5">
                          {COLOR_OPTIONS.map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setNewCatColor(opt.value)}
                              className={cn(
                                'text-[10px] font-bold px-2 py-0.5 rounded-full border-2 transition-all',
                                opt.value,
                                newCatColor === opt.value ? 'border-[#0a1628] scale-105' : 'border-transparent'
                              )}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      {catError && <p className="text-[11px] text-red-500">{catError}</p>}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => { setShowAddCat(false); setNewCatName(''); setCatError('') }}
                          className="flex-1 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="button"
                          onClick={addCategory}
                          disabled={addingCat || !newCatName.trim()}
                          className="flex-1 py-1.5 rounded-lg bg-[#0a1628] text-white text-xs font-semibold disabled:opacity-50 hover:bg-[#1a2e4a] transition-colors flex items-center justify-center gap-1"
                        >
                          {addingCat ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                          เพิ่ม
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Category list with delete */}
                  {!showAddCat && categories.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {categories.map(cat => (
                        <div key={cat._id} className="flex items-center justify-between group">
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', cat.color)}>
                            {cat.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => deleteCategory(cat)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-300 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Author */}
                <div>
                  <label className="block text-xs font-bold text-[#0a1628] mb-1.5">ผู้เขียน</label>
                  <input
                    value={draft.author}
                    onChange={e => set('author', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-[#0a1628] mb-1.5">แท็ก</label>
                  <div className="flex gap-2">
                    <input
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                      placeholder="พิมพ์แท็กแล้วกด Enter"
                      className="flex-1 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                    />
                    <button onClick={addTag} type="button" className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors">
                      เพิ่ม
                    </button>
                  </div>
                  {draft.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {draft.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                          #{tag}
                          <button
                            type="button"
                            onClick={() => set('tags', draft.tags.filter(t => t !== tag))}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Tabs.Content>

            {/* SEO Tab */}
            <Tabs.Content value="seo" className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#0a1628]">SEO Title</label>
                    <span className={cn('text-[10px] font-medium', metaTitleLen > 60 ? 'text-red-500' : metaTitleLen > 50 ? 'text-yellow-500' : 'text-green-600')}>
                      {metaTitleLen}/60
                    </span>
                  </div>
                  <input
                    value={draft.metaTitle}
                    onChange={e => set('metaTitle', e.target.value)}
                    placeholder="ชื่อสำหรับ Search Engine"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#0a1628]">Meta Description</label>
                    <span className={cn('text-[10px] font-medium', metaDescLen > 160 ? 'text-red-500' : metaDescLen > 140 ? 'text-yellow-500' : 'text-green-600')}>
                      {metaDescLen}/160
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={draft.metaDescription}
                    onChange={e => set('metaDescription', e.target.value)}
                    placeholder="คำอธิบายสำหรับ Search Engine"
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] resize-none"
                  />
                </div>

                {/* SERP Preview */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-2">ตัวอย่าง Google</p>
                  <p className="text-sm font-medium text-blue-700 leading-tight truncate">
                    {draft.metaTitle || draft.title || 'ชื่อบทความ'} | PROBAX
                  </p>
                  <p className="text-[11px] text-green-700 truncate">probax.co.th › articles › {draft.slug || 'slug'}</p>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mt-0.5">
                    {draft.metaDescription || draft.excerpt || 'คำอธิบายบทความ...'}
                  </p>
                </div>
              </div>
            </Tabs.Content>

            {/* Media Tab */}
            <Tabs.Content value="media" className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0a1628] mb-2">รูปปก (Cover Image)</label>
                  {draft.coverImage ? (
                    <div className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={draft.coverImage} alt="cover" className="w-full h-40 object-cover rounded-xl" />
                      <button
                        type="button"
                        onClick={() => set('coverImage', '')}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-[#1d4ed8] hover:bg-blue-50/50 transition-all group">
                      {uploadingCover ? (
                        <Loader2 className="w-6 h-6 animate-spin text-gray-300" />
                      ) : (
                        <>
                          <ImageIcon className="w-8 h-8 text-gray-300 group-hover:text-[#1d4ed8] transition-colors mb-2" />
                          <span className="text-xs text-gray-400 group-hover:text-[#1d4ed8]">คลิกเพื่ออัปโหลดรูปปก</span>
                          <span className="text-[10px] text-gray-300 mt-0.5">PNG, JPG, WebP (แนะนำ 1200×630)</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" onChange={uploadCover} />
                    </label>
                  )}
                  <input
                    value={draft.coverImage}
                    onChange={e => set('coverImage', e.target.value)}
                    placeholder="หรือวาง URL รูปภาพ"
                    className="w-full mt-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                  />
                </div>
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  )
}
