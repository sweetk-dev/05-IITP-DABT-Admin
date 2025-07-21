#!/bin/bash
# 개발 환경에서 BE 서버 실행

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

npm run dev 