# GitHub Pages + Cloudflare Worker OAuth 설정 가이드

이 가이드는 GitHub Pages와 Cloudflare Worker를 사용하여 GitHub OAuth 인증을 구현하는 방법을 설명합니다.

## 📋 목차

1. [GitHub OAuth App 생성](#1-github-oauth-app-생성)
2. [Cloudflare 설정](#2-cloudflare-설정)
3. [환경 변수 설정](#3-환경-변수-설정)
4. [배포](#4-배포)
5. [테스트](#5-테스트)
6. [트러블슈팅](#6-트러블슈팅)

---

## 1. GitHub OAuth App 생성

### 1.1 GitHub OAuth App 만들기

1. GitHub에 로그인 후 [GitHub Developer Settings](https://github.com/settings/developers)로 이동
2. **"OAuth Apps"** 탭 클릭
3. **"New OAuth App"** 버튼 클릭
4. 다음 정보를 입력:
   - **Application name**: `Your Blog Name`
   - **Homepage URL**: `https://your-username.github.io/your-repository-name`
   - **Authorization callback URL**: `https://blog-auth-worker.your-username.workers.dev/auth/callback`
   - **Application description**: (선택사항) 블로그 설명

### 1.2 Client ID와 Secret 저장

OAuth App 생성 후:
- **Client ID** 복사하여 저장
- **"Generate a new client secret"** 클릭하여 **Client Secret** 생성 및 저장

⚠️ **중요**: Client Secret은 한 번만 표시되므로 안전한 곳에 저장하세요!

---

## 2. Cloudflare 설정

### 2.1 Cloudflare 계정 및 Workers 설정

1. [Cloudflare](https://cloudflare.com)에 계정 생성/로그인
2. **Workers & Pages** 메뉴로 이동
3. **Create application** → **Create Worker** 클릭

### 2.2 KV Namespace 생성

1. Cloudflare Dashboard에서 **Workers & Pages** → **KV** 메뉴로 이동
2. **Create a namespace** 클릭
3. Namespace name: `AUTH_SESSIONS` 입력하고 생성
4. 생성된 namespace의 **ID**를 복사하여 저장

### 2.3 Wrangler CLI 설치

```bash
npm install -g wrangler
```

### 2.4 Wrangler 로그인

```bash
wrangler login
```

브라우저에서 Cloudflare 계정으로 로그인합니다.

---

## 3. 환경 변수 설정

### 3.1 Cloudflare Worker 환경 변수

프로젝트 루트에서 다음 명령어들을 실행하세요:

```bash
cd cloudflare-worker

# GitHub OAuth 정보 설정
wrangler secret put GITHUB_CLIENT_ID
# → 1.2에서 저장한 Client ID 입력

wrangler secret put GITHUB_CLIENT_SECRET
# → 1.2에서 저장한 Client Secret 입력

# JWT 서명용 비밀키 설정 (랜덤 문자열)
wrangler secret put JWT_SECRET
# → 강력한 랜덤 문자열 입력 (예: openssl rand -base64 32)

# 허용할 오리진 URL 설정 (쉼표로 구분하여 여러 개 설정 가능)
wrangler secret put ALLOWED_ORIGINS
# → https://jook1356.github.io/djb-gith,http://localhost:3000
```

### 3.2 wrangler.toml 수정

`cloudflare-worker/wrangler.toml` 파일에서:

1. `name`을 원하는 worker 이름으로 변경
2. KV namespace ID 설정:
   ```toml
   [[kv_namespaces]]
   binding = "AUTH_SESSIONS"
   id = "2.2에서 복사한 KV Namespace ID"
   preview_id = "2.2에서 복사한 KV Namespace ID"
   ```

### 3.2.1 여러 오리진 허용 설정

로컬 개발과 배포 환경을 모두 지원하려면:

```bash
# 여러 오리진을 쉼표로 구분하여 설정
wrangler secret put ALLOWED_ORIGINS
# 입력 예시: https://your-username.github.io/your-repository-name,http://localhost:3000

# 또는 더 많은 오리진 설정
# 입력 예시: https://your-username.github.io/your-repository-name,http://localhost:3000,http://localhost:3001,https://your-custom-domain.com
```

⚠️ **주의사항**:
- 오리진들을 쉼표(`,`)로 구분하세요
- 공백 없이 입력하세요
- 프로토콜(`http://` 또는 `https://`)을 반드시 포함하세요
- 포트 번호가 있다면 포함하세요 (예: `http://localhost:3000`)

### 3.3 프론트엔드 환경 변수

#### 3.3.1 로컬 개발용 환경 변수

프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_AUTH_WORKER_URL=https://blog-auth-worker.your-username.workers.dev
```

#### 3.3.2 GitHub Pages 배포용 환경 변수

GitHub Actions에서 사용할 환경 변수를 설정:

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **Variables** 탭에서 **New repository variable** 클릭
3. 다음 변수 추가:
   - **Name**: `NEXT_PUBLIC_AUTH_WORKER_URL`
   - **Value**: `https://blog-auth-worker.your-username.workers.dev`

⚠️ **중요**: 
- `your-username`을 실제 Cloudflare 계정 이름으로 변경하세요!
- Secrets가 아닌 **Variables**에 추가해야 합니다 (NEXT_PUBLIC_ 접두사가 있는 변수는 클라이언트에서 접근 가능)

---

## 4. 배포

### 4.1 Cloudflare Worker 배포

```bash
cd cloudflare-worker
wrangler deploy
```

배포 성공 시 Worker URL이 표시됩니다 (예: `https://blog-auth-worker.your-username.workers.dev`)

### 4.2 GitHub Pages 배포

#### 방법 1: GitHub Actions 사용 (권장)

1. `.github/workflows/deploy.yml` 파일이 생성되어 있는지 확인
2. GitHub 저장소에 코드 push:
   ```bash
   git add .
   git commit -m "Add GitHub OAuth with Cloudflare Worker"
   git push origin main
   ```

#### 방법 2: 수동 배포

```bash
npm run build
```

빌드된 파일을 GitHub Pages에 배포합니다.

---

## 5. 테스트

### 5.1 기본 테스트

1. GitHub Pages URL에 접속: `https://jook1356.github.io/djb-gith`
2. **"Login with GitHub"** 버튼 클릭
3. GitHub OAuth 승인 페이지에서 **"Authorize"** 클릭
4. 로그인 성공 시 사용자 정보와 **"Logout"** 버튼이 표시되어야 함

### 5.2 문제 확인

브라우저 개발자 도구(F12)에서:
- **Console** 탭: 에러 메시지 확인
- **Network** 탭: API 호출 상태 확인

---

## 6. 트러블슈팅

### 6.1 일반적인 문제들

#### "CORS 에러"
- `ALLOWED_ORIGINS` 환경 변수가 정확한지 확인
- GitHub Pages URL과 정확히 일치하는지 확인
- 로컬 개발 시 `http://localhost:3000`이 포함되어 있는지 확인
- 쉼표로 구분된 형식이 올바른지 확인 (공백 없이)

#### "OAuth callback 에러"
- GitHub OAuth App의 callback URL이 정확한지 확인
- Worker URL이 올바른지 확인

#### "Authentication failed"
- GitHub OAuth App의 Client ID/Secret이 정확한지 확인
- KV Namespace가 올바르게 연결되었는지 확인

#### "Session expired"
- JWT_SECRET이 설정되어 있는지 확인
- 브라우저 localStorage를 클리어하고 다시 시도

### 6.2 로그 확인

Cloudflare Worker 로그 확인:
```bash
wrangler tail
```

### 6.3 환경 변수 확인

설정된 환경 변수 확인:
```bash
wrangler secret list
```

---

## 📝 추가 설정 (선택사항)

### 커스텀 도메인 설정

1. Cloudflare에서 도메인 추가
2. Worker에 커스텀 도메인 연결
3. 모든 URL을 새 도메인으로 업데이트

### 보안 강화

- JWT 토큰 만료 시간 조정
- 추가 OAuth 스코프 설정
- Rate limiting 추가

---

## 🔧 개발 환경 설정

로컬 개발을 위한 설정:

```bash
# Cloudflare Worker 로컬 개발
cd cloudflare-worker
wrangler dev

# Next.js 개발 서버 (새 터미널)
npm run dev
```

로컬 개발 시 `.env.local`에서 Worker URL을 로컬 URL로 변경:
```env
NEXT_PUBLIC_AUTH_WORKER_URL=http://localhost:8787
```

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] GitHub OAuth App 생성 완료
- [ ] Cloudflare KV Namespace 생성 완료
- [ ] 모든 환경 변수 설정 완료
- [ ] `wrangler.toml`에 올바른 KV ID 설정
- [ ] Worker 배포 성공
- [ ] GitHub Pages 배포 성공
- [ ] OAuth 로그인/로그아웃 테스트 완료

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 이 가이드의 모든 단계를 정확히 따랐는지
2. 환경 변수가 올바르게 설정되었는지
3. URL들이 정확히 일치하는지
4. 브라우저 개발자 도구의 에러 메시지

추가 도움이 필요하면 GitHub Issues를 생성해주세요.
