#!/bin/bash
# BE 서버 세팅 스크립트 (README.md와 100% 일치)

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
cd ../../be

# node_modules 설치
npm install

# 로그 디렉토리 생성
mkdir -p logs

# 필수 패키지 설치 (README.md 기준)
npm install sequelize winston winston-daily-rotate-file morgan prompt-sync express cors dotenv jsonwebtoken bcryptjs pg
npm install --save-dev @types/morgan @types/jsonwebtoken @types/sequelize typescript @types/node @types/express ts-node nodemon

# 안내
cat <<EOF
[BE] npm install 및 로그 디렉토리/환경 세팅 완료
- .env 파일을 꼭 확인하세요.
- 암호화 스크립트 사용 시 prompt-sync가 설치되어 있어야 합니다.
- 서버 실행: ./scripts/start-dev.sh (개발), ./scripts/start-prod.sh (운영)
EOF 