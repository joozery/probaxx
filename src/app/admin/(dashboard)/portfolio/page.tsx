'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import {
  Loader2, Save, Upload, X, Plus, Trash2, Edit, Check
} from 'lucide-react'

// --- Types ---
interface Stat { value: string; label: string }
interface PortfolioItem { src: string; images: string[]; title: string; category: string; tag: string; desc: string }
interface SettingsState {
  hero: { badge: string; title: string; titleOrange: string; description: string }
  stats: Stat[]
  items: PortfolioItem[]
  caseStudy: {
    label: string; title: string; description: string; image: string
    stat1Value: string; stat1Label: string; stat2Value: string; stat2Label: string
  }
}

const DEFAULTS: SettingsState = {
  hero: { badge: '', title: '', titleOrange: '', description: '' },
  stats: [],
  items: [],
  caseStudy: { label: '', title: '', description: '', image: '', stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '' },
}

// --- Reusable Components ---
const Input = ({ label, value, onChange, placeholder, rows }: any) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {rows ? (
      <textarea rows={rows} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    ) : (
      <input className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    )}
  </div>
)

const ImageUploader = ({ label, value, onChange }: { label?: string, value: string, onChange: (url: string) => void }) => {
  const [loading, setLoading] = useState(false)
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setLoading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) onChange(url)
    } catch { alert('อัปโหลดล้มเหลว') }
    setLoading(false); e.target.value = ''
  }
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-gray-50 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button onClick={() => onChange('')} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:text-red-500 opacity-0 group-hover:opacity-100"><X size={14}/></button>
          </div>
        ) : (
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          </div>
        )}
        <div className="flex-1">
          <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="URL รูปภาพ..." className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm" />
          <label className="cursor-pointer text-sm text-blue-600 hover:underline">
            หรืออัปโหลดไฟล์
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        </div>
      </div>
    </div>
  )
}

const Modal = ({ isOpen, onClose, title, children, onSave }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          {children}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">ยกเลิก</button>
          <button onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">บันทึก</button>
        </div>
      </div>
    </div>
  )
}

// --- Main Page ---
export default function PortfolioAdmin() {
  const [settings, setSettings] = useState<SettingsState>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('items')

  // Modals state
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null)
  const [tempItem, setTempItem] = useState<PortfolioItem | null>(null)

  const [editingStatIndex, setEditingStatIndex] = useState<number | null>(null)
  const [tempStat, setTempStat] = useState<Stat | null>(null)

  useEffect(() => {
    fetch('/api/portfolio-settings').then(r => r.json()).then((d: SettingsState) => {
      setSettings({ hero: d.hero, stats: d.stats, items: d.items, caseStudy: d.caseStudy })
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const saveAll = async () => {
    setSaving(true)
    await fetch('/api/portfolio-settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  // Helpers
  const upH = (k: keyof SettingsState['hero'], v: string) => setSettings(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  const upCS = (k: keyof SettingsState['caseStudy'], v: string) => setSettings(p => ({ ...p, caseStudy: { ...p.caseStudy, [k]: v } }))

  if (loading) return <div className="p-8 text-center text-gray-500">กำลังโหลด...</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ผลงาน (Portfolio)</h1>
          <p className="text-sm text-gray-500">จัดการข้อมูลหน้าผลงานของเว็บไซต์</p>
        </div>
        <button onClick={saveAll} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'บันทึกสำเร็จ' : 'บันทึกทั้งหมด'}
        </button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex border-b border-gray-200 mb-6">
          <Tabs.Trigger value="items" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700">ผลงานทั้งหมด (Items)</Tabs.Trigger>
          <Tabs.Trigger value="stats" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700">สถิติ (Stats)</Tabs.Trigger>
          <Tabs.Trigger value="general" className="px-4 py-2 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700">ข้อความทั่วไป (Hero & Case Study)</Tabs.Trigger>
        </Tabs.List>

        {/* --- TAB: ITEMS --- */}
        <Tabs.Content value="items">
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">รายการผลงาน ({settings.items.length})</h3>
              <button 
                onClick={() => { setTempItem({ src: '', images: [], title: '', category: '', tag: '', desc: '' }); setEditingItemIndex(-1); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                <Plus size={16} /> เพิ่มผลงาน
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium w-16">รูป</th>
                    <th className="px-4 py-3 font-medium">ชื่อผลงาน</th>
                    <th className="px-4 py-3 font-medium">หมวดหมู่</th>
                    <th className="px-4 py-3 font-medium">ป้ายกำกับ</th>
                    <th className="px-4 py-3 font-medium text-right">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {settings.items.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">ไม่มีข้อมูล</td></tr>
                  ) : settings.items.map((item, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {item.src ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.src} alt="" className="w-10 h-10 rounded object-cover border border-gray-200" />
                        ) : <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200" />}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-800">{item.title || '-'}</td>
                      <td className="px-4 py-2">{item.category || '-'}</td>
                      <td className="px-4 py-2"><span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs">{item.tag || '-'}</span></td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => { setTempItem({...item}); setEditingItemIndex(i); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1"><Edit size={16} /></button>
                        <button onClick={() => setSettings(p => ({...p, items: p.items.filter((_, idx) => idx !== i)}))} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Tabs.Content>

        {/* --- TAB: STATS --- */}
        <Tabs.Content value="stats">
          <div className="bg-white rounded-md shadow-sm border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-gray-800">สถิติ (Stats)</h3>
              <button 
                onClick={() => { setTempStat({ value: '', label: '' }); setEditingStatIndex(-1); }}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-sm font-medium rounded-md hover:bg-gray-50"
              >
                <Plus size={16} /> เพิ่มสถิติ
              </button>
            </div>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">ตัวเลข</th>
                  <th className="px-4 py-3 font-medium">คำอธิบาย</th>
                  <th className="px-4 py-3 font-medium text-right w-24">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settings.stats.map((st, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold text-gray-800">{st.value}</td>
                    <td className="px-4 py-2">{st.label}</td>
                    <td className="px-4 py-2 text-right">
                      <button onClick={() => { setTempStat({...st}); setEditingStatIndex(i); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded mr-1"><Edit size={16} /></button>
                      <button onClick={() => setSettings(p => ({...p, stats: p.stats.filter((_, idx) => idx !== i)}))} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>

        {/* --- TAB: GENERAL (Hero & Case Study) --- */}
        <Tabs.Content value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Hero Section</h3>
              <Input label="ป้ายกำกับ (Badge)" value={settings.hero.badge} onChange={(v:any) => upH('badge', v)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="หัวข้อ (สีขาว)" value={settings.hero.title} onChange={(v:any) => upH('title', v)} />
                <Input label="หัวข้อ (สีส้ม)" value={settings.hero.titleOrange} onChange={(v:any) => upH('titleOrange', v)} />
              </div>
              <Input label="คำอธิบาย" value={settings.hero.description} onChange={(v:any) => upH('description', v)} rows={3} />
            </div>

            <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b">Case Study Section</h3>
              <Input label="ป้ายกำกับ" value={settings.caseStudy.label} onChange={(v:any) => upCS('label', v)} />
              <Input label="หัวข้อเรื่อง" value={settings.caseStudy.title} onChange={(v:any) => upCS('title', v)} />
              <Input label="คำอธิบาย" value={settings.caseStudy.description} onChange={(v:any) => upCS('description', v)} rows={2} />
              <ImageUploader label="รูปภาพประกอบ" value={settings.caseStudy.image} onChange={(url) => upCS('image', url)} />
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="p-3 bg-orange-50 rounded">
                  <Input label="สถิติ 1: ตัวเลข" value={settings.caseStudy.stat1Value} onChange={(v:any) => upCS('stat1Value', v)} />
                  <Input label="สถิติ 1: คำอธิบาย" value={settings.caseStudy.stat1Label} onChange={(v:any) => upCS('stat1Label', v)} />
                </div>
                <div className="p-3 bg-emerald-50 rounded">
                  <Input label="สถิติ 2: ตัวเลข" value={settings.caseStudy.stat2Value} onChange={(v:any) => upCS('stat2Value', v)} />
                  <Input label="สถิติ 2: คำอธิบาย" value={settings.caseStudy.stat2Label} onChange={(v:any) => upCS('stat2Label', v)} />
                </div>
              </div>
            </div>
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* --- MODAL: ITEM --- */}
      <Modal 
        isOpen={editingItemIndex !== null} 
        onClose={() => { setEditingItemIndex(null); setTempItem(null); }}
        title={editingItemIndex === -1 ? 'เพิ่มผลงานใหม่' : 'แก้ไขผลงาน'}
        onSave={() => {
          if (!tempItem) return;
          setSettings(p => {
            const arr = [...p.items];
            if (editingItemIndex === -1) arr.push(tempItem);
            else arr[editingItemIndex!] = tempItem;
            return { ...p, items: arr };
          })
          setEditingItemIndex(null); setTempItem(null);
        }}
      >
        {tempItem && (
          <div className="space-y-4">
            <Input label="ชื่อโปรเจกต์" value={tempItem.title} onChange={(v:any) => setTempItem({...tempItem, title: v})} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="หมวดหมู่ (Category)" value={tempItem.category} onChange={(v:any) => setTempItem({...tempItem, category: v})} placeholder="เช่น โรงพยาบาล" />
              <Input label="ป้ายกำกับ (Tag)" value={tempItem.tag} onChange={(v:any) => setTempItem({...tempItem, tag: v})} placeholder="เช่น ล้างถังเก็บน้ำ" />
            </div>
            <Input label="รายละเอียดสั้นๆ" value={tempItem.desc} onChange={(v:any) => setTempItem({...tempItem, desc: v})} rows={3} />
            
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-4">รูปภาพ</h4>
              <ImageUploader label="รูปภาพหน้าปก (แสดงหน้าตาราง)" value={tempItem.src} onChange={(v) => setTempItem({...tempItem, src: v})} />
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">รูปแกลเลอรี่เพิ่มเติม ({(tempItem.images || []).length} รูป)</label>
                <div className="flex flex-wrap gap-3">
                  {(tempItem.images || []).map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 border border-gray-200 rounded group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover rounded" />
                      <button onClick={() => setTempItem({...tempItem, images: tempItem.images.filter((_, k) => k !== idx)})} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 shadow"><X size={12}/></button>
                    </div>
                  ))}
                  <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 cursor-pointer">
                    <Plus size={20} />
                    <span className="text-[10px] mt-1">เพิ่มรูป</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      for (const file of files) {
                        const fd = new FormData(); fd.append('file', file)
                        const res = await fetch('/api/upload', { method: 'POST', body: fd })
                        const { url } = await res.json()
                        if (url) setTempItem(prev => ({...prev!, images: [...(prev!.images || []), url]}))
                      }
                      e.target.value = ''
                    }} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* --- MODAL: STAT --- */}
      <Modal
        isOpen={editingStatIndex !== null}
        onClose={() => { setEditingStatIndex(null); setTempStat(null); }}
        title={editingStatIndex === -1 ? 'เพิ่มสถิติ' : 'แก้ไขสถิติ'}
        onSave={() => {
          if (!tempStat) return;
          setSettings(p => {
            const arr = [...p.stats];
            if (editingStatIndex === -1) arr.push(tempStat);
            else arr[editingStatIndex!] = tempStat;
            return { ...p, stats: arr };
          })
          setEditingStatIndex(null); setTempStat(null);
        }}
      >
        {tempStat && (
          <div className="space-y-4">
            <Input label="ตัวเลขสถิติ (เช่น 500+)" value={tempStat.value} onChange={(v:any) => setTempStat({...tempStat, value: v})} />
            <Input label="คำอธิบาย (เช่น โครงการสำเร็จ)" value={tempStat.label} onChange={(v:any) => setTempStat({...tempStat, label: v})} />
          </div>
        )}
      </Modal>

    </div>
  )
}
