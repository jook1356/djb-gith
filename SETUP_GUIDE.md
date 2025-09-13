# GitHub Pages + Cloudflare Worker OAuth 설정 가이드

이 가이드는 pnpm 모노레포 구조에서 GitHub Pages와 Cloudflare Worker를 사용하여 GitHub OAuth 인증을 구현하는 방법을 설명합니다.

## 📋 목차

1. [프로젝트 구조 이해](#1-프로젝트-구조-이해)
2. [GitHub OAuth App 생성](#2-github-oauth-app-생성)
3. [Cloudflare 설정](#3-cloudflare-설정)
4. [환경 변수 설정](#4-환경-변수-설정)
5. [배포](#5-배포)
6. [테스트](#6-테스트)
7. [트러블슈팅](#7-트러블슈팅)

---

## 1. 프로젝트 구조 이해

이 프로젝트는 pnpm workspace를 사용한 모노레포 구조입니다:

```
djb-gith/
├── apps/
│   ├── web/          # Next.js 웹 애플리케이션
│   └── worker/       # Cloudflare Worker (OAuth 인증 서버)
├── package.json      # 루트 패키지 (workspace 설정)
├── pnpm-workspace.yaml
└── deploy-worker.sh  # Worker 배포 스크립트
```

### 주요 명령어

```bash
# 모든 의존성 설치
pnpm install

# 웹 앱 개발 서버 실행
pnpm dev

# Worker 개발 서버 실행
pnpm dev:worker

# Worker 배포
pnpm deploy:worker
```

---

## 2. GitHub OAuth App 생성

### 2.1 GitHub OAuth App 만들기

1. GitHub에 로그인 후 [GitHub Developer Settings](https://github.com/settings/developers)로 이동
2. **"OAuth Apps"** 탭 클릭
3. **"New OAuth App"** 버튼 클릭
4. 다음 정보를 입력:
   - **Application name**: `Your Blog Name`
   - **Homepage URL**: `https://your-username.github.io/your-repository-name`
   - **Authorization callback URL**: `https://blog-auth-worker.your-username.workers.dev/auth/callback`
   - **Application description**: (선택사항) 블로그 설명

### 2.2 Client ID와 Secret 저장

OAuth App 생성 후:

- **Client ID** 복사하여 저장
- **"Generate a new client secret"** 클릭하여 **Client Secret** 생성 및 저장

⚠️ **중요**: Client Secret은 한 번만 표시되므로 안전한 곳에 저장하세요!

---

## 3. Cloudflare 설정

### 3.1 Cloudflare 계정 및 Workers 설정

1. [Cloudflare](https://cloudflare.com)에 계정 생성/로그인
2. **Workers & Pages** 메뉴로 이동
3. **Create application** → **Create Worker** 클릭

### 3.2 KV Namespace 생성

1. Cloudflare Dashboard에서 **Workers & Pages** → **KV** 메뉴로 이동
2. **Create a namespace** 클릭
3. Namespace name: `AUTH_SESSIONS` 입력하고 생성
4. 생성된 namespace의 **ID**를 복사하여 저장

### 3.3 Wrangler CLI 설치 및 설정

프로젝트에는 이미 Wrangler가 설정되어 있습니다. Worker 설정을 위한 명령어들:

```bash
# 프로젝트 루트에서 실행
pnpm install

# Wrangler 로그인 (최초 1회만)
cd apps/worker
pnpm exec wrangler login
```

브라우저에서 Cloudflare 계정으로 로그인합니다.

---

## 4. 환경 변수 설정

### 4.1 wrangler.toml 수정

`apps/worker/wrangler.toml` 파일을 수정합니다:

1. **KV Namespace ID 설정**: 3.2에서 생성한 KV Namespace ID로 변경
2. **환경변수 값 수정**: GitHub OAuth 정보와 허용 오리진 설정

```toml
# apps/worker/wrangler.toml

name = "blog-auth-worker"

# 기본 환경변수 (개발용)
[vars]
GITHUB_CLIENT_ID = "당신의_GitHub_Client_ID"
GITHUB_CLIENT_SECRET = "당신의_GitHub_Client_Secret"
JWT_SECRET = "강력한_랜덤_문자열"
ALLOWED_ORIGINS = "https://jook1356.github.io/djb-gith,http://localhost:3000"

[[kv_namespaces]]
binding = "AUTH_SESSIONS"
id = "당신의_KV_Namespace_ID"
preview_id = "당신의_KV_Namespace_ID"

# 프로덕션 환경 설정
[env.production]
name = "blog-auth-worker"
GITHUB_CLIENT_ID = "프로덕션용_GitHub_Client_ID"
GITHUB_CLIENT_SECRET = "프로덕션용_GitHub_Client_Secret"
# ... (기타 설정)
```

⚠️ **보안 주의사항**: 실제 운영시에는 wrangler.toml에 민감한 정보를 직접 입력하지 말고, 다음 섹션의 방법을 사용하세요.

### 4.2 안전한 환경 변수 설정 (권장)

보안을 위해 민감한 정보는 Cloudflare에 직접 설정:

```bash
cd apps/worker

# GitHub OAuth 정보 설정
pnpm exec wrangler secret put GITHUB_CLIENT_ID
# → 2.2에서 저장한 Client ID 입력

pnpm exec wrangler secret put GITHUB_CLIENT_SECRET
# → 2.2에서 저장한 Client Secret 입력

# JWT 서명용 비밀키 설정
pnpm exec wrangler secret put JWT_SECRET
# → 강력한 랜덤 문자열 입력 (예: openssl rand -base64 32)

# 허용할 오리진 URL 설정
pnpm exec wrangler secret put ALLOWED_ORIGINS
# → https://jook1356.github.io/djb-gith,http://localhost:3000
```

### 4.3 여러 오리진 허용 설정

로컬 개발과 배포 환경을 모두 지원하려면:

```bash
# 여러 오리진을 쉼표로 구분하여 설정
pnpm exec wrangler secret put ALLOWED_ORIGINS
# 입력 예시: https://jook1356.github.io/djb-gith,http://localhost:3000,http://127.0.0.1:8787
```

⚠️ **주의사항**:

- 오리진들을 쉼표(`,`)로 구분하세요
- 공백 없이 입력하세요
- 프로토콜(`http://` 또는 `https://`)을 반드시 포함하세요
- 포트 번호가 있다면 포함하세요

### 4.4 프론트엔드 환경 변수

#### 4.4.1 로컬 개발용 환경 변수

`apps/web/.env.local` 파일 생성:

```env
NEXT_PUBLIC_AUTH_WORKER_URL=https://blog-auth-worker.your-username.workers.dev
```

#### 4.4.2 GitHub Pages 배포용 환경 변수

GitHub Actions에서 사용할 환경 변수를 설정:

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **Variables** 탭에서 **New repository variable** 클릭
3. 다음 변수 추가:
   - **Name**: `NEXT_PUBLIC_AUTH_WORKER_URL`
   - **Value**: `https://blog-auth-worker.your-username.workers.dev`

⚠️ **중요**:

- `your-username`을 실제 Cloudflare 계정 이름으로 변경하세요!
- Secrets가 아닌 **Variables**에 추가해야 합니다

---

## 5. 배포

### 5.1 Cloudflare Worker 배포

#### 방법 1: 편리한 스크립트 사용 (권장)

프로젝트 루트에서:

```bash
# Worker 배포 스크립트 실행
./deploy-worker.sh
```

이 스크립트는 자동으로:

- Worker 디렉토리로 이동
- 의존성 설치
- TypeScript 컴파일 확인
- Worker 배포 실행

#### 방법 2: 수동 배포

```bash
# 프로젝트 루트에서
pnpm deploy:worker

# 또는 Worker 디렉토리에서 직접
cd apps/worker
pnpm exec wrangler deploy
```

배포 성공 시 Worker URL이 표시됩니다 (예: `https://blog-auth-worker.your-username.workers.dev`)

### 5.2 GitHub Pages 배포

#### 방법 1: GitHub Actions 사용 (권장)

1. GitHub 저장소에 코드 push:

   ```bash
   git add .
   git commit -m "Update OAuth setup"
   git push origin main
   ```

2. GitHub Actions가 자동으로 빌드 및 배포 실행

#### 방법 2: 수동 빌드

```bash
# 프로젝트 루트에서
pnpm build

# 빌드 결과는 apps/web/out 디렉토리에 생성
```

---

## 6. 테스트

### 6.1 기본 테스트

1. GitHub Pages URL에 접속: `https://jook1356.github.io/djb-gith`
2. **"Login with GitHub"** 버튼 클릭
3. GitHub OAuth 승인 페이지에서 **"Authorize"** 클릭
4. 로그인 성공 시 사용자 정보와 **"Logout"** 버튼이 표시되어야 함

### 6.2 문제 확인

브라우저 개발자 도구(F12)에서:

- **Console** 탭: 에러 메시지 확인
- **Network** 탭: API 호출 상태 확인

---

## 7. 트러블슈팅

### 7.1 일반적인 문제들

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

### 7.2 로그 확인

Cloudflare Worker 로그 확인:

```bash
# 프로젝트 루트에서
pnpm logs:worker

# 또는 Worker 디렉토리에서
cd apps/worker
pnpm exec wrangler tail
```

### 7.3 환경 변수 확인

설정된 환경 변수 확인:

```bash
cd apps/worker
pnpm exec wrangler secret list
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

### 동시 개발 서버 실행

로컬에서 웹 앱과 Worker를 함께 개발하려면:

```bash
# 터미널 1: Next.js 개발 서버
pnpm dev

# 터미널 2: Cloudflare Worker 개발 서버
pnpm dev:worker
```

### 로컬 환경 설정

로컬 개발을 위해 `apps/web/.env.local` 파일에서 Worker URL 변경:

```env
# 로컬 Worker 사용 시
NEXT_PUBLIC_AUTH_WORKER_URL=http://localhost:8787

# 또는 배포된 Worker 사용 시
NEXT_PUBLIC_AUTH_WORKER_URL=https://blog-auth-worker.your-username.workers.dev
```

### 개발 흐름

1. **의존성 설치**: `pnpm install` (루트에서 실행)
2. **Worker 개발**: `pnpm dev:worker`로 로컬 Worker 서버 실행
3. **웹 앱 개발**: `pnpm dev`로 Next.js 개발 서버 실행
4. **테스트**: `http://localhost:3000`에서 OAuth 로그인 테스트
5. **배포**: `./deploy-worker.sh`로 Worker 배포

---

## ✅ 체크리스트

배포 전 확인사항:

- [ ] GitHub OAuth App 생성 완료
- [ ] Cloudflare KV Namespace 생성 완료
- [ ] `apps/worker/wrangler.toml`에 올바른 KV ID 설정
- [ ] 환경 변수 설정 완료 (secret 또는 wrangler.toml)
- [ ] `pnpm install` 실행하여 의존성 설치
- [ ] Worker 배포 성공 (`./deploy-worker.sh` 또는 `pnpm deploy:worker`)
- [ ] `apps/web/.env.local`에 Worker URL 설정
- [ ] GitHub Pages 배포 성공
- [ ] OAuth 로그인/로그아웃 테스트 완료

### 주요 명령어 요약

```bash
# 초기 설정
pnpm install
cd apps/worker && pnpm exec wrangler login

# 개발
pnpm dev          # 웹 앱 개발 서버
pnpm dev:worker   # Worker 개발 서버

# 배포
./deploy-worker.sh  # Worker 배포 (편리한 스크립트)
pnpm deploy:worker  # Worker 배포 (직접 명령어)

# 관리
pnpm logs:worker    # Worker 로그 확인
```

---

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 이 가이드의 모든 단계를 정확히 따랐는지
2. 환경 변수가 올바르게 설정되었는지
3. URL들이 정확히 일치하는지
4. 브라우저 개발자 도구의 에러 메시지

추가 도움이 필요하면 GitHub Issues를 생성해주세요.
