#!/bin/bash
# BE 빌드 스크립트

echo "🧹 Clean build 시작..."
rm -rf dist

echo "📦 packages/common 빌드 확인 중..."
# packages/common이 빌드되어 있는지 확인
if [ ! -f "../packages/common/dist/index.js" ]; then
  echo "⚠️  packages/common이 빌드되지 않았습니다. 빌드 중..."
  cd ../packages/common
  npm run build
  cd ../../be
fi

echo "🔧 Backend 빌드 중..."
npm run build

echo "✅ [BE] 빌드 완료!" 