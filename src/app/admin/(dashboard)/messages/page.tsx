'use client'
import { useEffect, useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Select from '@radix-ui/react-select'
import { Search, MoreVertical, Eye, Trash2, ChevronDown, X, Phone, Mail, Calendar, Tag, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'new' | 'read' | 'contacted'

interface Message {
  _id: string
  name: string
  phone: string
  email: string
  service: string
  message: string
  status: Status
  createdAt: string
}

const STATUS_LABEL: Record<Status, string> = { new: 'ใหม่', read: 'อ่านแล้ว', contacted: 'ติดต่อแล้ว' }
const STATUS_CLS: Record<Status, string> = {
  new: 'bg-blue-50 text-blue-700',
  read: 'bg-gray-100 text-gray-600',
  contacted: 'bg-green-50 text-green-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | Status>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Message | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/messages')
    const data = await res.json()
    setMessages(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: Status) {
    setMessages(prev => prev.map(m => m._id === id ? { ...m, status } : m))
    await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  async function deleteMessage(id: string) {
    setMessages(prev => prev.filter(m => m._id !== id))
    setDeleteId(null)
    await fetch(`/api/messages/${id}`, { method: 'DELETE' })
  }

  const filtered = messages.filter(m => {
    const matchTab = tab === 'all' || m.status === tab
    const matchSearch = search === '' || m.name.includes(search) || m.phone.includes(search) || m.service.includes(search)
    return matchTab && matchSearch
  })

  const counts = {
    all: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    contacted: messages.filter(m => m.status === 'contacted').length,
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#0a1628]">ข้อความ / ติดต่อ</h1>
        <p className="text-gray-400 text-sm mt-1">ข้อความที่ส่งเข้ามาจากหน้าติดต่อเรา</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <Tabs.Root value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <Tabs.List className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {(['all', 'new', 'read', 'contacted'] as const).map((t) => (
                <Tabs.Trigger
                  key={t}
                  value={t}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-semibold transition-all',
                    'data-[state=active]:bg-white data-[state=active]:text-[#0a1628] data-[state=active]:shadow-sm',
                    'data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-gray-700'
                  )}
                >
                  {t === 'all' ? 'ทั้งหมด' : STATUS_LABEL[t]}
                  <span className="ml-1.5 text-[10px] bg-gray-200 px-1.5 py-0.5 rounded-full">{counts[t]}</span>
                </Tabs.Trigger>
              ))}
            </Tabs.List>
          </Tabs.Root>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหา..." className="w-full pl-8 pr-3 py-2 text-xs rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8]" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">กำลังโหลด...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">ชื่อ-นามสกุล</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">บริการที่สนใจ</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">วันที่</th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">สถานะ</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">ไม่พบข้อมูล</td></tr>
                ) : filtered.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#0a1628] text-xs font-bold shrink-0">{m.name[0]}</div>
                        <div>
                          <p className="text-sm font-semibold text-[#0a1628]">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell"><span className="text-sm text-gray-600">{m.service || '—'}</span></td>
                    <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-xs text-gray-400">{formatDate(m.createdAt)}</span></td>
                    <td className="px-5 py-3.5">
                      <Select.Root value={m.status} onValueChange={(v) => setStatus(m._id, v as Status)}>
                        <Select.Trigger className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer focus:outline-none', STATUS_CLS[m.status])}>
                          <Select.Value /><ChevronDown className="w-3 h-3 opacity-60" />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-[120px]">
                            <Select.Viewport>
                              {(Object.entries(STATUS_LABEL) as [Status, string][]).map(([val, label]) => (
                                <Select.Item key={val} value={val} className="flex items-center px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-[#0a1628]">
                                  <Select.ItemText>{label}</Select.ItemText>
                                </Select.Item>
                              ))}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </td>
                    <td className="px-5 py-3.5">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="bg-white border border-gray-200 rounded-xl shadow-xl p-1 z-50 min-w-[140px]" align="end">
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-[#0a1628]" onSelect={() => setSelected(m)}>
                              <Eye className="w-3.5 h-3.5 text-[#1d4ed8]" />ดูรายละเอียด
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-gray-100" />
                            <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:outline-none text-red-600" onSelect={() => setDeleteId(m._id)}>
                              <Trash2 className="w-3.5 h-3.5" />ลบ
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog.Root open={!!selected} onOpenChange={() => setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-lg z-50 p-6 focus:outline-none">
            <div className="flex items-center justify-between mb-5">
              <Dialog.Title className="text-lg font-extrabold text-[#0a1628]">��ายละเอียดข้อความ</Dialog.Title>
              <Dialog.Close className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></Dialog.Close>
            </div>
            {selected && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-[#0a1628] flex items-center justify-center text-white text-sm font-bold">{selected.name[0]}</div>
                  <div>
                    <p className="font-bold text-[#0a1628]">{selected.name}</p>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_CLS[selected.status])}>{STATUS_LABEL[selected.status]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" /><a href={`tel:${selected.phone.replace(/-/g,'')}`} className="hover:text-[#1d4ed8]">{selected.phone}</a></div>
                  {selected.email && <div className="flex items-center gap-2 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" /><span className="truncate">{selected.email}</span></div>}
                  {selected.service && <div className="flex items-center gap-2 text-gray-600"><Tag className="w-3.5 h-3.5 text-gray-400" /><span>{selected.service}</span></div>}
                  <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-3.5 h-3.5 text-gray-400" /><span>{formatDate(selected.createdAt)}</span></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ข้อความ</p>
                  <p className="text-sm text-[#0a1628] leading-relaxed bg-gray-50 p-3 rounded-xl">{selected.message}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <a href={`tel:${selected.phone.replace(/-/g,'')}`} className="flex-1 text-center bg-[#0a1628] hover:bg-[#1a2e4a] text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">โทรกลับ</a>
                  <button onClick={() => { setStatus(selected._id, 'contacted'); setSelected(null) }} className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">ทำเครื่องหมายติดต่อแล้ว</button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirm */}
      <Dialog.Root open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-sm z-50 p-6 focus:outline-none">
            <Dialog.Title className="text-base font-extrabold text-[#0a1628] mb-2">ยืนยันการลบ</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-5">ไม่สามารถกู้คืนได้หลังจากลบ</Dialog.Description>
            <div className="flex gap-2">
              <Dialog.Close className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm transition-colors">ยกเลิก</Dialog.Close>
              <button onClick={() => deleteId && deleteMessage(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors">ลบ</button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
