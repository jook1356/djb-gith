# 간단한 권한 관리 시스템 가이드

## 🎯 핵심 개념

권한은 **문자열**입니다. 원하는 이름을 자유롭게 정의할 수 있습니다.
- `'admin'`, `'writer'`, `'editor'`, `'vip'` 등 원하는 대로!

## ⚙️ 설정 방법

### 1. 환경 변수 설정

`.env.local` 파일:

```bash
# 형식: "username1:perm1,perm2;username2:perm3"
NEXT_PUBLIC_ALLOWED_USERS="octocat:admin,writer;user2:writer;user3:vip"
```

### 2. 코드에서 설정 (개발용)

`src/types/permissions.ts`:

```typescript
export const DEFAULT_PERMISSION_CONFIG: PermissionConfig = {
  allowedUsers: {
    'octocat': ['admin', 'writer'],
    'user2': ['writer'],
    'user3': ['vip'],
  },
};
```

## 📝 사용 방법

### 컴포넌트에서 권한 체크

```tsx
import { PermissionGuard } from '@/components/Auth/PermissionGuard';

// 'writer' 또는 'admin' 권한이 있으면 표시
<PermissionGuard requires={['writer', 'admin']}>
  <button>글쓰기</button>
</PermissionGuard>

// 'vip' 권한이 있으면 표시
<PermissionGuard requires={['vip']}>
  <span>VIP 전용</span>
</PermissionGuard>

// 로그인만 되어있으면 표시 (권한 체크 안함)
<PermissionGuard requires={[]}>
  <span>로그인한 사용자만 보임</span>
</PermissionGuard>
```

### 페이지 보호

```tsx
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';

export default function WritePage() {
  return (
    <ProtectedRoute requires={['writer', 'admin']}>
      <YourPageContent />
    </ProtectedRoute>
  );
}
```

### 훅으로 권한 체크

```tsx
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { permissions, hasAnyPermission } = usePermissions();
  
  // 현재 사용자의 모든 권한 확인
  console.log(permissions); // ['admin', 'writer']
  
  // 특정 권한 체크
  if (hasAnyPermission(['writer', 'admin'])) {
    // 글쓰기 가능
  }
  
  return <div>...</div>;
}
```

## 🔒 동작 원리

1. **로그인 확인**: GitHub 인증으로 사용자 확인
2. **권한 확인**: 환경 변수에서 해당 사용자의 권한 목록 조회
3. **접근 허용**: `requires` 배열의 권한 중 **하나라도** 있으면 허용

## 📌 실제 예시

### 예시 1: 글쓰기 권한

**설정:**
```bash
NEXT_PUBLIC_ALLOWED_USERS="jook1:writer,admin;friend:writer"
```

**사용:**
```tsx
// writer 또는 admin 권한이 있으면 버튼 표시
<PermissionGuard requires={['writer', 'admin']}>
  <Button>글쓰기</Button>
</PermissionGuard>
```

**결과:**
- `jook1`: ✅ 표시됨 (writer, admin 둘 다 있음)
- `friend`: ✅ 표시됨 (writer 있음)
- `stranger`: ❌ 표시 안됨 (권한 없음)

### 예시 2: 관리자 전용

**설정:**
```bash
NEXT_PUBLIC_ALLOWED_USERS="jook1:admin;friend:writer"
```

**사용:**
```tsx
<PermissionGuard requires={['admin']}>
  <AdminPanel />
</PermissionGuard>
```

**결과:**
- `jook1`: ✅ 표시됨
- `friend`: ❌ 표시 안됨

### 예시 3: 여러 권한 조합

**설정:**
```bash
NEXT_PUBLIC_ALLOWED_USERS="jook1:admin;friend:vip;user3:writer"
```

**사용:**
```tsx
// VIP 또는 admin이면 특별 기능 표시
<PermissionGuard requires={['vip', 'admin']}>
  <SpecialFeature />
</PermissionGuard>
```

**결과:**
- `jook1`: ✅ 표시됨 (admin)
- `friend`: ✅ 표시됨 (vip)
- `user3`: ❌ 표시 안됨 (writer만 있음)

## 💡 팁

1. **권한 이름은 자유롭게**: 프로젝트에 맞게 정의
2. **여러 권한 부여 가능**: 쉼표로 구분해서 여러 개 부여
3. **빈 배열은 로그인만 체크**: `requires={[]}`는 로그인만 확인
4. **하나라도 있으면 허용**: OR 조건으로 동작

## 🚀 빠른 시작

1. `.env.local` 생성:
```bash
NEXT_PUBLIC_ALLOWED_USERS="your-github-username:admin,writer"
```

2. 글쓰기 버튼에 적용:
```tsx
<PermissionGuard requires={['writer', 'admin']}>
  <Button>글쓰기</Button>
</PermissionGuard>
```

3. 완료! 🎉

