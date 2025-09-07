# GitHub OAuth 설정 가이드

## 1. GitHub OAuth App 생성

1. GitHub에 로그인 후 Settings > Developer settings > OAuth Apps로 이동
2. "New OAuth App" 클릭
3. 다음 정보 입력:
   - **Application name**: My Blog
   - **Homepage URL**: `http://localhost:3000` (개발용) 또는 실제 도메인
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`

## 2. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# GitHub OAuth 설정
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# 허용된 GitHub 사용자 (쉼표로 구분)
ALLOWED_GITHUB_USERS=your_github_username,another_username
```

### 값 설정 방법:

1. **GITHUB_CLIENT_ID**: GitHub OAuth App에서 생성된 Client ID
2. **GITHUB_CLIENT_SECRET**: GitHub OAuth App에서 생성된 Client Secret
3. **NEXTAUTH_SECRET**: 랜덤 문자열 (32자 이상 권장)
   ```bash
   # 생성 방법
   openssl rand -base64 32
   ```
4. **ALLOWED_GITHUB_USERS**: 로그인을 허용할 GitHub 사용자명들

## 3. 패키지 설치

```bash
pnpm install
```

## 4. 개발 서버 실행

```bash
pnpm dev
```

## 5. 배포 시 설정

### GitHub Pages 배포 시:
- `NEXTAUTH_URL`을 실제 도메인으로 변경
- GitHub OAuth App의 callback URL도 실제 도메인으로 업데이트

### Vercel 배포 시:
- Vercel 대시보드에서 환경 변수 설정
- 자동으로 HTTPS 적용됨

## 6. 보안 고려사항

1. **환경 변수 보안**:
   - `.env.local`은 절대 Git에 커밋하지 마세요
   - 프로덕션에서는 안전한 환경 변수 관리 도구 사용

2. **허용된 사용자 관리**:
   - `ALLOWED_GITHUB_USERS`에 신뢰할 수 있는 사용자만 추가
   - 정기적으로 사용자 목록 검토

3. **NEXTAUTH_SECRET**:
   - 강력한 랜덤 문자열 사용
   - 프로덕션과 개발 환경에서 다른 값 사용

## 7. 문제 해결

### 로그인 실패 시:
1. GitHub OAuth App 설정 확인
2. 환경 변수 값 확인
3. 허용된 사용자 목록에 포함되어 있는지 확인

### 개발 중 세션 문제:
```bash
# 브라우저 쿠키 삭제 후 다시 시도
# 또는 시크릿 모드에서 테스트
```

## 8. 추가 기능

### 사용자 권한 세분화:
`src/lib/auth.ts`에서 `signIn` 콜백을 수정하여 더 세밀한 권한 제어 가능

### 세션 만료 시간 설정:
```typescript
// src/lib/auth.ts
session: {
  strategy: 'jwt',
  maxAge: 30 * 24 * 60 * 60, // 30일
},
```
