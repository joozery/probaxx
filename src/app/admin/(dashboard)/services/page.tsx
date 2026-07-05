'use client'
import { useEffect, useState } from 'react'
import * as Switch from '@radix-ui/react-switch'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Plus, MoreVertical, Pencil, Trash2, X, GripVertical, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Service {
  _id: string
  title: string
  description: string
  icon: string
  active: boolean
  order: number
}

const EMPTY = { title: '', description: '', icon: '💧', active: true }

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Service | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState(EMPTY)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/services')
    setServices(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() { setDraft(EMPTY); setIsNew(true); setEditing(null) }
  function openEdit(s: Service) {
    setDraft({ title: s.title, description: s.description, icon: s.icon, active: s.active })
    setEditing(s); setIsNew(false)
  }

  async function save() {
    if (!draft.title.trim()) return
    if (isNew) {
      const nextOrder = Math.max(0, ...services.map(s => s.order)) + 1
      const res = await fetch('/api/services', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...draft, order: nextOrder }) })
      const created = await res.json()
      setServices(prev => [...prev, created])
    } else if (editing) {
      const res = await fetch(`/api/services/${editing._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) })
      const updated = await res.json()
      setServices(prev => prev.map(s => s._id === editing._id ? updated : s))
    }
    setIsNew(false); setEditing(null)
  }

  async function toggleActive(id: string, current: boolean) {
    setServices(prev => prev.map(s => s._id === id ? { ...s, active: !current } : s))
    await fetch(`/api/services/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ active: !current }) })
  }

  const sorted = [...services].sort((a, b) => a.order - b.order)
  const activeCount = services.filter(s => s.active).length

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0a1628]">บริการ</h1>
          <p className="text-gray-400 text-sm mt-1">
            จัดการรายการบริการบนเว็บไซต์ · {loading ? '...' : `เปิดใช้งาน ${activeCount}/${services.length} รายการ`}
          </p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-[#0a1628] hover:bg-[#1a2e4a] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มบริการ
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-xs text-gray-400">บริการที่เปิดใช้งานจะแสดงบนเว็บไซต์สาธารณะ</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" /><span className="text-sm">กำลังโหลด...</span>
          </div>
        ) : (
        <div className="divide-y divide-gray-100">
          {sorted.map((s) => (
            <div key={s._id} className={cn('flex items-center gap-4 px-5 py-4 transition-colors', !s.active && 'opacity-50')}>
              {/* Drag handle (visual only) */}
              <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#f1f5f9] flex items-center justify-center text-xl shrink-0">
                {s.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#0a1628] truncate">{s.title}</p>
                <p className="text-xs text-gray-400 truncate mt-0.5">{s.description}</p>
              </div>

              {/* Order badge */}
              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full hidden sm:inline">
                ลำดับ {s.order}
              </span>

              {/* Toggle */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-gray-500 font-medium hidden sm:inline">
                  {s.active ? 'เปิด' : 'ปิด'}
                </span>
                <Switch.Root
                  checked={s.active}
                  onCheckedChange={() => toggleActive(s._id, s.active)}
                  className={cn('relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none', s.active ? 'bg-green-500' : 'bg-gray-300')}
                >
                  <Switch.Thumb className="block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5" />
                </Switch.Root>
              </div>

              {/* Actions */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content className="bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-[130px]" align="end">
                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-[#0a1628]" onSelect={() => openEdit(s)}>

                      <Pencil className="w-3.5 h-3.5 text-[#1d4ed8]" />แก้ไข
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:outline-none text-red-600" onSelect={() => setDeleteId(s._id)}>
                      <Trash2 className="w-3.5 h-3.5" />ลบ
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog.Root open={isNew || !!editing} onOpenChange={() => { setIsNew(false); setEditing(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-lg z-50 p-6 focus:outline-none">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-extrabold text-[#0a1628]">
                {isNew ? 'เพิ่มบริการใหม่' : 'แก้ไขบริการ'}
              </Dialog.Title>
              <Dialog.Close className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></Dialog.Close>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-20">
                  <label className="block text-xs font-bold text-[#0a1628] mb-1.5">ไอคอน</label>
                  <input value={draft.icon} onChange={(e) => setDraft(d => ({ ...d, icon: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center text-xl focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-[#0a1628] mb-1.5">ชื่อบริการ *</label>
                  <input value={draft.title} onChange={(e) => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="กรอกชื่อบริการ" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0a1628] mb-1.5">คำอธิบายสั้น</label>
                <textarea rows={3} value={draft.description} onChange={(e) => setDraft(d => ({ ...d, description: e.target.value }))} placeholder="อธิบายรายละเอียดบริการ" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] resize-none" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-[#0a1628]">แสดงบนเว็บไซต์</p>
                  <p className="text-xs text-gray-400">ผู้เยี่ยมชมจะเห็นบริการนี้</p>
                </div>
                <Switch.Root checked={draft.active} onCheckedChange={(v) => setDraft(d => ({ ...d, active: v }))} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none', draft.active ? 'bg-green-500' : 'bg-gray-300')}>
                  <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                </Switch.Root>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Dialog.Close className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">ยกเลิก</Dialog.Close>
              <button onClick={save} disabled={!draft.title.trim()} className="flex-1 bg-[#0a1628] hover:bg-[#1a2e4a] disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">
                {isNew ? 'เพิ่มบริการ' : 'บันทึก'}
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
            <Dialog.Description className="text-sm text-gray-500 mb-5">คุณต้องการลบบริการนี้ออกจากเว็บไซต์?</Dialog.Description>
            <div className="flex gap-2">
              <Dialog.Close className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">ยกเลิก</Dialog.Close>
              <button onClick={async () => {
                if (!deleteId) return
                setServices(prev => prev.filter(s => s._id !== deleteId))
                setDeleteId(null)
                await fetch(`/api/services/${deleteId}`, { method: 'DELETE' })
              }} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">ลบ</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
