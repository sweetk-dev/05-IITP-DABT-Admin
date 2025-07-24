#!/bin/bash
# 전체(공통, BE, FE) 빌드 스크립트

set -e

# 실행 권한 확인 및 설정
if [ ! -x "$0" ]; then
    echo "🔧 실행 권한을 설정합니다..."
    chmod +x "$0"
fi

echo "🧹 Clean build 시작..."
# packages/common clean
rm -rf ../packages/common/dist
# BE clean
rm -rf ../be/dist
# FE clean
rm -rf ../fe/dist

echo "📦 packages/common 빌드 중..."
# 공통 패키지 빌드
cd ../packages/common
npm run build
cd -

echo "🔧 Backend 빌드 중..."
# BE 빌드
cd ../be
npm run build
cd -

echo "🎨 Frontend 빌드 중..."
# FE 빌드
cd ../fe
npm run build
cd -

echo "✅ [ALL] common, be, fe 빌드 완료!"
echo "📁 빌드 결과물:"
echo "   - packages/common/dist/"
echo "   - be/dist/"
echo "   - fe/dist/" 