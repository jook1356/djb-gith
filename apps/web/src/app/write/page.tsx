"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Frame from "@/components/Frame/Frame";
import PostEditor from "@/components/Content/PostEditor";
import PostMetaEditor from "@/components/Content/PostMetaEditor";
import { ProtectedRoute } from "@/components/Auth/ProtectedRoute";
import { useBoards } from "@/hooks/useBoards";
import type { PostMeta } from "@/types/contents";
import styles from "./page.module.scss";

export default function WritePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [postMeta, setPostMeta] = useState<Partial<PostMeta>>({});
  const { data: boards = [] } = useBoards();

  const handleSave = async (content: string) => {
    // 필수 필드 검증
    if (!postMeta.title?.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!postMeta.description?.trim()) {
      alert("설명을 입력해주세요.");
      return;
    }
    if (!postMeta.board) {
      alert("게시판을 선택해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // TODO: 실제 저장 로직 구현
      const timestamp = new Date().toISOString();
      const postId = `draft_${Date.now()}`;
      
      // 슬러그 생성 (제목을 URL 친화적으로 변환)
      const slug = postMeta.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const draftPost = {
        id: postId,
        meta: {
          ...postMeta,
          id: postId,
          slug,
          createdAt: timestamp,
          updatedAt: timestamp,
          author: "작성자", // TODO: 실제 인증된 사용자 정보 사용
        },
        content,
      };
      
      console.log("저장할 게시글:", draftPost);
      
      localStorage.setItem(`draft_${postId}`, JSON.stringify(draftPost));
      
      // 성공 메시지 표시 후 리다이렉트
      alert("글이 임시 저장되었습니다!");
      router.push("/contents");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (confirm("작성 중인 내용이 사라집니다. 정말 나가시겠습니까?")) {
      router.push("/contents");
    }
  };

  const initialContent = `# 제목을 입력하세요

> 간단한 설명을 입력하세요

## 내용

여기에 내용을 작성해주세요.

### 코드 예시

\`\`\`javascript
function example() {
  console.log("Hello, World!");
}
\`\`\`

### 리스트

- 첫 번째 항목
- 두 번째 항목
- 세 번째 항목

### 인용문

> 중요한 내용은 인용문으로 강조할 수 있습니다.

---

**굵은 텍스트**와 *기울임 텍스트*를 사용하여 강조할 수 있습니다.
`;

  return (
    <ProtectedRoute 
      requires={['writer', 'admin']}
      loginRedirectTo="/contents"
    >
      <Frame>
        <div className={styles.writePage}>
          <header className={styles.header}>
            <h1 className={styles.pageTitle}>새 게시글 작성</h1>
            <div className={styles.actions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleSave(initialContent)}
                disabled={isSaving}
                className={styles.saveButton}
              >
                {isSaving ? (
                  <>
                    <svg className={styles.spinner} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round"/>
                    </svg>
                    저장 중...
                  </>
                ) : (
                  '저장'
                )}
              </button>
            </div>
          </header>

          <main className={styles.main}>
            <div className={styles.contentGrid}>
              {/* 메타데이터 설정 영역 */}
              <div className={styles.metaSection}>
                <PostMetaEditor
                  initialMeta={postMeta}
                  onChange={setPostMeta}
                  boards={boards}
                />
              </div>

              {/* 에디터 영역 */}
              <div className={styles.editorSection}>
                <PostEditor
                  initialContent={initialContent}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  className={styles.editor}
                />
              </div>
            </div>
          </main>
        </div>
      </Frame>
    </ProtectedRoute>
  );
}
