"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import PostMetaEditor from "./PostMetaEditor";
import type { PostMeta } from "@/types/contents";
import styles from "./PostEditor.module.scss";
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Typography } from '@tiptap/extension-typography';
import { TextStyle } from '@tiptap/extension-text-style';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Markdown } from 'tiptap-markdown';
import { all, createLowlight } from 'lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CodeBlockComponent from '@/components/Tiptap/CodeBlockComponent';
import '@/components/Tiptap/Tiptap.scss';

const lowlight = createLowlight(all);

interface PostEditorProps {
  initialContent?: string;
  initialMeta?: Partial<PostMeta>;
  boards?: Array<{ name: string; displayName: string; description: string; color: string }>;
  onSave?: (content: string, meta: Partial<PostMeta>) => void;
  onCancel?: () => void;
  className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="tiptapToolbar">
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
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        Clear marks
      </button>
      <button onClick={() => editor.chain().focus().clearNodes().run()}>
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
      <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        Horizontal rule
      </button>
      <button onClick={() => editor.chain().focus().setHardBreak().run()}>
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
  );
};

export default function PostEditor({
  initialContent = "",
  initialMeta,
  boards = [],
  onSave,
  onCancel,
  className = "",
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [meta, setMeta] = useState<Partial<PostMeta>>(initialMeta || {});
  const [previewMode, setPreviewMode] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // 포탈 컨테이너 찾기
  useEffect(() => {
    setPortalContainer(document.getElementById('editor-toolbar-portal'));
  }, []);

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
        codeBlock: false,
      }),
      Typography,
      TextStyle,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockComponent);
        },
      }).configure({ lowlight }),
      Markdown.configure({
        html: true,
        tightLists: true,
        tightListClass: 'tight',
        bulletListMarker: '-',
        linkify: true,
        breaks: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialContent,
    editable: !previewMode,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'tiptap',
        'data-placeholder': '글감과 함께 나의 일상을 기록해보세요!',
      },
    },
  });

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(content, meta);
    }
  }, [onSave, content, meta]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleMetaChange = useCallback((newMeta: Partial<PostMeta>) => {
    setMeta(newMeta);
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <div className={styles.editorContainer}>
      {/* 툴바를 Header 바로 아래 포탈로 렌더링 */}
      {portalContainer && createPortal(
        <div className={styles.toolbar}>
          <MenuBar editor={editor} />
        </div>,
        portalContainer
      )}

      {/* 종이 영역 */}
      <div className={styles.paperContainer}>
        <div className={styles.paper}>
          {/* 메타데이터 영역 */}
          <PostMetaEditor
            initialMeta={meta}
            onChange={handleMetaChange}
            boards={boards}
          />

          {/* 구분선 */}
          <div className={styles.divider}></div>

          {/* 에디터 영역 */}
          <div className={styles.editorContent}>
            <EditorContent editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
}
