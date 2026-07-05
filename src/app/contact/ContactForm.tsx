'use client'
import { useState } from 'react'

const PHONE = '085-556-4994'
const PHONE_RAW = '0855564994'

const SERVICES = [
  'ล้างถังเก็บน้ำบนดิน/ใต้ดิน',
  'ล้างถังบำบัดน้ำเสีย',
  'ออกแบบและติดตั้งระบบบำบัดน้ำเสีย',
  'บริการผู้ควบคุมระบบบำบัดน้ำเสีย',
  'อื่นๆ',
]

const INPUT_CLS =
  'w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/20 focus:border-[#1d4ed8] transition-all text-[#0a1628] placeholder:text-gray-400'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-10 gap-5">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-green-500">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-[#0a1628] mb-2">ส่งข้อความเ��ียบร้อยแล้ว!</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            ขอบคุณที่ติดต่อเข้ามาครับ ทีมงานจะโทรกลับภายใน 1 วันทำการ หากเร่งด่วนสามารถโทรหาเราได้เลย
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href={`tel:${PHONE_RAW}`}
            className="inline-flex items-center gap-2 bg-[#f97316] text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#ea6c0a] transition-colors"
          >
            โทร {PHONE}
          </a>
          <button
            onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', service: '', message: '' }) }}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            ส่งข้อความใหม่
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <h3 className="text-xl font-extrabold text-[#0a1628] mb-1">ส่งข้อความหาเรา</h3>
      <p className="text-gray-400 text-sm mb-5">กรอกข้อมูลด้านล่าง ทีมงานจะติดต่อกลับโดยเร็วที่สุดครับ</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#0a1628]">ชื่อ – นามสกุล <span className="text-red-500">*</span></label>
            <input type="text" name="name" required value={form.name} onChange={handleChange} placeholder="กรุณากรอกชื่อของคุณ" className={INPUT_CLS} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#0a1628]">เบอร์โทรศัพท์ <span className="text-red-500">*</span></label>
            <input type="tel" name="phone" required value={form.phone} onChange={handleChange} placeholder="08X-XXX-XXXX" className={INPUT_CLS} />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#0a1628]">อีเมล (ถ้ามี)</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="example@email.com" className={INPUT_CLS} />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#0a1628]">บริการที่สนใจ</label>
          <div className="relative">
            <select name="service" value={form.service} onChange={handleChange} className={INPUT_CLS + ' appearance-none'}>
              <option value="">-- กรุณาเลือกบริการ --</option>
              {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#0a1628]">รายละเอียดเพิ่มเติม <span className="text-red-500">*</span></label>
          <textarea name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="อธิบายรายละเอียดปัญหา หรือความต้องการของคุณ" className={INPUT_CLS + ' resize-none'} />
        </div>

        <button type="submit" className="w-full bg-[#1d4ed8] hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          ส่งข้อความ
        </button>

        <p className="text-center text-xs text-gray-400">
          หรือ{' '}
          <a href={`tel:${PHONE_RAW}`} className="text-[#f97316] font-semibold hover:underline">โทรหาเราเลย {PHONE}</a>
          {' '}สำหรับกรณีเร่งด่วน
        </p>
      </form>
    </>
  )
}
