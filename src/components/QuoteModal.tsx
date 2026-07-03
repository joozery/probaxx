'use client'
import { useState, useEffect } from 'react'
import { useQuote } from '@/context/QuoteContext'

const services = [
  'ล้างถังเก็บน้ำ',
  'ล้างถังบำบัดน้ำเสีย',
  'ทำความสะอาดระบบน้ำ',
  'ตรวจสอบคุณภาพน้ำ',
  'อื่นๆ',
]

type FormData = {
  name: string
  phone: string
  lineId: string
  service: string
  tankSize: string
  address: string
  detail: string
}

const empty: FormData = { name: '', phone: '', lineId: '', service: '', tankSize: '', address: '', detail: '' }

export default function QuoteModal() {
  const { isOpen, closeQuote } = useQuote()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(empty)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitted, setSubmitted] = useState(false)

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => { setStep(1); setForm(empty); setErrors({}); setSubmitted(false) }, 300)
    }
  }, [isOpen])

  const set = (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }))
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validateStep1 = () => {
    const e: Partial<FormData> = {}
    if (!form.name.trim()) e.name = 'กรุณากรอกชื่อ-นามสกุล'
    if (!form.phone.trim()) e.phone = 'กรุณากรอกเบอร์โทรศัพท์'
    else if (!/^[0-9]{9,10}$/.test(form.phone.replace(/-/g, ''))) e.phone = 'รูปแบบเบอร์โทรไม่ถูกต้อง'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e: Partial<FormData> = {}
    if (!form.service) e.service = 'กรุณาเลือกประเภทบริการ'
    if (!form.address.trim()) e.address = 'กรุณากรอกสถานที่ดำเนินการ'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => { if (validateStep1()) setStep(2) }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep2()) return
    // TODO: send to API / email / Line Notify
    console.log('Quote request:', form)
    setSubmitted(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeQuote} />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh]">

        {/* Header */}
        <div className="bg-[#0a1628] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-[#f97316] text-xs font-bold tracking-widest uppercase mb-0.5">
              {submitted ? 'สำเร็จ' : `ขั้นตอน ${step} / 2`}
            </p>
            <h2 className="text-white font-bold text-lg leading-tight">
              {submitted ? 'รับเรื่องเรียบร้อยแล้ว' : step === 1 ? 'ข้อมูลผู้ติดต่อ' : 'รายละเอียดงาน'}
            </h2>
          </div>
          <button onClick={closeQuote} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {!submitted && (
          <div className="h-1 bg-gray-100 flex-shrink-0">
            <div
              className="h-full bg-[#f97316] transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {submitted ? (
            /* ── Success ── */
            <div className="flex flex-col items-center text-center px-8 py-12">
              <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-5">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-[#0a1628] font-bold text-xl mb-2">ส่งคำขอสำเร็จ!</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                ขอบคุณคุณ <span className="font-semibold text-[#0a1628]">{form.name}</span> ที่ไว้วางใจเรา
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                ทีมงานจะติดต่อกลับภายใน <span className="font-semibold text-[#f97316]">24 ชั่วโมง</span> ทางเบอร์ {form.phone}
              </p>
              <div className="w-full bg-gray-50 rounded-xl p-4 text-left text-sm space-y-2 mb-8">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">สรุปคำขอ</p>
                <Row label="บริการ" value={form.service} />
                <Row label="สถานที่" value={form.address} />
                {form.tankSize && <Row label="ขนาด/จำนวน" value={form.tankSize} />}
                {form.detail && <Row label="รายละเอียด" value={form.detail} />}
              </div>
              <button
                onClick={closeQuote}
                className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3 rounded-xl transition-colors"
              >
                ปิด
              </button>
            </div>
          ) : step === 1 ? (
            /* ── Step 1 ── */
            <form className="px-6 py-6 space-y-5" onSubmit={e => { e.preventDefault(); handleNext() }}>
              <Field label="ชื่อ-นามสกุล" required error={errors.name}>
                <input
                  type="text"
                  placeholder="เช่น สมชาย ใจดี"
                  value={form.name}
                  onChange={set('name')}
                  className={input(errors.name)}
                />
              </Field>
              <Field label="เบอร์โทรศัพท์" required error={errors.phone}>
                <input
                  type="tel"
                  placeholder="เช่น 085-556-4994"
                  value={form.phone}
                  onChange={set('phone')}
                  className={input(errors.phone)}
                />
              </Field>
              <Field label="Line ID" hint="(ไม่บังคับ)">
                <input
                  type="text"
                  placeholder="เช่น @username"
                  value={form.lineId}
                  onChange={set('lineId')}
                  className={input()}
                />
              </Field>
              <button type="submit" className="w-full bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                ถัดไป
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          ) : (
            /* ── Step 2 ── */
            <form className="px-6 py-6 space-y-5" onSubmit={handleSubmit}>
              <Field label="ประเภทบริการ" required error={errors.service}>
                <select value={form.service} onChange={set('service')} className={input(errors.service)}>
                  <option value="">-- เลือกประเภทบริการ --</option>
                  {services.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="ขนาด / จำนวนถัง" hint="(ไม่บังคับ)">
                <input
                  type="text"
                  placeholder="เช่น ถัง 2,000 ลิตร จำนวน 2 ใบ"
                  value={form.tankSize}
                  onChange={set('tankSize')}
                  className={input()}
                />
              </Field>
              <Field label="สถานที่ดำเนินการ" required error={errors.address}>
                <input
                  type="text"
                  placeholder="เช่น บ้านพัก / คอนโด / โรงงาน + จังหวัด"
                  value={form.address}
                  onChange={set('address')}
                  className={input(errors.address)}
                />
              </Field>
              <Field label="รายละเอียดเพิ่มเติม" hint="(ไม่บังคับ)">
                <textarea
                  rows={3}
                  placeholder="ระบุรายละเอียดเพิ่มเติม หรือวันที่ต้องการให้เข้าบริการ..."
                  value={form.detail}
                  onChange={set('detail')}
                  className={`${input()} resize-none`}
                />
              </Field>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 hover:border-gray-400 text-gray-600 font-semibold py-3.5 rounded-xl transition-colors"
                >
                  ย้อนกลับ
                </button>
                <button type="submit" className="flex-[2] bg-[#f97316] hover:bg-[#ea6c0a] text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  ส่งคำขอใบเสนอราคา
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}

function Field({ label, required, hint, error, children }: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#0a1628] mb-1.5">
        {label}
        {required && <span className="text-[#f97316] ml-0.5">*</span>}
        {hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-gray-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-[#0a1628] font-medium">{value}</span>
    </div>
  )
}

const input = (error?: string) =>
  `w-full px-4 py-3 rounded-xl border text-sm text-[#0a1628] placeholder-gray-300 outline-none transition-colors ${
    error ? 'border-red-400 bg-red-50 focus:border-red-400' : 'border-gray-200 bg-gray-50 focus:border-[#f97316] focus:bg-white'
  }`
