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
    <Tiptap
    content={content}
    readonly={previewMode}
    onChange={handleContentChange}
    placeholder="마크다운으로 글을 작성해보세요..."
  />
  );
}
