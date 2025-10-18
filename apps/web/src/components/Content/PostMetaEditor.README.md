# 📝 PostMetaEditor 컴포넌트

게시글 작성 시 필요한 메타데이터를 설정하는 컴포넌트입니다. 제목, 설명, 게시판 선택, 태그, 카테고리 등의 정보를 입력하고 관리할 수 있습니다.

## ✨ 주요 기능

- 📋 **필수 정보 입력**: 제목, 설명, 게시판 선택
- 🏷️ **태그 관리**: 다중 태그 추가 및 제거
- 📁 **카테고리 관리**: 카테고리 설정
- 🎯 **난이도 선택**: 초급/중급/고급/전문가
- 🌐 **언어 선택**: 다국어 지원
- 🖼️ **썸네일 URL**: 미리보기 이미지 설정
- 🔄 **실시간 미리보기**: 입력한 내용을 즉시 확인
- 🎚️ **토글 옵션**: 게시 상태, 추천 게시글 설정
- 🎨 **드롭다운 통합**: 새로 만든 Dropdown 컴포넌트 사용

## 📦 사용 예제

### 기본 사용법

```tsx
import PostMetaEditor from '@/components/Content/PostMetaEditor';
import { useBoards } from '@/hooks/useBoards';
import type { PostMeta } from '@/types/contents';

function WritePage() {
  const [postMeta, setPostMeta] = useState<Partial<PostMeta>>({});
  const { data: boards = [] } = useBoards();

  return (
    <PostMetaEditor
      initialMeta={postMeta}
      onChange={setPostMeta}
      boards={boards}
    />
  );
}
```

### 초기값 설정

```tsx
const initialMeta: Partial<PostMeta> = {
  title: '기존 게시글 제목',
  description: '기존 설명',
  board: 'frontend',
  tags: ['React', 'TypeScript'],
  categories: ['Tutorial'],
  difficulty: 'intermediate',
  language: 'ko',
  published: true,
  featured: false,
};

<PostMetaEditor
  initialMeta={initialMeta}
  onChange={handleMetaChange}
  boards={boards}
/>
```

### 메타데이터 검증 후 저장

```tsx
function handleSave() {
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

  // 저장 로직
  savePost({
    meta: postMeta,
    content: editorContent,
  });
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialMeta` | `Partial<PostMeta>` | `undefined` | 초기 메타데이터 값 |
| `onChange` | `(meta: Partial<PostMeta>) => void` | `undefined` | 메타데이터 변경 시 호출되는 콜백 |
| `boards` | `Array<BoardInfo>` | `[]` | 게시판 목록 |

## 🎯 PostMeta 인터페이스

```typescript
interface PostMeta {
  id: string;                  // 게시글 ID
  title: string;               // 제목 (필수)
  slug: string;                // URL 슬러그
  description: string;         // 설명 (필수)
  author: string;              // 작성자
  board: string;               // 게시판 (필수)
  createdAt: string;           // 생성 일시
  updatedAt: string;           // 수정 일시
  published: boolean;          // 게시 상태
  tags: string[];              // 태그 배열
  categories: string[];        // 카테고리 배열
  language: string;            // 언어 코드
  thumbnail?: string;          // 썸네일 URL (선택)
  readTime?: number;           // 예상 읽기 시간 (선택)
  featured?: boolean;          // 추천 게시글 여부 (선택)
  difficulty?: string;         // 난이도 (선택)
}
```

## 🎨 주요 섹션

### 1. 기본 정보

- **제목**: 게시글의 제목 (필수)
- **설명**: 게시글에 대한 간단한 설명, SEO에 사용됨 (필수)

### 2. 분류

- **게시판**: 드롭다운으로 게시판 선택 (필수, 검색 가능)
- **언어**: 게시글 언어 선택 (한국어/영어/일본어/중국어)

### 3. 난이도

- 🌱 초급 - 입문자를 위한 내용
- 🌿 중급 - 기본을 이해한 사람을 위한 내용
- 🌳 고급 - 심화 내용
- 🏆 전문가 - 전문가를 위한 고급 내용

### 4. 태그 & 카테고리

- **태그**: 여러 개 추가 가능, Enter 키로 추가
- **카테고리**: 게시글을 그룹화하기 위한 카테고리

### 5. 썸네일

- 게시글 미리보기에 표시될 이미지 URL 입력

### 6. 토글 옵션

- **게시 상태**: 공개/비공개 설정
- **추천 게시글**: 메인 페이지 강조 표시 여부

### 7. 실시간 미리보기

- 입력한 정보가 어떻게 표시되는지 실시간으로 확인

## 🎮 사용자 인터랙션

### 태그 추가
1. 태그 입력 필드에 태그 입력
2. Enter 키를 누르거나 "추가" 버튼 클릭
3. 추가된 태그는 칩 형태로 표시
4. X 버튼으로 태그 제거 가능

### 카테고리 추가
1. 카테고리 입력 필드에 카테고리 입력
2. Enter 키를 누르거나 "추가" 버튼 클릭
3. 보라색 칩으로 표시됨
4. X 버튼으로 카테고리 제거 가능

### 게시판 선택
1. 드롭다운 클릭
2. 검색 기능으로 게시판 찾기 가능
3. 게시판 선택 시 색상 아이콘과 함께 표시

## 🎨 스타일링

### CSS 변수 사용
```scss
--color-surface              // 배경색
--color-surface-secondary    // 보조 배경색
--color-text-primary         // 주 텍스트 색상
--color-text-secondary       // 보조 텍스트 색상
--color-text-tertiary        // 힌트 텍스트 색상
--color-border               // 테두리 색상
--color-primary              // 프라이머리 색상
--color-primary-light        // 프라이머리 밝은 색상
```

### 반응형 디자인
- 데스크톱: 2열 레이아웃 (메타 + 에디터)
- 태블릿 (< 968px): 1열 레이아웃
- 모바일 (< 640px): 모바일 최적화 UI

## 💡 실전 활용 팁

### 1. 자동 저장과 함께 사용
```tsx
// 자동 저장 기능
useEffect(() => {
  const autoSave = setTimeout(() => {
    localStorage.setItem('draft-meta', JSON.stringify(postMeta));
  }, 1000);

  return () => clearTimeout(autoSave);
}, [postMeta]);
```

### 2. 검증 함수 만들기
```tsx
function validateMeta(meta: Partial<PostMeta>): string[] {
  const errors: string[] = [];
  
  if (!meta.title?.trim()) {
    errors.push('제목을 입력해주세요');
  }
  if (!meta.description?.trim()) {
    errors.push('설명을 입력해주세요');
  }
  if (!meta.board) {
    errors.push('게시판을 선택해주세요');
  }
  if (meta.tags && meta.tags.length > 10) {
    errors.push('태그는 최대 10개까지 가능합니다');
  }
  
  return errors;
}
```

### 3. 슬러그 자동 생성
```tsx
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}
```

## 🔧 커스터마이징

### 난이도 옵션 변경
컴포넌트 내부의 `difficultyOptions` 배열을 수정하여 난이도 옵션을 커스터마이징할 수 있습니다.

### 언어 옵션 추가
`languageOptions` 배열에 새로운 언어를 추가할 수 있습니다.

### 미리보기 레이아웃 변경
`PostMetaEditor.module.scss`의 `.preview` 관련 스타일을 수정하여 미리보기 디자인을 변경할 수 있습니다.

## 📱 접근성

- 모든 입력 필드에 적절한 라벨 제공
- 키보드로 모든 기능 접근 가능
- 필수 필드 명확히 표시 (*)
- 에러 메시지 명확히 전달

## 🐛 알려진 이슈

현재 알려진 이슈가 없습니다.

## 📝 향후 개선 사항

- [ ] 이미지 업로드 기능 추가
- [ ] 태그 자동완성 기능
- [ ] 카테고리 트리 구조 지원
- [ ] 예상 읽기 시간 자동 계산
- [ ] 메타데이터 템플릿 저장/불러오기

---

Made with ❤️

