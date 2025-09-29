'use client'


import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import { Typography } from '@tiptap/extension-typography'
import { TextStyle } from '@tiptap/extension-text-style'
import { EditorContent, ReactNodeViewRenderer, useEditor } from '@tiptap/react'
import { Markdown } from 'tiptap-markdown'
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight'
import React from 'react'

// eslint-disable-next-line
import CodeBlockComponent from './CodeBlockComponent'
import './Tiptap.scss'

// create a lowlight instance
const lowlight = createLowlight(all)

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)
lowlight.register('python', python)
lowlight.register('java', java)
lowlight.register('json', json)
lowlight.register('markdown', markdown)
lowlight.register('bash', bash)
lowlight.register('sql', sql)

interface TiptapProps {
  content?: string
  onChange?: (content: string) => void
  onMarkdownChange?: (markdown: string) => void // 마크다운 변경 콜백
  placeholder?: string
  editable?: boolean
  readonly?: boolean // 읽기전용 모드
  markdownContent?: string // 마크다운 초기 콘텐츠
  className?: string // CSS 클래스명
}

const MenuBar = ({ editor, editable = true }: { editor: any, editable?: boolean }) => {
  if (!editor || !editable) {
    return null
  }

  return (
    <div className={'tiptapToolbar'}>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'isActive' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'isActive' : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'isActive' : ''}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'isActive' : ''}
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
        className={editor.isActive('paragraph') ? 'isActive' : ''}
      >
        Paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'isActive' : ''}
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'isActive' : ''}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'isActive' : ''}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={editor.isActive('heading', { level: 4 }) ? 'isActive' : ''}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={editor.isActive('heading', { level: 5 }) ? 'isActive' : ''}
      >
        H5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={editor.isActive('heading', { level: 6 }) ? 'isActive' : ''}
      >
        H6
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'isActive' : ''}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'isActive' : ''}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'isActive' : ''}
      >
        Code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'isActive' : ''}
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
  )
}

export default function Tiptap({
  content = '',
  onChange,
  onMarkdownChange,
  placeholder = '텍스트를 입력하세요...',
  editable = true,
  readonly = false,
  markdownContent,
  className
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
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent)
        },
      }).configure({ lowlight }),
      Markdown.configure({
        html: true, // HTML 태그 허용
        tightLists: true, // 더 깔끔한 리스트 렌더링
        tightListClass: 'tight', // tight 리스트에 클래스 추가
        bulletListMarker: '-', // 불릿 리스트 마커
        linkify: true, // URL 자동 링크 변환
        breaks: true, // 줄바꿈을 <br>로 변환
        transformPastedText: true, // 붙여넣기 시 마크다운 변환
        transformCopiedText: true, // 복사 시 마크다운 변환
      }),
    ],
    content: markdownContent ? undefined : content, // 마크다운 콘텐츠가 있으면 HTML content 무시
    editable: readonly ? false : editable,
    immediatelyRender: false, // SSR 환경에서 hydration 오류 방지
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML())
      }
      if (onMarkdownChange) {
        // @ts-ignore - tiptap-markdown 확장의 타입이 정의되지 않음
        onMarkdownChange(editor.storage.markdown?.getMarkdown?.() || '')
      }
    },
    onCreate: ({ editor }) => {
      // 마크다운 콘텐츠가 있으면 에디터 생성 후 설정
      if (markdownContent) {
        editor.commands.setContent(markdownContent)
      }
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
        'data-placeholder': placeholder,
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className={`${readonly ? 'tiptapEditor readonly' : 'tiptapEditor'}${className ? ` ${className}` : ''}`}>
      <MenuBar editor={editor} editable={editable && !readonly} />
      <EditorContent editor={editor} />
    </div>
  )
}
