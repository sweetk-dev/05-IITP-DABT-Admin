@echo off
REM Windows용 개발 서버 실행 스크립트

echo 🚀 [Windows] 개발 서버 시작...

REM TypeScript 컴파일러 감시 모드 (백그라운드)
start /B npx tsc --watch

REM 잠시 대기 후 nodemon 실행
timeout /t 2 /nobreak >nul

REM Nodemon 서버 실행
npx nodemon dist/index.js

echo ✅ 개발 서버가 종료되었습니다. 