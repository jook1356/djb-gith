"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Frame from "@/components/Frame/Frame";
import PostEditor from "@/components/Content/PostEditor";
import styles from "./page.module.scss";

export default function WritePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (content: string) => {
    setIsSaving(true);
    try {
      // TODO: 실제 저장 로직 구현
      console.log("저장할 콘텐츠:", content);
      
      // 임시로 로컬스토리지에 저장
      const timestamp = new Date().toISOString();
      const postId = `draft_${Date.now()}`;
      const draftPost = {
        id: postId,
        content,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      
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
    <Frame>
      <div className={styles.writePage}>
        <main className={styles.main}>
          <div className={styles.editorContainer}>
            <PostEditor
              initialContent={initialContent}
              onSave={handleSave}
              onCancel={handleCancel}
              className={styles.editor}
            />
          </div>
        </main>
      </div>
    </Frame>
  );
}
