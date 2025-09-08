# My Blog Monorepo

GitHub Pages로 배포되는 블로그와 Cloudflare Worker를 사용한 인증 시스템을 포함한 모노레포입니다.

## 🏗️ 프로젝트 구조

```
my-blog-github-pages/
├── apps/
│   ├── web/                 # Next.js 블로그 앱
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── next.config.ts
│   └── worker/              # Cloudflare Worker (인증)
│       ├── src/
│       ├── package.json
│       └── wrangler.toml
├── packages/                # 공통 패키지 (향후 확장용)
├── package.json             # 모노레포 루트
├── pnpm-workspace.yaml      # pnpm 워크스페이스 설정
└── deploy-worker.sh         # Worker 배포 스크립트
```

## 🚀 시작하기

### 1. 의존성 설치
```bash
pnpm install
```

### 2. 개발 서버 실행

#### Next.js 웹 앱
```bash
pnpm dev
```

#### Cloudflare Worker
```bash
pnpm dev:worker
```

### 3. 빌드

#### Next.js 웹 앱
```bash
pnpm build
```

#### Cloudflare Worker
```bash
pnpm deploy:worker
```

## 📦 사용 가능한 스크립트

- `pnpm dev` - Next.js 개발 서버 실행
- `pnpm build` - Next.js 프로덕션 빌드
- `pnpm start` - Next.js 프로덕션 서버 실행
- `pnpm lint` - Next.js ESLint 검사
- `pnpm dev:worker` - Cloudflare Worker 개발 서버
- `pnpm deploy:worker` - Cloudflare Worker 배포
- `pnpm setup:worker` - Worker 초기 설정 및 로그인
- `pnpm logs:worker` - Worker 로그 확인
- `pnpm clean` - 빌드 캐시 정리

## 🔧 개별 앱 작업

각 앱에서 직접 작업하려면:

```bash
# Next.js 앱
cd apps/web
pnpm dev

# Cloudflare Worker
cd apps/worker
pnpm dev
```

## 📚 더 자세한 정보

- [빠른 시작 가이드](QUICK_START.md)
- [설정 가이드](SETUP_GUIDE.md)