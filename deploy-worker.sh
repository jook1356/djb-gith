#!/bin/bash

# Cloudflare Worker 배포 스크립트

echo "🚀 Cloudflare Worker 배포를 시작합니다..."

# Cloudflare Worker 디렉토리로 이동
cd cloudflare-worker

# 의존성 설치
echo "📦 의존성을 설치합니다..."
npm install

# TypeScript 컴파일 확인
echo "🔍 TypeScript 컴파일을 확인합니다..."
npx tsc --noEmit

if [ $? -ne 0 ]; then
    echo "❌ TypeScript 컴파일 오류가 있습니다. 배포를 중단합니다."
    exit 1
fi

# 배포
echo "🌐 Worker를 배포합니다..."
npx wrangler deploy

if [ $? -eq 0 ]; then
    echo "✅ Worker 배포가 완료되었습니다!"
    echo ""
    echo "다음 단계:"
    echo "1. GitHub Pages가 배포되었는지 확인하세요"
    echo "2. OAuth 로그인을 테스트하세요"
    echo "3. 문제가 있다면 'wrangler tail' 명령어로 로그를 확인하세요"
else
    echo "❌ Worker 배포에 실패했습니다."
    exit 1
fi
