#!/bin/bash
# FE 서버 세팅 스크립트 (README.md와 100% 일치)

# .env.example이 있으면 .env로 복사 (존재 시)
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
  echo ".env.example을 .env로 복사했습니다."
fi

# packages/common 의존성 확인 및 설치
echo "📦 packages/common 의존성 확인 중..."
if [ ! -f "../packages/common/package.json" ]; then
  echo "❌ packages/common이 없습니다."
  exit 1
fi

# packages/common 설치 및 빌드
cd ../packages/common
npm install
npm run build
cd ../../fe

# node_modules 설치
npm install

# 주요 FE 패키지 자동 설치 (README.md 기준)
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install -D typescript @types/react @types/react-dom

echo "✅ [FE] npm install 및 주요 패키지 설치 완료" 