"use client";

import React, { useState, useCallback } from "react";
import { Tiptap } from "@/components/Tiptap";
import styles from "./PostEditor.module.scss";

interface PostEditorProps {
  initialContent?: string;
  onSave?: (content: string) => void;
  onCancel?: () => void;
  className?: string;
}

export default function PostEditor({
  initialContent = "",
  onSave,
  onCancel,
  className = "",
}: PostEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = useCallback(() => {
    if (onSave) {
      // content는 이미 마크다운 형식으로 관리됨
      onSave(content);
    }
  }, [onSave, content]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  return (
    <div className={`${styles.postEditor} ${className}`}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button
            type="button"
            className={!previewMode ? styles.active : ""}
            onClick={() => setPreviewMode(false)}
          >
            편집
          </button>
          <button
            type="button"
            className={previewMode ? styles.active : ""}
            onClick={() => setPreviewMode(true)}
          >
            미리보기
          </button>
        </div>

        <div className={styles.actions}>
          {onCancel && (
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              취소
            </button>
          )}
          {onSave && (
            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSave}
            >
              저장
            </button>
          )}
        </div>
      </div>

      <div className={styles.editorContainer}>
        <Tiptap
          content={content}
          mode={previewMode ? "viewer" : "editor"}
          onChange={handleContentChange}
          placeholder="마크다운으로 글을 작성해보세요..."
          className={styles.editor}
        />
      </div>
    </div>
  );
}
