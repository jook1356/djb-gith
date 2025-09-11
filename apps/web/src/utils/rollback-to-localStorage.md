# LocalStorage로 돌아가는 방법

## 1. localStorage.ts 파일 다시 생성
```typescript
const TOKEN_KEY = "auth_token";

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string | null): void => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const removeToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
};
```

## 2. Import 변경
- `src/api/instance.ts`: `@/utils/cookie` → `@/utils/localStorage`
- `src/hooks/useAuth.ts`: `@/utils/cookie` → `@/utils/localStorage`
