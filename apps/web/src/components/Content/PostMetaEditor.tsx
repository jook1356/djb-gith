'use client';

import React, { useState, useEffect } from 'react';
import type { PostMeta } from '@/types/contents';
import styles from './PostMetaEditor.module.scss';

interface PostMetaEditorProps {
  initialMeta?: Partial<PostMeta>;
  onChange?: (meta: Partial<PostMeta>) => void;
  boards?: Array<{ name: string; displayName: string; description: string; color: string }>;
}

export default function PostMetaEditor({ 
  initialMeta, 
  onChange,
  boards = []
}: PostMetaEditorProps) {
  const [meta, setMeta] = useState<Partial<PostMeta>>({
    title: '',
    description: '',
    board: '',
    tags: [],
    ...initialMeta,
  });

  const [tagInput, setTagInput] = useState('');

  // 메타데이터 변경 시 부모 컴포넌트에 알림
  useEffect(() => {
    onChange?.(meta);
  }, [meta, onChange]);

  // 필드 업데이트 헬퍼
  const updateMeta = (field: keyof PostMeta, value: any) => {
    setMeta(prev => ({ ...prev, [field]: value }));
  };

  // 태그 추가
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !meta.tags?.includes(trimmedTag)) {
      updateMeta('tags', [...(meta.tags || []), trimmedTag]);
      setTagInput('');
    }
  };

  // 태그 제거
  const removeTag = (tagToRemove: string) => {
    updateMeta('tags', meta.tags?.filter(tag => tag !== tagToRemove) || []);
  };

  return (
    <div className={styles.metaEditor}>
      {/* 제목 - 큰 입력란, border 없음 */}
      <input
        type="text"
        className={styles.titleInput}
        placeholder="제목"
        value={meta.title}
        onChange={(e) => updateMeta('title', e.target.value)}
      />

      {/* 기타 메타데이터 */}
      <div className={styles.metaFields}>
        {/* 게시판 선택 */}
        <div className={styles.metaField}>
          <select
            className={styles.selectInput}
            value={meta.board}
            onChange={(e) => updateMeta('board', e.target.value)}
          >
            <option value="">게시판 선택</option>
            {boards.map(board => (
              <option key={board.name} value={board.name}>
                {board.displayName}
              </option>
            ))}
          </select>
        </div>

        {/* 설명 */}
        <div className={styles.metaField}>
          <input
            type="text"
            className={styles.textInput}
            placeholder="게시글 설명 (SEO에 사용됩니다)"
            value={meta.description}
            onChange={(e) => updateMeta('description', e.target.value)}
          />
        </div>

        {/* 태그 입력 */}
        <div className={styles.metaField}>
          <div className={styles.tagInputWrapper}>
            <input
              type="text"
              className={styles.textInput}
              placeholder="태그 입력 후 Enter"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
            />
            {meta.tags && meta.tags.length > 0 && (
              <div className={styles.chips}>
                {meta.tags.map(tag => (
                  <div key={tag} className={styles.chip}>
                    <span className={styles.chipLabel}>#{tag}</span>
                    <button
                      type="button"
                      className={styles.chipRemove}
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

