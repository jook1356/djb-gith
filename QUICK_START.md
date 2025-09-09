# 🚀 빠른 시작 가이드

GitHub OAuth가 구현된 정적 블로그를 빠르게 설정하는 방법입니다.

## ⚡ 5분 설정

### 1단계: GitHub OAuth App 생성

1. [GitHub Developer Settings](https://github.com/settings/developers) → **OAuth Apps** → **New OAuth App**
2. 정보 입력:
   - Homepage URL: `https://your-username.github.io/your-repository-name`
   - Callback URL: `https://blog-auth-worker.your-username.workers.dev/auth/callback`
3. **Client ID**와 **Client Secret** 저장

### 2단계: Cloudflare 설정

```bash
# Wrangler 설치 및 로그인
npm install -g wrangler
wrangler login

# Worker 디렉토리로 이동
cd cloudflare-worker

# 의존성 설치
npm install

# 환경 변수 설정
wrangler secret put GITHUB_CLIENT_ID      # 1단계의 Client ID
wrangler secret put GITHUB_CLIENT_SECRET  # 1단계의 Client Secret
wrangler secret put JWT_SECRET            # 랜덤 문자열 (예: openssl rand -base64 32)
wrangler secret put ALLOWED_ORIGINS       # https://your-username.github.io,http://localhost:3000
# ⚠️ 중요: Origin 헤더는 도메인만! repository 경로 제외
```

### 3단계: KV Namespace 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **KV**
2. **Create a namespace**: `AUTH_SESSIONS`
3. `wrangler.toml`에서 KV ID 업데이트:
   ```toml
   [[kv_namespaces]]
   binding = "AUTH_SESSIONS"
   id = "생성된_KV_ID"
   preview_id = "생성된_KV_ID"
   ```

### 4단계: 환경 변수 설정

#### 로컬 개발용

프로젝트 루트에 `.env.local` 생성:

```env
NEXT_PUBLIC_AUTH_WORKER_URL=https://blog-auth-worker.your-username.workers.dev
```

#### GitHub Pages 배포용

GitHub 저장소 → Settings → Secrets and variables → Actions → Variables에서:

- **Name**: `NEXT_PUBLIC_AUTH_WORKER_URL`
- **Value**: `https://blog-auth-worker.your-username.workers.dev`

### 5단계: 배포

```bash
# Worker 배포
npm run deploy:worker

# GitHub Pages 배포 (코드 푸시)
git add .
git commit -m "Add GitHub OAuth"
git push origin main
```

## ✅ 완료!

이제 `https://your-username.github.io/your-repository-name`에서 GitHub OAuth 로그인을 테스트할 수 있습니다.

## 🔧 개발 명령어

```bash
npm run dev                # Next.js 개발 서버
npm run dev:worker        # Cloudflare Worker 로컬 개발
npm run deploy:worker     # Worker 배포
npm run logs:worker       # Worker 로그 확인
```

## 📖 자세한 설정

더 자세한 설정은 [SETUP_GUIDE.md](./SETUP_GUIDE.md)를 참조하세요.
