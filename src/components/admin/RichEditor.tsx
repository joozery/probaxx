'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { useEffect, useCallback, useRef } from 'react'
import {
  Bold, Italic, UnderlineIcon, Strikethrough, Code,
  Heading2, Heading3, List, ListOrdered, Quote,
  AlignLeft, AlignCenter, AlignRight,
  Link2, ImageIcon, Minus, Undo, Redo, Highlighter,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (html: string) => void
}

function ToolbarBtn({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      className={cn(
        'p-1.5 rounded-lg transition-colors text-sm',
        active ? 'bg-[#0a1628] text-white' : 'text-gray-600 hover:bg-gray-100'
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="w-px h-5 bg-gray-200 mx-0.5 shrink-0" />
}

export default function RichEditor({ value, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-600 underline' } }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl max-w-full mx-auto shadow-md my-4' } }),
      Placeholder.configure({ placeholder: 'เริ่มเขียนเนื้อหาบทความที่นี่...' }),
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[420px] focus:outline-none text-gray-700 leading-relaxed [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:text-[#0a1628] [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-[#0a1628] [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-[#0a1628] [&_blockquote]:border-l-4 [&_blockquote]:border-blue-400 [&_blockquote]:bg-blue-50 [&_blockquote]:pl-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-xl [&_blockquote]:my-4 [&_blockquote]:text-gray-600 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1 [&_a]:text-blue-600 [&_a]:underline [&_code]:bg-blue-50 [&_code]:text-blue-700 [&_code]:px-1.5 [&_code]:rounded [&_pre]:bg-[#0a1628] [&_pre]:text-green-400 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:my-4 [&_hr]:border-gray-200 [&_hr]:my-6 [&_p.is-editor-empty:first-child]:before:text-gray-300 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:pointer-events-none',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  const addLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL:', prev)
    if (url === null) return
    if (!url) { editor.chain().focus().unsetLink().run(); return }
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  const addImageUrl = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL รูปภาพ:')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      if (url) editor.chain().focus().setImage({ src: url }).run()
    } catch {
      alert('อัปโหลดรูปไม่สำเร็จ')
    }
    e.target.value = ''
  }, [editor])

  if (!editor) return null

  const wordCount = editor.storage.characterCount?.words() ?? 0

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50/80 sticky top-0 z-10">
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="ย้อนกลับ"><Undo className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="ทำซ้ำ"><Redo className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="หัวข้อ H2"><Heading2 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="หัวข้อ H3"><Heading3 className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="ตัวหนา"><Bold className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="ตัวเอียง"><Italic className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="ขีดเส้นใต้"><UnderlineIcon className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="ขีดทับ"><Strikethrough className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="ไฮไลท์"><Highlighter className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="โค้ด"><Code className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="ชิดซ้าย"><AlignLeft className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="กึ่งกลาง"><AlignCenter className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="ชิดขวา"><AlignRight className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="รายการ"><List className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="รายการตัวเลข"><ListOrdered className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="อ้างอิง"><Quote className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="เส้นแบ่ง"><Minus className="w-4 h-4" /></ToolbarBtn>
        <Divider />
        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="ลิงก์"><Link2 className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={addImageUrl} title="รูปภาพจาก URL"><ImageIcon className="w-4 h-4" /></ToolbarBtn>
        <ToolbarBtn onClick={() => fileRef.current?.click()} title="อัปโหลดรูปภาพ">
          <Upload className="w-4 h-4" />
        </ToolbarBtn>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
      </div>

      {/* Editor area */}
      <div className="p-5">
        <EditorContent editor={editor} />
      </div>

      {/* Footer stats */}
      <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          {wordCount} คำ · อ่านประมาณ {Math.max(1, Math.ceil(wordCount / 200))} นาที
        </span>
        <span className="text-[11px] text-gray-400">TipTap Editor</span>
      </div>
    </div>
  )
}
