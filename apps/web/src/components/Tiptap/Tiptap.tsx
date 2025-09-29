"use client";

import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Typography from "@tiptap/extension-typography";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Markdown } from "tiptap-markdown";
import styles from "./Tiptap.module.scss";

// lowlight 인스턴스 생성 (일반적인 언어들 포함)
const lowlight = createLowlight(common);

interface TiptapProps {
  content: string;
  mode: "editor" | "viewer";
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Tiptap({
  content,
  mode,
  onChange,
  placeholder = "내용을 입력하세요...",
  className = "",
}: TiptapProps) {
  const handleUpdate = useCallback(
    ({ editor }: { editor: any }) => {
      if (onChange && mode === "editor") {
        const markdown = editor.storage.markdown.getMarkdown();
        onChange(markdown);
      }
    },
    [onChange, mode]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        codeBlock: false, // 기본 CodeBlock 비활성화
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
        HTMLAttributes: {
          class: 'hljs',
        },
      }),
      Typography,
      Markdown.configure({
        html: false,
        tightLists: true,
        bulletListMarker: '-',
        linkify: false,
        breaks: false,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content,
    editable: mode === "editor",
    immediatelyRender: false,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: {
        class: `${styles.proseMirror} ${mode === "editor" ? styles.editable : ""}`,
        ...(mode === "editor" && placeholder ? { "data-placeholder": placeholder } : {}),
      },
    },
  }, [mode, placeholder]); // content와 handleUpdate를 의존성에서 제거

  // 외부 content가 변경될 때만 에디터 내용 업데이트 (뷰어 모드에서만)
  React.useEffect(() => {
    if (editor && mode === "viewer") {
      editor.commands.setContent(content);
    }
  }, [content, editor, mode]);

  // 에디터 모드일 때 툴바 렌더링
  const renderToolbar = () => {
    if (mode !== "editor" || !editor) return null;

    return (
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? styles.active : ""}
            title="굵게"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? styles.active : ""}
            title="기울임"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? styles.active : ""}
            title="취소선"
          >
            <s>S</s>
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive("heading", { level: 1 }) ? styles.active : ""}
            title="제목 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive("heading", { level: 2 }) ? styles.active : ""}
            title="제목 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive("heading", { level: 3 }) ? styles.active : ""}
            title="제목 3"
          >
            H3
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? styles.active : ""}
            title="불릿 리스트"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? styles.active : ""}
            title="번호 리스트"
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? styles.active : ""}
            title="인용문"
          >
            "
          </button>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive("code") ? styles.active : ""}
            title="인라인 코드"
          >
            &lt;/&gt;
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive("codeBlock") ? styles.active : ""}
            title="코드 블록"
          >
            { }
          </button>
          <select
            onChange={(e) => {
              if (e.target.value === '') {
                editor.chain().focus().toggleCodeBlock().run();
              } else {
                editor.chain().focus().toggleCodeBlock({ language: e.target.value }).run();
              }
            }}
            value={editor.isActive("codeBlock") ? editor.getAttributes("codeBlock").language || "" : ""}
            className={styles.languageSelect}
            title="코드 언어 선택"
          >
            <option value="">언어 선택</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="php">PHP</option>
            <option value="ruby">Ruby</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="scss">SCSS</option>
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="yaml">YAML</option>
            <option value="markdown">Markdown</option>
            <option value="bash">Bash</option>
            <option value="sql">SQL</option>
            <option value="plaintext">Plain Text</option>
          </select>
        </div>

        <div className={styles.toolbarGroup}>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="구분선"
          >
            ―
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="실행 취소"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="다시 실행"
          >
            ↷
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.tiptap} ${styles[mode]} ${className}`}>
      {renderToolbar()}
      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
