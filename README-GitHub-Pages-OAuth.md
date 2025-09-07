# GitHub Pages용 OAuth 설정 가이드

## 🎯 GitHub Pages에서 OAuth 사용하기

GitHub Pages는 정적 호스팅만 지원하므로 서버 사이드 OAuth는 불가능합니다. 
하지만 **클라이언트 사이드 OAuth**를 통해 GitHub 인증을 구현할 수 있습니다!

## 1. GitHub OAuth App 생성

1. GitHub Settings > Developer settings > OAuth Apps
2. "New OAuth App" 클릭
3. 설정 정보:
   - **Application name**: My Blog
   - **Homepage URL**: `https://yourusername.github.io/my-blog-github-pages`
   - **Authorization callback URL**: `https://yourusername.github.io/my-blog-github-pages`

## 2. 환경 변수 설정

`.env.local` 파일 생성:

```env
# GitHub OAuth App Client ID (공개 정보)
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here

# 허용된 GitHub 사용자 (쉼표로 구분)
NEXT_PUBLIC_ALLOWED_USERS=your_github_username,friend_username
```

⚠️ **중요**: 
- `NEXT_PUBLIC_` 접두사로 시작하는 변수는 클라이언트에 노출됩니다
- GitHub Client Secret은 사용하지 않습니다 (보안상 위험)

## 3. 패키지 설치 및 실행

```bash
pnpm install
pnpm dev
```

## 4. GitHub Pages 배포

### GitHub Actions 워크플로우 설정

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
        
    - name: Install dependencies
      run: pnpm install
      
    - name: Build
      run: pnpm build
      env:
        NEXT_PUBLIC_GITHUB_CLIENT_ID: \${{ secrets.GITHUB_CLIENT_ID }}
        NEXT_PUBLIC_ALLOWED_USERS: \${{ secrets.ALLOWED_USERS }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

### GitHub Secrets 설정

Repository Settings > Secrets and variables > Actions에서 추가:

- `GITHUB_CLIENT_ID`: GitHub OAuth App의 Client ID
- `ALLOWED_USERS`: 허용할 사용자 목록 (예: `user1,user2,user3`)

## 5. 작동 원리

### 클라이언트 사이드 OAuth 플로우:

1. **로그인 버튼 클릭** → GitHub OAuth 페이지로 리다이렉트
2. **GitHub 인증** → 사용자가 앱 권한 승인
3. **콜백 처리** → GitHub에서 authorization code와 함께 리다이렉트
4. **사용자 정보 조회** → GitHub API로 사용자 정보 가져오기
5. **권한 확인** → 허용된 사용자 목록과 비교
6. **로컬 저장** → 인증 상태를 localStorage에 저장

## 6. 보안 고려사항

### ✅ 장점:
- GitHub의 안전한 OAuth 인프라 활용
- 서버 없이도 인증 구현 가능
- 허용된 사용자만 접근 가능

### ⚠️ 제한사항:
- 클라이언트 사이드 인증의 한계
- localStorage 기반 세션 (브라우저 의존적)
- 완전한 보안을 위해서는 서버 사이드 검증 필요

### 🔒 보안 강화 방법:

1. **토큰 만료 시간 설정**
2. **정기적인 토큰 갱신**
3. **허용된 사용자 목록 최소화**
4. **HTTPS 사용 (GitHub Pages 기본 제공)**

## 7. 문제 해결

### 로그인 실패 시:
1. GitHub OAuth App 설정 확인
2. 환경 변수 값 확인
3. 허용된 사용자 목록 확인
4. 브라우저 콘솔에서 에러 메시지 확인

### 개발 중 테스트:
```bash
# 로컬 개발 서버
pnpm dev

# 빌드 테스트
pnpm build
```

## 8. 고급 기능

### 토큰 갱신 구현:
```typescript
// 토큰 만료 시간 체크 및 갱신 로직 추가 가능
const isTokenExpired = (token: string) => {
  // JWT 토큰 만료 시간 확인 로직
};
```

### 사용자 권한 세분화:
```typescript
// 사용자별 다른 권한 부여
const getUserPermissions = (username: string) => {
  const adminUsers = ['admin1', 'admin2'];
  return adminUsers.includes(username) ? 'admin' : 'user';
};
```

이제 GitHub Pages에서도 안전한 OAuth 인증을 사용할 수 있습니다! 🎉
