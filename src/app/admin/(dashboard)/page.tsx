'use client'
import { MessageSquare, ClipboardList, FileText, Wrench, TrendingUp, ArrowRight, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ── Sparkline SVG ──────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const w = 80, h = 32
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min || 1)) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Donut Chart ────────────────────────────────────────────────
function DonutChart({ segments }: { segments: { value: number; color: string }[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0)
  const r = 56, cx = 70, cy = 70, stroke = 22
  let offset = -90
  const arcs = segments.map((seg) => {
    const pct = seg.value / total
    const angle = pct * 360
    const rad = (a: number) => (a * Math.PI) / 180
    const x1 = cx + r * Math.cos(rad(offset))
    const y1 = cy + r * Math.sin(rad(offset))
    const x2 = cx + r * Math.cos(rad(offset + angle))
    const y2 = cy + r * Math.sin(rad(offset + angle))
    const large = angle > 180 ? 1 : 0
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`
    offset += angle
    return { d, color: seg.color }
  })
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      {arcs.map((arc, i) => (
        <path key={i} d={arc.d} fill="none" stroke={arc.color} strokeWidth={stroke} strokeLinecap="butt" />
      ))}
      <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="white" />
    </svg>
  )
}

// ── Mini Line Chart ────────────────────────────────────────────
function MiniLineChart() {
  const labels = ['1 พ.ค.', '6 พ.ค.', '11 พ.ค.', '16 พ.ค.', '21 พ.ค.', '26 พ.ค.', '31 พ.ค.']
  const series = [
    { label: 'ใบเสนอราคา', color: '#3b82f6', data: [12, 18, 15, 22, 25, 30, 38] },
    { label: 'เสร็จสิ้น', color: '#10b981', data: [8, 12, 10, 16, 20, 24, 28] },
    { label: 'รอการดำเนินการ', color: '#f97316', data: [4, 6, 5, 8, 7, 10, 13] },
    { label: 'ยกเลิก', color: '#f43f5e', data: [2, 3, 2, 4, 3, 5, 4] },
  ]
  const w = 800, h = 240, pad = { l: 32, r: 12, t: 10, b: 24 }
  const maxV = 40
  const xScale = (i: number) => pad.l + (i / (labels.length - 1)) * (w - pad.l - pad.r)
  const yScale = (v: number) => pad.t + ((maxV - v) / maxV) * (h - pad.t - pad.b)
  const gridLines = [0, 10, 20, 30, 40]
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {/* Grid */}
      {gridLines.map(v => (
        <g key={v}>
          <line x1={pad.l} y1={yScale(v)} x2={w - pad.r} y2={yScale(v)} stroke="#f1f5f9" strokeWidth="1" />
          <text x={pad.l - 4} y={yScale(v) + 4} textAnchor="end" fontSize="9" fill="#94a3b8">{v}</text>
        </g>
      ))}
      {/* X labels */}
      {labels.map((lb, i) => (
        <text key={i} x={xScale(i)} y={h - 4} textAnchor="middle" fontSize="9" fill="#94a3b8">{lb}</text>
      ))}
      {/* Lines + dots */}
      {series.map((s) => (
        <g key={s.label}>
          <polyline
            points={s.data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ')}
            fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          />
          {s.data.map((v, i) => (
            <circle key={i} cx={xScale(i)} cy={yScale(v)} r="3" fill="white" stroke={s.color} strokeWidth="2" />
          ))}
        </g>
      ))}
    </svg>
  )
}

// ── Data ────────────────────────────────────────────────────────
const stats = [
  {
    label: 'ข้อความใหม่', value: 12, sub: 'รอตอบกลับ',
    icon: MessageSquare, iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
    accent: 'bg-blue-500', trend: '+20%', trendUp: true,
    spark: [4, 6, 5, 8, 7, 10, 12], sparkColor: '#3b82f6',
  },
  {
    label: 'ใบเสนอราคา', value: 5, sub: 'รอดำเนินการ',
    icon: ClipboardList, iconBg: 'bg-orange-50', iconColor: 'text-orange-500',
    accent: 'bg-orange-400', trend: '+14%', trendUp: true,
    spark: [2, 3, 2, 4, 3, 4, 5], sparkColor: '#f97316',
  },
  {
    label: 'ใบเสร็จงาน', value: 24, sub: 'รอการดำเนินการ',
    icon: FileText, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',
    accent: 'bg-emerald-500', trend: '+16%', trendUp: true,
    spark: [10, 14, 12, 16, 18, 22, 24], sparkColor: '#10b981',
  },
  {
    label: 'บริการ', value: 8, sub: 'เปิดใช้บริการทั้งหมด',
    icon: Wrench, iconBg: 'bg-violet-50', iconColor: 'text-violet-600',
    accent: 'bg-violet-500', trend: '+10%', trendUp: true,
    spark: [5, 5, 6, 6, 7, 7, 8], sparkColor: '#8b5cf6',
  },
]

const recentMessages = [
  { name: 'สมชาย ใจดี', excerpt: 'สอบถามการล้างถัง อาคารสำนักงาน...', time: '10:30', status: 'new', avatar: 'bg-blue-500' },
  { name: 'มลิวัลย์ สุขใส', excerpt: 'ต้องการทำความสะอาดถังใต้ดิน...', time: '09:15', status: 'pending', avatar: 'bg-violet-500' },
  { name: 'วิชัย มั่นคง', excerpt: 'สอบถามราคาระบบบำบัดน้ำเสียคุณภาพน้ำ...', time: 'เมื่อวาน', status: 'contacted', avatar: 'bg-teal-500' },
  { name: 'สมศรี สุขเกษม', excerpt: 'นัดหมายล้างถังน้ำ วันที่ 25 พ.ค.', time: 'เมื่อวาน', status: 'contacted', avatar: 'bg-orange-500' },
  { name: 'บริษัท พัฒนา จำกัด', excerpt: 'ต้องการโทรสอบถาม งานสำคัญตั้งแต่ปี่แล้ว...', time: '2 พ.ค.', status: 'read', avatar: 'bg-rose-500' },
]

const recentQuotes = [
  { name: 'บริษัท พัฒนา จำกัด', desc: 'งานล้างถังน้ำดื่ม 3000L', amount: '84,500', status: 'pending', date: '20 พ.ค. 2567' },
  { name: 'นิติบุคคล อาคาร A', desc: 'งานสำหรับถังน้ำดิบ อาคารสูง', amount: '12,000', status: 'inprogress', date: '19 พ.ค. 2567' },
  { name: 'ร้านกาแฟ สุขใจ', desc: 'ตรวจคุณภาพน้ำประจำเดือน', amount: '8,900', status: 'done', date: '18 พ.ค. 2567' },
]

const statusMap: Record<string, { label: string; cls: string }> = {
  new: { label: 'ใหม่', cls: 'bg-blue-50 text-blue-700' },
  pending: { label: 'รอตอบกลับ', cls: 'bg-orange-50 text-orange-700' },
  contacted: { label: 'ติดต่อแล้ว', cls: 'bg-emerald-50 text-emerald-700' },
  read: { label: 'ปิดงานแล้ว', cls: 'bg-slate-100 text-slate-600' },
  inprogress: { label: 'กำลังดำเนินการ', cls: 'bg-indigo-50 text-indigo-700' },
  done: { label: 'เสร็จสิ้น', cls: 'bg-green-50 text-green-700' },
}

const donutData = [
  { label: 'เสร็จสิ้น', value: 24, color: '#3b82f6' },
  { label: 'รอการดำเนินการ', value: 16, color: '#10b981' },
  { label: 'รอมอบหมาย', value: 6, color: '#f97316' },
  { label: 'ยกเลิก', value: 2, color: '#f43f5e' },
]
const totalWork = donutData.reduce((s, d) => s + d.value, 0)

// ── Page ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  return (
    <div className="min-h-full bg-slate-50/80 p-6 md:p-8 max-w-[1400px] mx-auto space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group flex">
              {/* Left accent bar */}
              <div className={cn('w-1 shrink-0', s.accent)} />
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.iconBg)}>
                    <Icon className={cn('w-4 h-4', s.iconColor)} strokeWidth={2} />
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                    <TrendingUp className="w-2.5 h-2.5 text-emerald-500" strokeWidth={3} />
                    <span className="text-[10px] font-bold text-emerald-600">{s.trend}</span>
                  </div>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none tracking-tight">{s.value}</p>
                    <p className="text-xs font-semibold text-slate-700 mt-1">{s.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.sub}</p>
                  </div>
                  <div className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0">
                    <Sparkline data={s.spark} color={s.sparkColor} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Messages + Quotes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Messages */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">ข้อความล่าสุด</h2>
            <Link href="/admin/messages" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 group">
              ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentMessages.map((m, i) => {
              const st = statusMap[m.status]
              return (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50/80 cursor-pointer transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 ${m.avatar}`}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-900 truncate">{m.name}</p>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{m.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{m.excerpt}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap shrink-0 ${st.cls}`}>
                    {st.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Quotes */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800">ใบเสนอราคาล่าสุด</h2>
            <Link href="/admin/quotes" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 group">
              ดูทั้งหมด <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentQuotes.map((q, i) => {
              const st = statusMap[q.status]
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 cursor-pointer transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-4.5 h-4.5 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{q.name}</p>
                    <p className="text-xs text-slate-500 truncate">{q.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-slate-900">฿{q.amount}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${st.cls}`}>{st.label}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{q.date}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Line Chart */}
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-800">สถิติการดำเนินงาน</h2>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              เดือนนี้ <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-3">
            {[
              { label: 'ใบเสนอราคา', color: '#3b82f6' },
              { label: 'เสร็จสิ้น', color: '#10b981' },
              { label: 'รอการดำเนินการ', color: '#f97316' },
              { label: 'ยกเลิก', color: '#f43f5e' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[11px] text-slate-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
          <MiniLineChart />
        </div>

        {/* Donut Chart */}
        <div className="bg-white border border-slate-100 rounded-xl shadow-sm p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-4">สัดส่วนสถานะงาน</h2>
          <div className="flex flex-col items-center">
            <div className="relative">
              <DonutChart segments={donutData} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[10px] text-slate-400 font-medium">รวมทั้งหมด</p>
                <p className="text-2xl font-black text-slate-900">{totalWork}</p>
                <p className="text-[10px] text-slate-400">งาน</p>
              </div>
            </div>
            <div className="w-full space-y-2 mt-2">
              {donutData.map((d) => (
                <div key={d.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-slate-600 font-medium">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{d.value} งาน</span>
                    <span className="text-[10px] text-slate-400">({Math.round(d.value / totalWork * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
