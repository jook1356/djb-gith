# 권한 관리 시스템 가이드

이 문서는 블로그의 권한 관리 시스템 사용법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [권한 설정](#권한-설정)
3. [권한 타입](#권한-타입)
4. [사용 방법](#사용-방법)
5. [예제](#예제)

---

## 개요

권한 관리 시스템은 특정 GitHub 사용자에게만 글쓰기, 수정, 삭제 등의 작업을 허용하는 기능을 제공합니다.

### 주요 기능

- ✅ GitHub 사용자 이름 기반 권한 관리
- ✅ 컴포넌트 레벨 권한 체크 (버튼 표시/숨김)
- ✅ 페이지 레벨 권한 보호 (URL 직접 접근 차단)
- ✅ 환경 변수를 통한 안전한 설정 관리
- ✅ 역할 기반 권한 시스템 (Admin, Editor, Viewer)

---

## 권한 설정

### 1. 환경 변수 설정

프로젝트 루트의 `.env.local` 파일에 다음 환경 변수를 추가하세요:

```bash
# 허용된 사용자 설정
# 형식: "username1:permission1,permission2;username2:permission3"
NEXT_PUBLIC_ALLOWED_USERS="your-github-username:write:post,edit:post,delete:post;another-user:write:post"
```

### 2. 코드로 직접 설정 (권장하지 않음)

개발 환경에서 테스트하려면 `src/types/permissions.ts` 파일을 수정할 수 있습니다:

```typescript
export const DEFAULT_PERMISSION_CONFIG: PermissionConfig = {
  allowedUsers: {
    'your-github-username': ['write:post', 'edit:post', 'delete:post'],
    'another-user': ['write:post'],
  },
  
  roles: {
    admin: ['write:post', 'edit:post', 'delete:post', 'manage:board'],
    editor: ['write:post', 'edit:post'],
    viewer: [],
  },
};
```

⚠️ **주의**: 프로덕션 환경에서는 반드시 환경 변수를 사용하세요!

---

## 권한 타입

### Permission Types

| Permission | 설명 | 용도 |
|-----------|------|------|
| `write:post` | 게시글 작성 권한 | 새 게시글 작성, 글쓰기 버튼 표시 |
| `edit:post` | 게시글 수정 권한 | 기존 게시글 편집 |
| `delete:post` | 게시글 삭제 권한 | 게시글 삭제 |
| `manage:board` | 게시판 관리 권한 | 게시판 설정 변경 |

### Role Types

| Role | 권한 | 설명 |
|------|------|------|
| `admin` | 모든 권한 | 전체 관리자 |
| `editor` | write:post, edit:post | 콘텐츠 편집자 |
| `viewer` | 없음 | 일반 사용자 |

---

## 사용 방법

### 1. 컴포넌트 레벨 권한 체크

특정 권한이 있는 사용자에게만 컴포넌트를 표시:

```tsx
import { PermissionGuard } from '@/components/Auth/PermissionGuard';

function MyComponent() {
  return (
    <div>
      {/* write:post 권한이 있는 사용자만 버튼 표시 */}
      <PermissionGuard permission="write:post">
        <button>글쓰기</button>
      </PermissionGuard>
    </div>
  );
}
```

#### 여러 권한 중 하나만 있어도 표시

```tsx
<PermissionGuard anyPermissions={['write:post', 'edit:post']}>
  <button>작성 또는 수정</button>
</PermissionGuard>
```

#### 모든 권한이 있어야 표시

```tsx
<PermissionGuard allPermissions={['write:post', 'manage:board']}>
  <button>관리자 전용</button>
</PermissionGuard>
```

#### 권한이 없을 때 대체 컴포넌트 표시

```tsx
<PermissionGuard 
  permission="write:post"
  fallback={<p>권한이 없습니다</p>}
>
  <button>글쓰기</button>
</PermissionGuard>
```

### 2. 페이지 레벨 권한 보호

URL로 직접 접근 시 권한 체크:

```tsx
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function WritePage() {
  return (
    <ProtectedRoute 
      permission="write:post"
      loginRedirectTo="/contents"
    >
      <div>
        {/* 페이지 내용 */}
      </div>
    </ProtectedRoute>
  );
}
```

#### 옵션

- `permission`: 단일 권한 체크
- `anyPermissions`: 여러 권한 중 하나
- `allPermissions`: 모든 권한 필요
- `redirectTo`: 권한 없을 때 리다이렉트 경로 (없으면 에러 페이지 표시)
- `loginRedirectTo`: 로그인 안 되어있을 때 리다이렉트 경로 (기본: `/`)
- `deniedMessage`: 커스텀 에러 메시지

### 3. 훅 사용

컴포넌트 로직에서 권한 체크:

```tsx
import { usePermissions, useHasPermission } from '@/hooks/usePermissions';

function MyComponent() {
  const { permissions, role, isAllowed } = usePermissions();
  
  // 특정 권한 체크
  if (isAllowed('write:post')) {
    // 글쓰기 가능
  }
  
  // 사용자 역할 확인
  console.log('User role:', role); // 'admin', 'editor', or 'viewer'
  
  return <div>...</div>;
}
```

#### 단순 권한 체크 훅

```tsx
import { useHasPermission } from '@/hooks/usePermissions';

function WriteButton() {
  const { hasPermission, loading } = useHasPermission('write:post');
  
  if (loading) return <div>로딩 중...</div>;
  if (!hasPermission) return null;
  
  return <button>글쓰기</button>;
}
```

---

## 예제

### 예제 1: 글쓰기 버튼 (현재 구현)

```tsx
import { PermissionGuard } from '@/components/Auth/PermissionGuard';
import { Button } from '@/components/Button/Button';
import Link from 'next/link';

function ContentHome() {
  return (
    <div>
      <h1>게시판</h1>
      
      {/* write:post 권한이 있는 사용자만 버튼 표시 */}
      <PermissionGuard permission="write:post">
        <Link href="/write">
          <Button theme="text" size="medium">
            글쓰기
          </Button>
        </Link>
      </PermissionGuard>
    </div>
  );
}
```

### 예제 2: 글쓰기 페이지 보호 (현재 구현)

```tsx
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function WritePage() {
  return (
    <ProtectedRoute 
      permission="write:post"
      loginRedirectTo="/contents"
    >
      <PostEditor />
    </ProtectedRoute>
  );
}
```

### 예제 3: 역할 기반 메뉴

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function AdminMenu() {
  const { role } = usePermissions();
  
  if (role !== 'admin') return null;
  
  return (
    <div>
      <h2>관리자 메뉴</h2>
      <button>사용자 관리</button>
      <button>게시판 설정</button>
    </div>
  );
}
```

### 예제 4: 조건부 렌더링

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function PostActions({ postId }: { postId: string }) {
  const { isAllowed } = usePermissions();
  
  return (
    <div>
      <button>공유</button>
      
      {isAllowed('edit:post') && (
        <button>수정</button>
      )}
      
      {isAllowed('delete:post') && (
        <button>삭제</button>
      )}
    </div>
  );
}
```

---

## 🔒 보안 고려사항

1. **환경 변수 사용**: 프로덕션에서는 항상 환경 변수로 권한 설정
2. **클라이언트 측 체크만으로는 불충분**: 서버 측에서도 반드시 권한 체크 필요
3. **민감한 정보 노출 방지**: 허용된 사용자 목록을 공개 저장소에 커밋하지 않기
4. **정기적인 권한 검토**: 더 이상 필요없는 권한은 제거

---

## 🚀 배포 설정

### Vercel

1. Vercel 대시보드 → 프로젝트 → Settings → Environment Variables
2. `NEXT_PUBLIC_ALLOWED_USERS` 추가
3. 값 입력: `username1:write:post,edit:post;username2:write:post`
4. 재배포

### GitHub Pages

GitHub Actions workflow 파일에 secrets 추가:

```yaml
env:
  NEXT_PUBLIC_ALLOWED_USERS: ${{ secrets.ALLOWED_USERS }}
```

---

## 📝 FAQ

### Q: 여러 사용자에게 권한을 주려면?

A: 세미콜론(`;`)으로 구분:
```
NEXT_PUBLIC_ALLOWED_USERS="user1:write:post;user2:write:post;user3:write:post,edit:post"
```

### Q: 권한이 작동하지 않아요

A: 다음을 확인하세요:
1. 환경 변수가 올바르게 설정되었는지
2. GitHub 로그인이 되어있는지
3. 사용자 이름(login)이 정확한지
4. 페이지를 새로고침했는지

### Q: 권한 없이 URL로 접근하면?

A: `ProtectedRoute`를 사용하면 자동으로 에러 페이지 또는 리다이렉트됩니다.

### Q: 커스텀 권한 추가하려면?

A: `src/types/permissions.ts`에서 `Permission` 타입에 추가하세요:
```typescript
export type Permission = 
  | 'write:post'
  | 'edit:post'
  | 'delete:post'
  | 'manage:board'
  | 'your:custom:permission';  // 추가
```

---

## 🛠️ 파일 구조

```
apps/web/src/
├── types/
│   └── permissions.ts          # 권한 타입 및 설정
├── lib/
│   └── permissions.ts          # 권한 체크 유틸리티
├── hooks/
│   └── usePermissions.ts       # 권한 체크 훅
└── components/
    └── Auth/
        ├── PermissionGuard.tsx # 컴포넌트 가드
        └── ProtectedRoute.tsx  # 페이지 가드
```

---

## 📚 더 알아보기

- [GitHub OAuth 인증](./AUTH_GUIDE.md)
- [컴포넌트 가이드](./COMPONENTS_GUIDE.md)

