#!/bin/bash
# 전체(공통, BE, FE) 빌드 스크립트

set -e

echo "🧹 Clean build 시작..."
# packages/common clean
rm -rf ../packages/common/dist
# BE clean
rm -rf ../be/dist
# FE clean
rm -rf ../fe/dist

# 공통 패키지 빌드
cd ../packages/common
npx tsc --build
cd -

# BE 빌드
cd ../be
npx tsc --build
cd -

# FE 빌드
cd ../fe
npx tsc --build
cd -

echo "[ALL] common, be, fe 빌드 완료!" 