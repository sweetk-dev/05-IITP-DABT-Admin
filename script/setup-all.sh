#!/bin/bash
# 전체 프로젝트 설정 스크립트

set -e

# 실행 권한 확인 및 설정
if [ ! -x "$0" ]; then
    echo "🔧 실행 권한을 설정합니다..."
    chmod +x "$0"
fi

echo "🚀 IITP DABT Admin 전체 프로젝트 설정 시작..."

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
  echo "❌ 루트 디렉토리에서 실행해주세요."
  exit 1
fi

echo "📦 packages/common 설정 중..."
# packages/common 설정
cd packages/common
npm install
npm run build
cd -

echo "🔧 Backend 설정 중..."
# BE 설정
cd be
if [ -f "scripts/setup.sh" ]; then
  bash scripts/setup.sh
else
  echo "❌ be/scripts/setup.sh 파일이 없습니다."
  exit 1
fi
cd -

echo "🎨 Frontend 설정 중..."
# FE 설정
cd fe
if [ -f "scripts/setup.sh" ]; then
  bash scripts/setup.sh
else
  echo "❌ fe/scripts/setup.sh 파일이 없습니다."
  exit 1
fi
cd -

echo "✅ 전체 프로젝트 설정 완료!"
echo ""
echo "📋 다음 단계:"
echo "1. BE 환경 변수 설정:"
echo "   cd be && cp .env.example .env"
echo "   # .env 파일을 편집하여 데이터베이스 정보 입력"
echo ""
echo "2. 개발 서버 실행:"
echo "   # Backend: cd be && npm run dev"
echo "   # Frontend: cd fe && npm run dev"
echo ""
echo "3. 전체 빌드:"
echo "   bash script/build-all.sh" 