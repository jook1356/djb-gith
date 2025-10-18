'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown } from '@/components/Dropdown';
import type { DropdownOption } from '@/components/Dropdown';
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

  // 게시판 옵션
  const boardOptions: DropdownOption[] = boards.map(board => ({
    value: board.name,
    label: board.displayName,
    description: board.description,
    icon: (
      <div 
        style={{ 
          width: '1rem', 
          height: '1rem', 
          borderRadius: '0.25rem',
          backgroundColor: board.color 
        }} 
      />
    ),
  }));

  return (
    <div className={styles.metaEditor}>
      <div className={styles.metaForm}>
        {/* 제목 & 게시판 */}
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="post-title" className={styles.label}>
              제목 <span className={styles.required}>*</span>
            </label>
            <input
              id="post-title"
              type="text"
              className={styles.input}
              placeholder="게시글 제목"
              value={meta.title}
              onChange={(e) => updateMeta('title', e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <Dropdown
              options={boardOptions}
              value={meta.board}
              onChange={(value) => updateMeta('board', value)}
              placeholder="게시판 선택"
              label="게시판"
              required
              searchable
              clearable
              size="small"
            />
          </div>
        </div>

        {/* 설명 */}
        <div className={styles.formGroup}>
          <label htmlFor="post-description" className={styles.label}>
            설명 <span className={styles.required}>*</span>
          </label>
          <textarea
            id="post-description"
            className={styles.textarea}
            placeholder="게시글 설명 (SEO에 사용됩니다)"
            value={meta.description}
            onChange={(e) => updateMeta('description', e.target.value)}
            rows={2}
            required
          />
        </div>

        {/* 태그 */}
        <div className={styles.formGroup}>
          <label htmlFor="post-tags" className={styles.label}>
            태그
          </label>
          <div className={styles.tagInput}>
            <input
              id="post-tags"
              type="text"
              className={styles.input}
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
            <button
              type="button"
              className={styles.addButton}
              onClick={addTag}
              disabled={!tagInput.trim()}
            >
              추가
            </button>
          </div>
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
  );
}

