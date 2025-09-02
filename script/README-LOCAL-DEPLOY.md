# 로컬 개발 환경 배포 가이드

## 📋 개요

이 가이드는 로컬 개발 환경에서 실제 서버로 배포할 때 사용하는 배포 스크립트에 대한 설명입니다.

## 🔄 배포 방식 개요

### 1. 로컬 → 서버 배포 (기존 방식)
- **장점**: 간단하고 직관적
- **단점**: 로컬 환경에 의존, 네트워크 대역폭 사용
- **적용**: 소규모 프로젝트, 개발 단계

### 2. 서버 → 서버 배포 (새로운 방식)
- **장점**: 안정적, 확장 가능, CI/CD 친화적
- **단점**: 복잡한 설정, 서버 인프라 필요
- **적용**: 프로덕션 환경, 대규모 프로젝트

## 🚀 로컬 배포 스크립트

### 로컬 → 서버 배포 (기존 방식)

#### 파일 위치
- **스크립트**: `script/deploy-local.ps1`
- **설정 파일**: `script/deploy-config.json` (개인 설정)
- **설정 템플릿**: `script/deploy-config.json.example`

#### 특징
- **임시 스크립트**: package.json에 포함되지 않음
- **개인 설정**: Git에 커밋되지 않는 개인 설정 파일 사용
- **대화형**: 배포 타입을 선택할 수 있는 메뉴 제공
- **환경 변수 자동 설정**: 설정 파일에서 환경 변수를 자동으로 설정

### 서버 → 서버 배포 (새로운 방식)

#### 빌드 서버용 스크립트
- **전체 빌드**: `script/build-server.js`
- **개별 빌드**: `script/build-server-be.js`, `script/build-server-fe.js`, `script/build-server-common.js`

#### 기동 서버용 스크립트
- **전체 배포**: `script/deploy-server.js`
- **개별 배포**: `script/deploy-server-be.js`, `script/deploy-server-fe.js`, `script/deploy-server-common.js`
- **서버 시작**: `script/start-server-be.js`, `script/start-server-fe.js`
- **서버 재시작**: `script/restart-server-be.js`, `script/restart-server-fe.js`

## 📋 전체 명령어 구조

### 로컬용 명령어 (OS 자동 분기)
```bash
# 설정 및 빌드
npm run setup          # 전체 설정 (Windows: .ps1, Linux/Mac: .sh)
npm run build          # 전체 빌드 (Windows: .ps1, Linux/Mac: .sh)
npm run build:be       # BE만 빌드
npm run build:fe       # FE만 빌드
npm run build:common   # Common만 빌드

# 개발 서버
npm run dev:be         # BE 개발 서버
npm run dev:fe         # FE 개발 서버

# 프로덕션 서버
npm run start:be       # BE 프로덕션 서버
npm run start:fe       # FE 프로덕션 서버

# 로컬 → 서버 배포
npm run deploy         # 전체 배포
npm run deploy:be      # BE만 배포
npm run deploy:fe      # FE만 배포
npm run deploy:common  # Common만 배포
```

### 서버용 명령어 (Linux 전용)
```bash
# 빌드 서버에서 실행
npm run build:server        # Git pull + 전체 빌드 + 배포 폴더 복사
npm run build:server:be     # BE만 빌드 + 배포 폴더 복사
npm run build:server:fe     # FE만 빌드 + 배포 폴더 복사
npm run build:server:common # Common만 빌드 + 배포 폴더 복사

# 기동 서버에서 실행
npm run deploy:server       # 전체 배포 (빌드 서버 → 기동 서버)
npm run deploy:server:be    # BE만 배포
npm run deploy:server:fe    # FE만 배포
npm run deploy:server:common # Common만 배포

# 서버 시작
npm run start:server:be     # BE 서버 시작 (PM2)
npm run start:server:fe     # FE 서버 시작 (Nginx)

# 서버 재시작
npm run restart:server:be   # BE 서버 재시작
npm run restart:server:fe   # FE 서버 재시작
```

## 🔧 설정 방법

### 로컬 → 서버 배포 설정

#### 1. 설정 파일 생성
```bash
# 템플릿 파일을 복사
copy script\deploy-config.json.example script\deploy-config.json
```

### 2. 설정 파일 편집
`script/deploy-config.json` 파일을 편집하여 실제 서버 정보를 입력:

```json
{
  "common": {
    "host": "192.168.1.100",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "192.168.1.100",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-backend",
    "port": "22"
  },
  "frontend": {
    "host": "192.168.1.101",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-frontend",
    "port": "22"
  }
}
```

## 🚀 사용법

### 기본 사용법
```powershell
# PowerShell에서 실행
.\script\deploy-local.ps1
```

### 다른 설정 파일 사용
```powershell
# 다른 설정 파일 사용
.\script\deploy-local.ps1 -ConfigFile "deploy-config-prod.json"
```

### 실행 과정
1. **설정 파일 확인**: `deploy-config.json` 파일 존재 및 유효성 검사
2. **환경 변수 설정**: 설정 파일의 값을 환경 변수로 설정
3. **배포 타입 선택**: 대화형 메뉴에서 배포 타입 선택
4. **배포 실행**: 선택한 배포 스크립트 실행

### 배포 타입
```
📋 배포 타입을 선택하세요:
1. 전체 배포 (Common + Backend + Frontend)
2. Common 패키지만 배포
3. Backend만 배포
4. Frontend만 배포
5. 취소
```

## 🔒 보안

### 설정 파일 보안
- `deploy-config.json`은 `.gitignore`에 포함되어 Git에 커밋되지 않음
- 개인 서버 정보를 안전하게 보관
- 팀원마다 다른 설정 파일 사용 가능

### SSH 키 설정
배포 전 SSH 키 설정이 필요합니다:

```bash
# SSH 키 생성 (없는 경우)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 서버에 SSH 키 등록
ssh-copy-id user@your-server.com
```

## 📝 예시

### 개발 서버 배포
```json
{
  "common": {
    "host": "dev-server.company.com",
    "user": "developer",
    "path": "/home/developer/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "dev-server.company.com",
    "user": "developer",
    "path": "/home/developer/iitp-dabt-backend",
    "port": "22"
  },
  "frontend": {
    "host": "dev-server.company.com",
    "user": "developer",
    "path": "/home/developer/iitp-dabt-frontend",
    "port": "22"
  }
}
```

### 프로덕션 서버 배포
```json
{
  "common": {
    "host": "prod-server.company.com",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "prod-server.company.com",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-backend",
    "port": "22"
  },
  "frontend": {
    "host": "prod-server.company.com",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-frontend",
    "port": "22"
  }
}
```

## 🆘 문제 해결

### 설정 파일 오류
```
❌ 설정 파일이 없습니다: script/deploy-config.json
```
**해결**: `deploy-config.json.example`을 복사하여 `deploy-config.json` 생성

### SSH 연결 오류
```
❌ Backend 배포 실패
```
**해결**: SSH 키 설정 확인, 서버 접근 권한 확인

### 권한 오류
```
❌ Frontend 배포 실패
```
**해결**: 서버 디렉토리 쓰기 권한 확인

## 💡 팁

### 여러 환경 관리
```bash
# 개발 환경
deploy-config-dev.json

# 스테이징 환경
deploy-config-staging.json

# 프로덕션 환경
deploy-config-prod.json
```

### 배치 파일로 간편 실행
`deploy.bat` 파일 생성:
```batch
@echo off
powershell -ExecutionPolicy Bypass -File script\deploy-local.ps1
pause
```

### 서버 → 서버 배포 설정

#### 빌드 서버 환경 변수 설정
```bash
# Git 설정
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main

# 경로 설정
export SOURCE_PATH=/var/www/iitp-dabt-admin
export DEPLOY_PATH=/var/www/iitp-dabt-deploy

# 빌드 설정
export NODE_ENV=production
export NPM_CONFIG_PRODUCTION=true
```

#### 기동 서버 환경 변수 설정
```bash
# 빌드 서버 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/var/www/iitp-dabt-deploy
export BUILD_SERVER_PORT=22

# 기동 서버 설정
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_SERVER_PORT=22

# Backend 설정
export PROD_BE_PATH=/var/www/iitp-dabt-backend
export PM2_APP_NAME_BE=iitp-dabt-backend

# Frontend 설정
export PROD_FE_PATH=/var/www/iitp-dabt-frontend
export FRONTEND_DOMAIN=your-domain.com
export NGINX_CONFIG_PATH=/etc/nginx/sites-available/iitp-dabt-frontend

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

## 🔄 배포 플로우 비교

### 로컬 → 서버 배포 플로우
```
[로컬 개발자] → [로컬 빌드] → [원격 서버] → [서버 시작]
     ↓              ↓            ↓           ↓
  코드 수정      npm run build  rsync/scp   PM2/Nginx
```

### 서버 → 서버 배포 플로우
```
[Git 저장소] → [빌드 서버] → [기동 서버] → [서비스 시작]
     ↓            ↓            ↓           ↓
  코드 푸시    Git pull +    rsync      PM2/Nginx
               빌드 + 복사
```

### 자동화
CI/CD 파이프라인에서는 이 스크립트 대신 환경 변수를 직접 설정하여 사용하세요. 