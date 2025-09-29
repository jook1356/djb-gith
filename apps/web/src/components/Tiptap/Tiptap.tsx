'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Typography } from '@tiptap/extension-typography'
import { TextStyle } from '@tiptap/extension-text-style'
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import css from 'highlight.js/lib/languages/css'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'

const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('typescript', typescript)
lowlight.register('css', css)
lowlight.register('html', html)
lowlight.register('python', python)
lowlight.register('json', json)

import styles from './Tiptap.module.scss'

interface TiptapProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  editable?: boolean
}

export default function Tiptap({
  content = '',
  onChange,
  placeholder = '텍스트를 입력하세요...',
  editable = true
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // CodeBlockLowlight로 대체
      }),
      Typography,
      TextStyle,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content,
    editable,
    immediatelyRender: false, // SSR 환경에서 hydration 오류 방지
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror',
        'data-placeholder': placeholder,
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className={styles.tiptapEditor}>
      {editable && (
        <div className={styles.tiptapToolbar}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? styles.isActive : ''}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? styles.isActive : ''}
          >
            Italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? styles.isActive : ''}
          >
            Strike
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? styles.isActive : ''}
          >
            Code
          </button>
          <button
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            Clear marks
          </button>
          <button
            onClick={() => editor.chain().focus().clearNodes().run()}
          >
            Clear nodes
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive('paragraph') ? styles.isActive : ''}
          >
            Paragraph
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? styles.isActive : ''}
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={editor.isActive('heading', { level: 4 }) ? styles.isActive : ''}
          >
            H4
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={editor.isActive('heading', { level: 5 }) ? styles.isActive : ''}
          >
            H5
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
            className={editor.isActive('heading', { level: 6 }) ? styles.isActive : ''}
          >
            H6
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? styles.isActive : ''}
          >
            Bullet list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? styles.isActive : ''}
          >
            Ordered list
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? styles.isActive : ''}
          >
            Code block
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? styles.isActive : ''}
          >
            Blockquote
          </button>
          <button
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            Horizontal rule
          </button>
          <button
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            Hard break
          </button>
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            Redo
          </button>
        </div>
      )}
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
      />
    </div>
  )
}
