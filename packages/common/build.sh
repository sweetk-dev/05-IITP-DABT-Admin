#!/bin/bash
# common 패키지 빌드 스크립트

echo "🧹 Clean build 시작..."
rm -rf dist

npx tsc --build

echo "[common] 빌드 완료!" 