'use client'
import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Switch from '@radix-ui/react-switch'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Plus, MoreVertical, Pencil, Trash2, X, ShieldCheck, ShieldAlert, Shield, User, Loader2, Eye, EyeOff, Users, Search, Filter } from 'lucide-react'
import { cn } from '@/lib/utils'

type Role = 'superadmin' | 'admin' | 'editor'

interface AdminUser {
  _id: string
  name: string
  email: string
  role: Role
  active: boolean
  createdAt: string
}

const ROLE_CONFIG: Record<Role, { label: string; cls: string; badge: string; icon: typeof ShieldCheck }> = {
  superadmin: {
    label: 'Super Admin',
    cls: 'bg-violet-50 text-violet-700 border-violet-200',
    badge: 'bg-violet-500',
    icon: ShieldAlert,
  },
  admin: {
    label: 'Admin',
    cls: 'bg-blue-50 text-blue-700 border-blue-200',
    badge: 'bg-blue-500',
    icon: ShieldCheck,
  },
  editor: {
    label: 'Editor',
    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'bg-emerald-500',
    icon: Shield,
  },
}

const AVATAR_COLORS = [
  'from-violet-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
]

const EMPTY = { name: '', email: '', password: '', role: 'admin' as Role, active: true }

const INPUT_CLS = 'w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all'

export default function AdminsPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [draft, setDraft] = useState(EMPTY)
  const [showPass, setShowPass] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admins')
    setAdmins(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setDraft(EMPTY); setIsNew(true); setEditing(null); setShowPass(false)
  }
  function openEdit(a: AdminUser) {
    setDraft({ name: a.name, email: a.email, password: '', role: a.role, active: a.active })
    setEditing(a); setIsNew(false); setShowPass(false)
  }

  async function saveAdmin() {
    if (!draft.name.trim() || !draft.email.trim()) return
    if (isNew && !draft.password.trim()) return
    setSaving(true)
    try {
      if (isNew) {
        const res = await fetch('/api/admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        })
        const created = await res.json()
        setAdmins(prev => [created, ...prev])
      } else if (editing) {
        const body: Record<string, unknown> = { name: draft.name, email: draft.email, role: draft.role, active: draft.active }
        if (draft.password.trim()) body.password = draft.password
        const res = await fetch(`/api/admins/${editing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const updated = await res.json()
        setAdmins(prev => prev.map(a => a._id === editing._id ? updated : a))
      }
    } finally {
      setSaving(false)
      setIsNew(false); setEditing(null)
    }
  }

  async function toggleActive(id: string, current: boolean) {
    setAdmins(prev => prev.map(a => a._id === id ? { ...a, active: !current } : a))
    await fetch(`/api/admins/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !current }),
    })
  }

  const filtered = admins.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalActive = admins.filter(a => a.active).length

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">จัดการ Admin</h1>
          </div>
          <p className="text-slate-400 text-sm font-medium">เพิ่ม แก้ไข และจัดการสิทธิ์ผู้ดูแลระบบ</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-md shadow-slate-900/10 hover:shadow-lg whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          เพิ่ม Admin ใหม่
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'ทั้งหมด', value: admins.length, color: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
          { label: 'ใช้งานอยู่', value: totalActive, color: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
          { label: 'ปิดใช้งาน', value: admins.length - totalActive, color: 'bg-red-50 text-red-600', dot: 'bg-red-400' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-100 shadow-sm p-5 flex items-center gap-3">
            <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', s.dot)} />
            <div>
              <p className="text-2xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหาชื่อหรืออีเมล..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-white border border-slate-200 px-3 py-2 rounded-lg transition-all">
            <Filter className="w-3.5 h-3.5" />
            กรอง
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            <span className="text-sm font-medium">กำลังโหลดข้อมูล...</span>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">ผู้ดูแลระบบ</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden md:table-cell">บทบาท</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden lg:table-cell">วันที่สร้าง</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">สถานะ</th>
                <th className="px-6 py-3.5 w-12" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
                      <Users className="w-10 h-10 text-slate-200" />
                      <p className="text-sm font-medium">
                        {search ? `ไม่พบผู้ใช้ที่ค้นหา "${search}"` : 'ยังไม่มีผู้ดูแลระบบ'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((a, i) => {
                const RoleIcon = ROLE_CONFIG[a.role].icon
                return (
                  <tr key={a._id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm ring-2 ring-white',
                          AVATAR_COLORS[i % AVATAR_COLORS.length]
                        )}>
                          {a.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{a.name}</p>
                          <p className="text-xs text-slate-400">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border',
                        ROLE_CONFIG[a.role].cls
                      )}>
                        <RoleIcon className="w-3 h-3" />
                        {ROLE_CONFIG[a.role].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(a.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Switch.Root
                          checked={a.active}
                          onCheckedChange={() => toggleActive(a._id, a.active)}
                          className={cn(
                            'relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none cursor-pointer',
                            a.active ? 'bg-emerald-500' : 'bg-slate-200'
                          )}
                        >
                          <Switch.Thumb className="block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[18px] data-[state=unchecked]:translate-x-[3px]" />
                        </Switch.Root>
                        <span className={cn('text-xs font-semibold', a.active ? 'text-emerald-600' : 'text-slate-400')}>
                          {a.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all opacity-0 group-hover:opacity-100">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            className="bg-white border border-slate-200 rounded-lg shadow-xl p-1.5 z-50 min-w-[160px] animate-in fade-in-0 zoom-in-95"
                            align="end"
                            sideOffset={4}
                          >
                            <DropdownMenu.Item
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-50 focus:bg-slate-50 focus:outline-none text-slate-700 transition-colors"
                              onSelect={() => openEdit(a)}
                            >
                              <div className="w-6 h-6 bg-blue-50 rounded-md flex items-center justify-center">
                                <Pencil className="w-3 h-3 text-blue-600" />
                              </div>
                              แก้ไขข้อมูล
                            </DropdownMenu.Item>
                            <DropdownMenu.Separator className="my-1 h-px bg-slate-100" />
                            <DropdownMenu.Item
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-red-50 focus:bg-red-50 focus:outline-none text-red-600 transition-colors"
                              onSelect={() => setDeleteId(a._id)}
                            >
                              <div className="w-6 h-6 bg-red-50 rounded-md flex items-center justify-center">
                                <Trash2 className="w-3 h-3 text-red-500" />
                              </div>
                              ลบออกจากระบบ
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
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog.Root open={isNew || !!editing} onOpenChange={() => { setIsNew(false); setEditing(null) }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-[90vw] max-w-md z-50 focus:outline-none overflow-hidden">
            {/* Dialog Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                  {isNew ? <Plus className="w-4 h-4 text-white" /> : <Pencil className="w-4 h-4 text-white" />}
                </div>
                <Dialog.Title className="text-base font-extrabold text-slate-900">
                  {isNew ? 'เพิ่ม Admin ใหม่' : 'แก้ไขข้อมูล Admin'}
                </Dialog.Title>
              </div>
              <Dialog.Close className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </Dialog.Close>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ชื่อ – นามสกุล <span className="text-red-500">*</span></label>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft(d => ({ ...d, name: e.target.value }))}
                  placeholder="เช่น สมชาย ใจดี"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">อีเมล <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft(d => ({ ...d, email: e.target.value }))}
                  placeholder="admin@probax.co.th"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  รหัสผ่าน
                  {isNew ? <span className="text-red-500"> *</span> : <span className="text-slate-400 font-normal ml-1">(เว้นว่างถ้าไม่ต้องการเปลี่ยน)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={draft.password}
                    onChange={(e) => setDraft(d => ({ ...d, password: e.target.value }))}
                    placeholder={isNew ? 'กรอกรหัสผ่าน' : '••••••••'}
                    className={cn(INPUT_CLS, 'pr-10')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">บทบาท</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['superadmin', 'admin', 'editor'] as Role[]).map((role) => {
                    const cfg = ROLE_CONFIG[role]
                    const RoleIcon = cfg.icon
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setDraft(d => ({ ...d, role }))}
                        className={cn(
                          'flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs font-bold transition-all',
                          draft.role === role
                            ? cn(cfg.cls, 'border-current shadow-sm')
                            : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                        )}
                      >
                        <RoleIcon className="w-4 h-4" />
                        {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={cn('w-2 h-2 rounded-full', draft.active ? 'bg-emerald-500' : 'bg-slate-300')} />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">สถานะบัญชี</p>
                    <p className="text-xs text-slate-400">{draft.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</p>
                  </div>
                </div>
                <Switch.Root
                  checked={draft.active}
                  onCheckedChange={(v) => setDraft(d => ({ ...d, active: v }))}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer',
                    draft.active ? 'bg-emerald-500' : 'bg-slate-200'
                  )}
                >
                  <Switch.Thumb className="block h-4 w-4 rounded-full bg-white shadow transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
                </Switch.Root>
              </div>
            </div>

            <div className="px-6 pb-5 flex gap-2.5">
              <Dialog.Close className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors">
                ยกเลิก
              </Dialog.Close>
              <button
                onClick={saveAdmin}
                disabled={saving || !draft.name.trim() || !draft.email.trim() || (isNew && !draft.password.trim())}
                className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-md shadow-slate-900/10"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {isNew ? 'เพิ่ม Admin' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Delete Confirm */}
      <Dialog.Root open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-2xl w-[90vw] max-w-sm z-50 p-6 focus:outline-none">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 bg-red-50 rounded-lg flex items-center justify-center mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <Dialog.Title className="text-base font-extrabold text-slate-900 mb-1.5">ยืนยันการลบ</Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500 leading-relaxed">
                คุณต้องการลบ Admin นี้ออกจากระบบใช่ไหม?<br />
                <span className="font-semibold text-red-500">การดำเนินการนี้ไม่สามารถย้อนกลับได้</span>
              </Dialog.Description>
            </div>
            <div className="flex gap-2.5">
              <Dialog.Close className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-lg text-sm transition-colors">
                ยกเลิก
              </Dialog.Close>
              <button
                onClick={async () => {
                  if (!deleteId) return
                  setAdmins(prev => prev.filter(a => a._id !== deleteId))
                  setDeleteId(null)
                  await fetch(`/api/admins/${deleteId}`, { method: 'DELETE' })
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-md shadow-red-500/20"
              >
                ลบออกจากระบบ
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
