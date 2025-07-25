#!/bin/bash
# Linux용 개발 서버 실행 스크립트

# .env 파일 로드
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "🚀 [Linux] 개발 서버 시작..."

# TypeScript 컴파일러 감시 모드 (백그라운드)
npx tsc --watch &
TSC_PID=$!

# 잠시 대기 후 nodemon 실행
sleep 2

# Nodemon 서버 실행
npx nodemon dist/index.js &
NODEMON_PID=$!

# 프로세스 종료 처리
cleanup() {
  echo -e "\n🛑 서버 종료 중..."
  kill $TSC_PID 2>/dev/null
  kill $NODEMON_PID 2>/dev/null
  exit 0
}

# 시그널 처리
trap cleanup SIGINT SIGTERM

echo "✅ 개발 서버가 시작되었습니다. Ctrl+C로 종료하세요."

# 프로세스 대기
wait 