#!/bin/bash
# 운영 환경에서 BE 서버 빌드 및 실행

# .env에서 ENC_SECRET을 제외한 변수만 로드
if [ -f .env ]; then
  export $(grep -v '^#' .env | grep -v '^ENC_SECRET=' | xargs)
fi

# 운영자는 반드시 export ENC_SECRET=...로 환경 변수 주입 필요
if [ -z "$ENC_SECRET" ]; then
  read -s -p "[운영] 복호화 키(ENC_SECRET)를 입력하세요: " ENC_SECRET
  export ENC_SECRET
  echo
fi

npm run build
npm start 