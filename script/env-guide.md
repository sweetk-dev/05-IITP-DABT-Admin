# 🔧 환경 변수 설정 가이드

이 문서는 IITP DABT Admin 프로젝트의 다양한 환경에서 필요한 환경 변수들을 정리한 가이드입니다.

## 📋 목차

1. [로컬 개발용 환경 변수](#로컬-개발용-환경-변수)
2. [서버 빌드용 환경 변수](#서버-빌드용-환경-변수)
3. [서버 배포용 환경 변수](#서버-배포용-환경-변수)
4. [환경 변수 설정 방법](#환경-변수-설정-방법)

## 🏠 로컬 개발용 환경 변수

### Backend (.env 파일)
```env
# 서버 설정
NODE_ENV=development
PORT=30000

# 데이터베이스 설정
DB_HOST=localhost
DB_PORT=5432
DB_NAME=iitp_dabt_admin
DB_USER=your_username
DB_PASSWORD=your_password

# JWT 설정
JWT_SECRET=your-super-secret-jwt-key
JWT_ISSUER=iitp-dabt-api
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# 암호화 설정
ENC_SECRET=your-encryption-secret

# CORS 설정
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:4173

# 로깅 설정
LOG_LEVEL=info
```

### Frontend (.env 파일)
```env
# API 서버 설정
VITE_API_BASE_URL=http://localhost:30000
VITE_API_TIMEOUT=10000

# 환경 설정
VITE_NODE_ENV=development
VITE_APP_TITLE=IITP DABT Admin
VITE_APP_VERSION=1.0.0
```

## 🏗️ 서버 빌드용 환경 변수

### 빌드 서버 환경 변수
```bash
# Git 설정
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main

# 경로 설정
export SOURCE_PATH=/home/iitp-adm/iitp-dabt-admin/source
export DEPLOY_PATH=/home/iitp-adm/iitp-dabt-admin/deploy

# 빌드 설정
export NODE_ENV=production
export NPM_CONFIG_PRODUCTION=true
```

### .env 파일 예시
```env
# Git 설정
GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
GIT_BRANCH=main

# 경로 설정
SOURCE_PATH=/home/iitp-adm/iitp-dabt-admin/source
DEPLOY_PATH=/home/iitp-adm/iitp-dabt-admin/deploy

# 빌드 설정
NODE_ENV=production
NPM_CONFIG_PRODUCTION=true
```

## 🚀 서버 배포용 환경 변수

### 기동 서버 환경 변수
```bash
# 빌드 서버 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
export BUILD_SERVER_PORT=22

# 기동 서버 설정
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_SERVER_PORT=22

# Backend 설정
export PROD_BE_PATH=/var/www/iitp-dabt-adm-be
export PM2_APP_NAME_BE=iitp-dabt-adm-be

# Frontend 설정
export PROD_FE_PATH=/var/www/iitp-dabt-adm-fe
export FRONTEND_DOMAIN=your-domain.com
export NGINX_CONFIG_PATH=/etc/nginx/sites-available/iitp-dabt-adm-fe

# 데이터베이스 설정
export DB_HOST=your-db-server.com
export DB_PORT=5432
export DB_NAME=iitp_dabt_admin
export DB_USER=your_db_user
export DB_PASSWORD=your_db_password

# JWT 설정
export JWT_SECRET=your-production-jwt-secret
export JWT_ISSUER=iitp-dabt-api
export ACCESS_TOKEN_EXPIRES_IN=15m
export REFRESH_TOKEN_EXPIRES_IN=7d

# 암호화 설정
export ENC_SECRET=your-production-encryption-secret

# CORS 설정
export CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# 로깅 설정
export LOG_LEVEL=warn
```

### .env 파일 예시
```env
# 빌드 서버 설정
BUILD_SERVER_HOST=build-server.com
BUILD_SERVER_USER=builduser
BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
BUILD_SERVER_PORT=22

# 기동 서버 설정
PROD_SERVER_HOST=prod-server.com
PROD_SERVER_USER=produser
PROD_SERVER_PORT=22

# Backend 설정
PROD_BE_PATH=/var/www/iitp-dabt-adm-be
PM2_APP_NAME_BE=iitp-dabt-adm-be

# Frontend 설정
PROD_FE_PATH=/var/www/iitp-dabt-adm-fe
FRONTEND_DOMAIN=your-domain.com
NGINX_CONFIG_PATH=/etc/nginx/sites-available/iitp-dabt-adm-fe

# 데이터베이스 설정
DB_HOST=your-db-server.com
DB_PORT=5432
DB_NAME=iitp_dabt_admin
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT 설정
JWT_SECRET=your-production-jwt-secret
JWT_ISSUER=iitp-dabt-api
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# 암호화 설정
ENC_SECRET=your-production-encryption-secret

# CORS 설정
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# 로깅 설정
LOG_LEVEL=warn
```

## ⚙️ 환경 변수 설정 방법

### 1. 시스템 환경 변수로 설정
```bash
# 현재 세션에만 적용
export VARIABLE_NAME=value

# 영구적으로 적용 (bash)
echo 'export VARIABLE_NAME=value' >> ~/.bashrc
source ~/.bashrc

# 영구적으로 적용 (zsh)
echo 'export VARIABLE_NAME=value' >> ~/.zshrc
source ~/.zshrc
```

### 2. .env 파일로 설정
```bash
# .env 파일 생성
touch .env

# .env 파일 편집
nano .env

# .env 파일 내용 추가
VARIABLE_NAME=value
```

### 3. Docker 환경 변수
```bash
# Docker run 시 환경 변수 전달
docker run -e VARIABLE_NAME=value your-image

# Docker Compose에서 환경 변수 설정
# docker-compose.yml
services:
  app:
    environment:
      - VARIABLE_NAME=value
```

### 4. PM2 환경 변수
```bash
# PM2 ecosystem 파일 생성
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'iitp-dabt-adm-be',
    script: 'dist/index.js',
    env: {
      NODE_ENV: 'production',
      PORT: 30000
    }
  }]
}
```

## 🔒 보안 고려사항

### 1. 민감한 정보 보호
- **절대 Git에 커밋하지 마세요**: `.env` 파일은 `.gitignore`에 추가
- **강력한 비밀번호 사용**: JWT_SECRET, ENC_SECRET 등은 충분히 복잡하게 설정
- **환경별 분리**: 개발, 스테이징, 프로덕션 환경별로 다른 비밀번호 사용

### 2. 권한 설정
```bash
# .env 파일 권한 설정
chmod 600 .env

# 환경 변수 파일 권한 확인
ls -la .env
```

### 3. 환경 변수 검증
```bash
# 환경 변수 확인
env | grep -E "(DB_|JWT_|ENC_)"

# 특정 환경 변수 확인
echo $JWT_SECRET
```

## 🧪 환경 변수 테스트

### 1. 환경 변수 로드 테스트
```bash
# Node.js에서 환경 변수 확인
node -e "console.log(process.env.JWT_SECRET)"

# 스크립트에서 환경 변수 확인
node script/check-env.js
```

### 2. 연결 테스트
```bash
# 데이터베이스 연결 테스트
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1;"

# API 서버 연결 테스트
curl -H "Authorization: Bearer $JWT_SECRET" http://localhost:30000/api/common/health
```

## 📝 체크리스트

### 로컬 개발 환경
- [ ] Backend .env 파일 생성 및 설정
- [ ] Frontend .env 파일 생성 및 설정
- [ ] 데이터베이스 연결 테스트
- [ ] JWT 설정 확인
- [ ] CORS 설정 확인

### 서버 빌드 환경
- [ ] Git 저장소 URL 설정
- [ ] 소스 경로 설정
- [ ] 배포 경로 설정
- [ ] 빌드 권한 확인

### 서버 배포 환경
- [ ] 빌드 서버 정보 설정
- [ ] 기동 서버 정보 설정
- [ ] 데이터베이스 연결 정보 설정
- [ ] JWT 비밀키 설정
- [ ] 도메인 설정
- [ ] Nginx 설정 경로 확인

---

**IITP DABT Admin Team** © 2024
