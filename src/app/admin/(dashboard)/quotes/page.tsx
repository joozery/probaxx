'use client'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Select from '@radix-ui/react-select'
import {
  Search, MoreVertical, Eye, Trash2, ChevronDown, X,
  Phone, Calendar, Tag, Loader2, ClipboardList,
  Clock, CheckCircle2, CircleDot, XCircle, MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Status = 'pending' | 'inprogress' | 'done' | 'cancelled'

interface Quote {
  _id: string
  name: string
  phone: string
  email?: string
  service?: string
  message?: string
  status: Status
  createdAt: string
}

const STATUS: Record<Status, { label: string; dot: string; badge: string; icon: React.ElementType }> = {
  pending:    { label: 'รอดำเนินการ',     dot: 'bg-amber-400',  badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',   icon: Clock },
  inprogress: { label: 'กำลังดำเนินการ',  dot: 'bg-blue-500',   badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',     icon: CircleDot },
  done:       { label: 'เสร็จสิ้น',       dot: 'bg-emerald-500',badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: CheckCircle2 },
  cancelled:  { label: 'ยกเลิก',          dot: 'bg-slate-400',  badge: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',  icon: XCircle },
}

const TABS: { value: 'all' | Status; label: string }[] = [
  { value: 'all',        label: 'ทั้งหมด' },
  { value: 'pending',    label: 'รอดำเนินการ' },
  { value: 'inprogress', label: 'กำลังดำเนินการ' },
  { value: 'done',       label: 'เสร็จสิ้น' },
  { value: 'cancelled',  label: 'ยกเลิก' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
]
function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | Status>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Quote | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/quotes')
    setQuotes(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: Status) {
    setQuotes(prev => prev.map(q => q._id === id ? { ...q, status } : q))
    if (selected?._id === id) setSelected(prev => prev ? { ...prev, status } : null)
    await fetch(`/api/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
  }

  const filtered = quotes.filter(q => {
    const matchTab = tab === 'all' || q.status === tab
    const q2 = search.toLowerCase()
    const matchSearch = !q2 || q.name.toLowerCase().includes(q2) || q.phone.includes(q2) || (q.service ?? '').toLowerCase().includes(q2)
    return matchTab && matchSearch
  })

  const counts = {
    all: quotes.length,
    pending: quotes.filter(q => q.status === 'pending').length,
    inprogress: quotes.filter(q => q.status === 'inprogress').length,
    done: quotes.filter(q => q.status === 'done').length,
    cancelled: quotes.filter(q => q.status === 'cancelled').length,
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
              <ClipboardList className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">ใบเสนอราคา</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium ml-0.5">คำขอใบเสนอราคาจากลูกค้าทั้งหมด</p>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-300 bg-white px-4 py-2 rounded-lg transition-all shadow-sm"
        >
          รีเฟรช
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {([
          { status: 'pending',    count: counts.pending },
          { status: 'inprogress', count: counts.inprogress },
          { status: 'done',       count: counts.done },
          { status: 'cancelled',  count: counts.cancelled },
        ] as { status: Status; count: number }[]).map(({ status, count }) => {
          const s = STATUS[status]
          const Icon = s.icon
          return (
            <button
              key={status}
              onClick={() => setTab(prev => prev === status ? 'all' : status)}
              className={cn(
                'bg-white rounded-xl border shadow-sm p-5 text-left transition-all hover:shadow-md',
                tab === status ? 'border-slate-300 ring-2 ring-slate-200' : 'border-slate-100'
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full', s.badge)}>
                  <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
                  {s.label}
                </span>
                <Icon className="w-4 h-4 text-slate-300" />
              </div>
              <p className="text-3xl font-black text-slate-900">{count}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">รายการ</p>
            </button>
          )
        })}
      </div>

      {/* ── Table Card ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50/50">
          <div className="flex gap-1 flex-wrap">
            {TABS.map(t => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  tab === t.value
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                )}
              >
                {t.label}
                <span className={cn(
                  'ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold',
                  tab === t.value ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                )}>
                  {counts[t.value]}
                </span>
              </button>
            ))}
          </div>
          <div className="relative sm:ml-auto w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ, เบอร์, บริการ..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-white border border-slate-200 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ลูกค้า</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">บริการ</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">วันที่ขอ</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3.5 w-12" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-slate-300 mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ClipboardList className="w-8 h-8 text-slate-200" />
                      <p className="text-sm font-medium">ไม่พบรายการ</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((q) => {
                const s = STATUS[q.status]
                const Icon = s.icon
                return (
                  <tr
                    key={q._id}
                    className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => setSelected(q)}
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-black shrink-0', avatarColor(q.name))}>
                          {q.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{q.name}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />{q.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      {q.service ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                          <Tag className="w-3 h-3 text-slate-400" />
                          {q.service}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div>
                        <p className="text-xs font-medium text-slate-600">{formatDate(q.createdAt)}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{formatTime(q.createdAt)}</p>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <Select.Root value={q.status} onValueChange={v => setStatus(q._id, v as Status)}>
                        <Select.Trigger
                          className={cn(
                            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer focus:outline-none transition-all hover:opacity-80',
                            s.badge
                          )}
                        >
                          <Icon className="w-3 h-3" />
                          <Select.Value />
                          <ChevronDown className="w-3 h-3 opacity-50 ml-0.5" />
                        </Select.Trigger>
                        <Select.Portal>
                          <Select.Content className="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-slate-200/60 p-1.5 z-50 min-w-[160px]" position="popper" sideOffset={4}>
                            <Select.Viewport>
                              {(Object.entries(STATUS) as [Status, typeof STATUS[Status]][]).map(([val, cfg]) => {
                                const ItemIcon = cfg.icon
                                return (
                                  <Select.Item
                                    key={val}
                                    value={val}
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:outline-none text-slate-700"
                                  >
                                    <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot)} />
                                    <Select.ItemText>{cfg.label}</Select.ItemText>
                                  </Select.Item>
                                )
                              })}
                            </Select.Viewport>
                          </Select.Content>
                        </Select.Portal>
                      </Select.Root>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content className="bg-white border border-slate-200 rounded-xl shadow-2xl shadow-slate-200/60 p-1.5 z-50 min-w-[150px]" align="end" sideOffset={4}>
                            <DropdownMenu.Item
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:outline-none text-slate-700"
                              onSelect={() => setSelected(q)}
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-500" />ดูรายละเอียด
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                            <DropdownMenu.Item
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:outline-none text-red-600"
                              onSelect={() => setDeleteId(q._id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />ลบรายการ
                            </DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-400 font-medium">แสดง {filtered.length} จาก {quotes.length} รายการ</p>
          </div>
        )}
      </div>

      {/* ── Detail Dialog ── */}
      <Dialog.Root open={!!selected} onOpenChange={() => setSelected(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-lg z-50 focus:outline-none overflow-hidden">
            {selected && (() => {
              const s = STATUS[selected.status]
              const Icon = s.icon
              return (
                <>
                  {/* Modal Header */}
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <Dialog.Title className="text-base font-extrabold text-slate-900">รายละเอียดใบเสนอราคา</Dialog.Title>
                      <p className="text-xs text-slate-400 mt-0.5">{formatDate(selected.createdAt)} · {formatTime(selected.createdAt)}</p>
                    </div>
                    <Dialog.Close className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
                      <X className="w-4 h-4" />
                    </Dialog.Close>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 space-y-5">
                    {/* Customer card */}
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className={cn('w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-lg font-black shrink-0', avatarColor(selected.name))}>
                        {selected.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-base">{selected.name}</p>
                        <a href={`tel:${selected.phone.replace(/-/g, '')}`} className="text-sm text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5" />{selected.phone}
                        </a>
                      </div>
                      <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full', s.badge)}>
                        <Icon className="w-3.5 h-3.5" />
                        {s.label}
                      </span>
                    </div>

                    {/* Info grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {selected.service && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">บริการ</p>
                          <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-slate-400" />{selected.service}
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">วันที่</p>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />{formatDate(selected.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Message */}
                    {selected.message && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <MessageSquare className="w-3 h-3" />รายละเอียด
                        </p>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selected.message}</p>
                        </div>
                      </div>
                    )}

                    {/* Status change */}
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">เปลี่ยนสถานะ</p>
                      <div className="flex gap-2 flex-wrap">
                        {(Object.entries(STATUS) as [Status, typeof STATUS[Status]][]).map(([val, cfg]) => {
                          const BtnIcon = cfg.icon
                          return (
                            <button
                              key={val}
                              onClick={() => setStatus(selected._id, val)}
                              className={cn(
                                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all',
                                selected.status === val
                                  ? cn(cfg.badge, 'shadow-sm')
                                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                              )}
                            >
                              <BtnIcon className="w-3.5 h-3.5" />
                              {cfg.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-2">
                    <a
                      href={`tel:${selected.phone.replace(/-/g, '')}`}
                      className="flex-1 text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Phone className="w-4 h-4" />โทรหาลูกค้า
                    </a>
                    <button
                      onClick={() => { setStatus(selected._id, 'inprogress'); setSelected(null) }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <CircleDot className="w-4 h-4" />เริ่มดำเนินการ
                    </button>
                  </div>
                </>
              )
            })()}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Delete Dialog ── */}
      <Dialog.Root open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[90vw] max-w-sm z-50 p-6 focus:outline-none">
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <Dialog.Title className="text-base font-extrabold text-slate-900">ลบรายการนี้?</Dialog.Title>
                <Dialog.Description className="text-sm text-slate-500 mt-1">การดำเนินการนี้ไม่สามารถย้อนกลับได้</Dialog.Description>
              </div>
            </div>
            <div className="flex gap-2">
              <Dialog.Close className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-sm transition-all">
                ยกเลิก
              </Dialog.Close>
              <button
                onClick={async () => {
                  if (!deleteId) return
                  setQuotes(prev => prev.filter(q => q._id !== deleteId))
                  setDeleteId(null)
                  await fetch(`/api/quotes/${deleteId}`, { method: 'DELETE' })
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-sm"
              >
                ลบ
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
