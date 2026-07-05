'use client'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Plus, MoreVertical, Pencil, Trash2, X, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Article {
  _id: string
  title: string
  category: string
  excerpt: string
  published: boolean
  createdAt: string
}

const CATEGORIES = ['ความรู้ทั่วไป', 'เคล็ดลับ', 'กฎหมาย & มาตรฐาน', 'เทคนิค', 'คู่มือผู้ใช้', 'ราคา & โปรโมชัน']

const CAT_COLORS: Record<string, string> = {
  'ความรู้ทั่วไป': 'bg-blue-50 text-blue-700',
  'เคล็ดลับ': 'bg-green-50 text-green-700',
  'กฎหมาย & มาตรฐาน': 'bg-red-50 text-red-700',
  'เทคนิค': 'bg-purple-50 text-purple-700',
  'คู่มือผู้ใช้': 'bg-orange-50 text-orange-700',
  'ราคา & โปรโมชัน': 'bg-yellow-50 text-yellow-700',
}

const EMPTY = { title: '', category: CATEGORIES[0], excerpt: '', published: false }

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Article | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState(EMPTY)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/articles')
    setArticles(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setDraft(EMPTY); setIsNew(true); setEditing(null) }
  function openEdit(a: Article) {
    setDraft({ title: a.title, category: a.category, excerpt: a.excerpt, published: a.published })
    setEditing(a); setIsNew(false)
  }

  async function saveArticle() {
    if (!draft.title.trim()) return
    if (isNew) {
      const res = await fetch('/api/articles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
      const created = await res.json()
      setArticles(prev => [created, ...prev])
    } else if (editing) {
      const res = await fetch(`/api/articles/${editing._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
      const updated = await res.json()
      setArticles(prev => prev.map(a => a._id === editing._id ? updated : a))
    }
    setEditing(null); setIsNew(false)
  }

  async function togglePublished(id: string, current: boolean) {
    setArticles(prev => prev.map(a => a._id === id ? { ...a, published: !current } : a))
    await fetch(`/api/articles/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ published: !current }) })
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a1628]">บทความ</h1>
          <p className="text-gray-400 text-sm mt-1">จัดการบทความและเนื้อหาบนเว็บไซต์</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#1a2e4a] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มบทความ
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">กำลังโหลด...</span>
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {articles.map((a) => (
          <div key={a._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Card top color band */}
            <div className="h-1.5 bg-gradient-to-r from-[#0a1628] to-[#1d4ed8]" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', CAT_COLORS[a.category] ?? 'bg-gray-100 text-gray-600')}>
                  {a.category}
                </span>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <button className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content className="bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-[130px]" align="end">
                      <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-[#0a1628]" onSelect={() => openEdit(a)}>
                        <Pencil className="w-3.5 h-3.5 text-[#1d4ed8]" />แก้ไข
                      </DropdownMenu.Item>
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
                <span className="text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog.Root open={isNew || !!editing} onOpenChange={() => { setIsNew(false); setEditing(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-lg z-50 p-6 focus:outline-none max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-extrabold text-[#0a1628]">
                {isNew ? 'เพิ่มบทความใหม่' : 'แก้ไขบทความ'}
              </Dialog.Title>
              <Dialog.Close className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></Dialog.Close>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0a1628] mb-1.5">หัวข้อบทความ *</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))}
                  placeholder="กรอกหัวข้อบทความ"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1628] mb-1.5">หมวดหมู่</label>
                <select
                  value={draft.category}
                  onChange={(e) => setDraft(d => ({ ...d, category: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1628] mb-1.5">บทสรุปย่อ</label>
                <textarea
                  rows={3}
                  value={draft.excerpt}
                  onChange={(e) => setDraft(d => ({ ...d, excerpt: e.target.value }))}
                  placeholder="สรุปเนื้อหาบทความสั้นๆ"
                  className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] resize-none"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#0a1628]">เผยแพร่บทความ</p>
                  <p className="text-xs text-gray-400">เปิดให้ผู้เยี่ยมชมเว็บไซต์เห็น</p>
                </div>
                <Switch.Root
                  checked={draft.published}
                  onCheckedChange={(v) => setDraft(d => ({ ...d, published: v }))}
                  className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none', draft.published ? 'bg-green-500' : 'bg-gray-300')}
                >
                  <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                </Switch.Root>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Dialog.Close className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">
                ยกเลิก
              </Dialog.Close>
              <button
                onClick={saveArticle}
                disabled={!draft.title.trim()}
                className="flex-1 bg-[#0a1628] hover:bg-[#1a2e4a] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                {isNew ? 'เพิ่มบทความ' : 'บันทึก'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirm */}
      <Dialog.Root open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-sm z-50 p-6 focus:outline-none">
            <Dialog.Title className="text-base font-extrabold text-[#0a1628] mb-2">ยืนยันการลบ</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-5">คุณต้องการลบบทความนี้ใช่ไหม?</Dialog.Description>
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
