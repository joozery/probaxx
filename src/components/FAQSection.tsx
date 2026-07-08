'use client'

import { useState } from 'react'
import type { IServicesSettings } from '@/models/ServicesSettings'

interface Props {
  data: IServicesSettings['faq']
}

export default function FAQSection({ data }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <h3 className="text-[#1d4ed8] font-bold text-sm tracking-widest uppercase mb-2">FAQ</h3>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold" style={{ color: data.headingColor || '#0a1628' }}>
            {data.heading || 'คำถามที่พบบ่อย'}
          </h2>
          <div className="w-12 h-1 bg-[#1d4ed8] mx-auto mt-4" />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {data.items.map((faq, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={i}
                className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-[#1d4ed8] shadow-md bg-blue-50/50' : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  onClick={() => toggleFaq(i)}
                >
                  <span className="font-bold text-lg pr-8" style={{ color: isOpen ? '#1d4ed8' : (data.questionColor || '#0a1628') }}>
                    {faq.question}
                  </span>
                  <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isOpen ? 'bg-[#1d4ed8] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                <div
                  className={`px-6 transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <p className="leading-relaxed text-sm md:text-base" style={{ color: data.answerColor || '#4b5563' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-gray-50 rounded-3xl p-8 border border-gray-100">
          <h4 className="text-xl font-bold text-[#0a1628] mb-2">มีคำถามเพิ่มเติมใช่ไหม?</h4>
          <p className="text-gray-500 mb-6">ทีมงานของเราพร้อมให้คำปรึกษาและประเมินราคาฟรีตลอด 24 ชั่วโมง</p>
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-2 bg-[#1d4ed8] text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
            ติดต่อสอบถาม
          </a>
        </div>

      </div>
    </section>
  )
}
