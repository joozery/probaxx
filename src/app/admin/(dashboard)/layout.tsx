'use client'
import Sidebar from '@/components/admin/Sidebar'
import { useState } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#f0f2f5]">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
      <main
        className="min-h-screen bg-[#f0f2f5] transition-all duration-300"
        style={{ marginLeft: collapsed ? 72 : 256 }}
      >
        {children}
      </main>
    </div>
  )
}
