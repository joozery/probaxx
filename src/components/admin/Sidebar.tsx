'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  FileText,
  Wrench,
  LogOut,
  Users,
  Search,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  LayoutTemplate,
  Info,
  Trophy,
  Phone,
  Home,
  MessageCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'ภาพรวม', href: '/admin', icon: LayoutDashboard },
  { label: 'ข้อความ', href: '/admin/messages', icon: MessageSquare, badge: 3 },
  { label: 'ใบเสนอราคา', href: '/admin/quotes', icon: ClipboardList, badge: 2 },
  { label: 'หน้าแรก', href: '/admin/home', icon: Home },
  { label: 'บทความ', href: '/admin/articles', icon: FileText },
  { label: 'บริการ', href: '/admin/services', icon: Wrench },
  { label: 'เกี่ยวกับเรา', href: '/admin/about', icon: Info },
  { label: 'ผลงาน', href: '/admin/portfolio', icon: Trophy },
  { label: 'ติดต่อเรา', href: '/admin/contact', icon: Phone },
  { label: 'ปุ่มติดต่อลอย', href: '/admin/contact-widget', icon: MessageCircle },
  { label: 'Footer', href: '/admin/footer', icon: LayoutTemplate },
]

const systemItems = [
  { label: 'จัดการแอดมิน', href: '/admin/admins', icon: Users },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [me, setMe] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.ok ? r.json() : null).then(data => setMe(data))
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 bg-white flex flex-col z-40 border-r border-slate-200/80 transition-all duration-300 overflow-hidden',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn("h-16 flex items-center shrink-0", collapsed ? "justify-center px-0" : "justify-between px-4")}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0a1628] flex items-center justify-center shadow-md shrink-0">
              <span className="text-[#f97316] text-sm font-black">P</span>
            </div>
            <span className="text-slate-900 font-extrabold text-base tracking-tight whitespace-nowrap overflow-hidden">
              PRO<span className="text-[#f97316]">BAX</span>
              <sup className="text-[8px] font-bold text-slate-400 ml-0.5 tracking-widest">ADMIN</sup>
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className={cn(
            "rounded-lg flex items-center justify-center transition-all shrink-0",
            collapsed 
              ? "w-12 h-12 text-slate-500 hover:text-slate-800 hover:bg-slate-100" 
              : "w-8 h-8 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          )}
          title={collapsed ? 'ขยาย Sidebar' : 'พับ Sidebar'}
        >
          {collapsed
            ? <PanelLeftOpen className="w-5 h-5" />
            : <PanelLeftClose className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Search — hidden when collapsed */}
      {!collapsed && (
        <div className="px-4 mb-5 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm placeholder:text-slate-400 pl-9 pr-9 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316]/20 focus:border-[#f97316]/50 transition-all"
            />
            <kbd className="absolute right-3 text-[10px] text-slate-400 font-mono border border-slate-200 rounded px-1 py-0.5 bg-white">/</kbd>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 overflow-y-auto space-y-5">
        {/* Navigation group */}
        <div>
          {!collapsed && (
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 px-3 mb-2">
              Navigation
            </p>
          )}
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'group relative flex items-center rounded-xl text-sm transition-all duration-150',
                    collapsed
                      ? 'justify-center p-2.5 mx-auto w-[48px]'
                      : 'gap-3 px-2.5 py-2.5',
                    active
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all',
                    active
                      ? 'bg-white shadow-sm text-[#f97316]'
                      : 'text-slate-400 group-hover:text-slate-600'
                  )}>
                    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {!collapsed && (
                    <>
                      <span className="flex-1 whitespace-nowrap">{item.label}</span>
                      {item.badge != null && (
                        <span className={cn(
                          'text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center',
                          active
                            ? 'bg-[#f97316] text-white'
                            : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}

                  {/* Badge dot when collapsed */}
                  {collapsed && item.badge != null && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#f97316] rounded-full" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>

        {/* System group */}
        <div>
          {!collapsed && (
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 px-3 mb-2">
              System
            </p>
          )}
          <div className="space-y-0.5">
            {systemItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    'group flex items-center rounded-xl text-sm transition-all duration-150',
                    collapsed
                      ? 'justify-center p-2.5 mx-auto w-[48px]'
                      : 'gap-3 px-2.5 py-2.5',
                    active
                      ? 'bg-slate-100 text-slate-900 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 font-medium'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all',
                    active
                      ? 'bg-white shadow-sm text-[#f97316]'
                      : 'text-slate-400 group-hover:text-slate-600'
                  )}>
                    <Icon className="w-4 h-4" strokeWidth={active ? 2.5 : 2} />
                  </div>
                  {!collapsed && <span className="flex-1 whitespace-nowrap">{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Promo Card — hidden when collapsed */}
      {!collapsed && (
        <div className="px-4 py-4 shrink-0">
          <div className="relative rounded-2xl overflow-hidden p-4 bg-gradient-to-br from-[#0a1628] to-[#1d3a6e]">
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#f97316]/30 rounded-full blur-2xl -translate-y-4 translate-x-4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/20 rounded-full blur-2xl translate-y-4 -translate-x-4 pointer-events-none" />
            <div className="relative z-10 flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-[#f97316] flex items-center justify-center shadow-lg shadow-orange-500/30 shrink-0">
                <span className="text-white text-sm font-black">P</span>
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">PRO BAX System</p>
                <p className="text-white/50 text-[10px] leading-tight mt-0.5">v1.0.0 · Enterprise</p>
              </div>
            </div>
            <p className="relative z-10 text-white/60 text-[11px] leading-relaxed mb-3">
              ระบบจัดการข้อมูลและลูกค้าสำหรับทีมงาน PRO BAX
            </p>
            <Link
              href="/admin"
              className="relative z-10 flex items-center justify-center gap-1.5 bg-white text-[#0a1628] text-xs font-bold py-2 px-4 rounded-xl hover:bg-orange-50 hover:text-[#f97316] transition-all"
            >
              ดูคู่มือการใช้งาน
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* User */}
      <div className={cn(
        'border-t border-slate-100 p-3 flex items-center gap-3 shrink-0',
        collapsed ? 'justify-center' : ''
      )}>
        <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-[#f97316] flex items-center justify-center text-white text-xs font-bold shrink-0 shrink-0">
          {me?.name?.[0]?.toUpperCase() ?? 'A'}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white" />
        </div>
        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="text-slate-800 text-xs font-bold truncate leading-none mb-1">{me?.name ?? '...'}</p>
              <p className="text-slate-400 text-[10px] truncate leading-none">{me?.email ?? ''}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-300 hover:text-red-400 transition-colors shrink-0"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
