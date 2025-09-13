# API 모듈 사용 가이드

이 모듈은 GitHub OAuth 인증을 활용하는 Axios 기반의 API 클라이언트입니다.

## 주요 기능

- 🔐 **GitHub OAuth 인증**: httpOnly 쿠키를 통한 자동 인증
- 🔒 **보안**: 쿠키는 서버에서만 접근 가능 (httpOnly)
- 📤 **FormData 지원**: 파일 업로드를 위한 FormData 전용 인스턴스
- 🛠 **간편한 API**: 직관적인 헬퍼 함수들 제공
- ⚡ **Cloudflare Workers**: 백엔드와 seamless 통합

## 사용 방법

### 1. 기본 사용법

```typescript
import { apiHelpers } from "@/api";

// GET 요청 (GitHub OAuth 인증 필요)
const response = await apiHelpers.get("/blog/posts");

// POST 요청 (GitHub OAuth 인증 필요)
const result = await apiHelpers.post("/blog/posts", {
  title: "새 포스트",
  content: "포스트 내용",
});

// 인증이 필요 없는 GET 요청
const publicData = await apiHelpers.getPublic("/blog/posts/public");
```

### 2. 인스턴스 직접 사용

```typescript
import { authInstance, defaultInstance } from "@/api";

// GitHub OAuth 인증이 필요한 요청
const userResponse = await authInstance.get("/auth/user");

// 인증이 필요 없는 요청
const postsResponse = await defaultInstance.get("/blog/posts/public");
```

### 3. FormData 업로드

```typescript
import { api } from "@/api";

// 파일 업로드 (GitHub OAuth 인증 필요)
const formData = new FormData();
formData.append("file", file);
formData.append("description", "블로그 이미지");

const uploadResponse = await api.formDataAuth("/blog/upload", formData);

// 파일 업로드 (인증 불필요)
const publicUpload = await api.formData("/blog/upload/public", formData);
```

### 4. 쿠키 유틸리티 사용

```typescript
import { getCookie, setCookie, removeCookie } from "@/api";

// 주의: GitHub OAuth 쿠키는 httpOnly로 설정되어 JavaScript에서 접근할 수 없습니다.
// 이 함수들은 다른 클라이언트 사이드 쿠키 관리용입니다.

// 테마 설정 저장
setCookie("theme", "dark", 30); // 30일간 유효

// 테마 설정 가져오기
const theme = getCookie("theme");

// 설정 삭제
removeCookie("theme");
```

### 5. 인증 상태 확인

```typescript
import { useAuthContext } from "@/components/Auth/AuthProvider";

function MyComponent() {
  const { user, loading, login, logout } = useAuthContext();

  if (loading) return <div>Loading...</div>;

  if (user) {
    // 인증된 사용자
    return (
      <div>
        <p>안녕하세요, {user.login}님!</p>
        <button onClick={logout}>로그아웃</button>
      </div>
    );
  }

  // 인증되지 않은 사용자
  return <button onClick={login}>GitHub으로 로그인</button>;
}
```

### 6. 타입 지원

```typescript
interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: {
    login: string;
    avatar_url: string;
  };
  created_at: string;
}

// 타입 안전한 API 호출
const posts = await apiHelpers.get<BlogPost[]>("/blog/posts");
console.log(posts.data[0].title); // 타입 안전
```

## 설정

### 환경 변수 설정

`.env.local` 파일에 다음 환경 변수를 추가하세요:

```env
# Cloudflare Workers URL (배포 시 필요)
NEXT_PUBLIC_AUTH_WORKER_URL=https://your-worker.your-subdomain.workers.dev

# GitHub Pages 배포 시 base path (필요한 경우만)
NEXT_PUBLIC_BASE_PATH=/your-repo-name
```

### 자동 인증 처리

GitHub OAuth 인증은 `useAuth` Hook과 `AuthProvider`를 통해 자동으로 관리됩니다:

1. **로그인**: `login()` 함수 호출
2. **로그아웃**: `logout()` 함수 호출
3. **인증 상태**: `user` 객체로 확인
4. **자동 갱신**: 페이지 로드 시 자동으로 인증 상태 확인

## 인스턴스별 특징

| 인스턴스               | 용도                            | GitHub OAuth 인증 | Content-Type        |
| ---------------------- | ------------------------------- | ----------------- | ------------------- |
| `defaultInstance`      | 일반 요청 (인증 불필요)         | ❌                | application/json    |
| `authInstance`         | 일반 요청 (GitHub OAuth 필요)   | ✅                | application/json    |
| `formDataInstance`     | 파일 업로드 (인증 불필요)       | ❌                | multipart/form-data |
| `formDataAuthInstance` | 파일 업로드 (GitHub OAuth 필요) | ✅                | multipart/form-data |
| `tokenInstance` \*     | `authInstance`의 alias          | ✅                | application/json    |

_\* 호환성을 위해 제공되는 alias입니다._

## 에러 처리

GitHub OAuth 시스템에서의 에러 처리:

- **401 에러**: `useAuth`의 `checkAuth()`가 자동으로 사용자 상태 업데이트
- **403 에러**: 권한 부족 (인증은 되었으나 해당 리소스에 접근 권한 없음)
- **기타 에러**: 원본 에러 객체 반환

```typescript
try {
  const response = await apiHelpers.get("/blog/private-post");
} catch (error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // 인증이 필요함 - useAuth가 자동 처리
      console.log("로그인이 필요합니다");
    } else if (error.response?.status === 403) {
      // 권한 부족
      console.log("접근 권한이 없습니다");
    }
  }
}
```

## 팁

1. **컴포넌트에서 사용**: `apiHelpers`를 사용하면 가장 간편합니다.
2. **인증 상태 확인**: `useAuthContext()`로 현재 로그인 상태를 확인하세요.
3. **파일 업로드**: FormData 전용 인스턴스를 사용하세요.
4. **자동 인증**: httpOnly 쿠키로 자동 처리되므로 토큰 관리가 불필요합니다.
5. **환경별 설정**: 개발/배포 환경에 따라 자동으로 baseURL이 설정됩니다.

## 시스템 구조

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App   │────│  API 모듈 (axios) │────│ Cloudflare      │
│                 │    │                  │    │ Workers         │
│ - useAuth Hook  │    │ - authInstance   │    │                 │
│ - AuthProvider  │    │ - apiHelpers     │    │ - GitHub OAuth  │
│ - Components    │    │ - FormData       │    │ - httpOnly 쿠키  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```
