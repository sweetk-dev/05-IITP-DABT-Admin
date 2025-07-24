# 배포 스크립트 가이드

## 📋 개요

이 디렉토리에는 IITP DABT Admin 시스템의 배포를 위한 스크립트들이 포함되어 있습니다.

## 🖥️ OS 자동 감지

모든 스크립트는 실행 환경의 OS를 자동으로 감지하여 적절한 명령어를 실행합니다:
- **Windows**: PowerShell 스크립트 (`.ps1`)
- **Linux/macOS**: Bash 스크립트 (`.sh`)

## 🚀 배포 스크립트

### 1. 전체 배포
```bash
npm run deploy
```
- **파일**: `script/deploy.js`
- **기능**: 개별 배포 스크립트들을 순차적으로 호출하여 전체 배포
- **대상**: packages/common + be + fe
- **특징**: 모듈화된 구조로 유지보수성 향상

### 2. 개별 배포

#### Common 패키지 배포
```bash
npm run deploy:common
```
- **파일**: `script/deploy-common.js`
- **기능**: packages/common만 빌드 및 배포
- **환경 변수**: `COMMON_HOST`, `COMMON_USER`, `COMMON_PATH`

#### Backend 배포
```bash
npm run deploy:be
```
- **파일**: `script/deploy-be.js`
- **기능**: packages/common 의존성 확인 → Backend 빌드 → 배포 → 서버 재시작
- **환경 변수**: `BE_HOST`, `BE_USER`, `BE_PATH`

#### Frontend 배포
```bash
npm run deploy:fe
```
- **파일**: `script/deploy-fe.js`
- **기능**: packages/common 의존성 확인 → Frontend 빌드 → 배포
- **환경 변수**: `FE_HOST`, `FE_USER`, `FE_PATH`

## ⚙️ 환경 변수 설정

### 전체 배포용
```bash
# Backend 서버
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-backend

# Frontend 서버
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-frontend
```

### 개별 배포용
```bash
# Common 패키지
export COMMON_HOST=your-common-server.com
export COMMON_USER=your-username
export COMMON_PATH=/var/www/iitp-dabt-common

# Backend
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-backend

# Frontend
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-frontend
```

## 📁 배포 파일 구조

### Common 패키지
```
packages/common/
├── dist/           # TypeScript 컴파일된 JS 파일들
├── package.json    # 의존성 정보
└── package-lock.json
```

### Backend
```
be/
├── dist/           # TypeScript 컴파일된 JS 파일들
├── package.json    # 의존성 정보
├── package-lock.json
└── build-info.json # 버전 정보 (자동 생성)
```

### Frontend
```
fe/dist/           # Vite로 빌드된 정적 파일들
├── index.html
├── assets/
└── *.png, *.svg
```

## 🔧 서버 설정

### Backend 서버 (Node.js)
```bash
# 서버에서 실행
cd /var/www/iitp-dabt-backend
npm install
pm2 start dist/index.js --name iitp-dabt-backend
```

### Frontend 서버 (Nginx)
```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    root /var/www/iitp-dabt-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🛠️ 수동 배포 (Windows)

Windows에서는 Git Bash를 사용하여 수동으로 배포할 수 있습니다:

### Common 패키지
```bash
scp -P 22 -r packages/common/dist/* user@server:/var/www/iitp-dabt-common/
scp -P 22 packages/common/package.json user@server:/var/www/iitp-dabt-common/
scp -P 22 packages/common/package-lock.json user@server:/var/www/iitp-dabt-common/
```

### Backend
```bash
scp -P 22 -r be/dist/* user@server:/var/www/iitp-dabt-backend/
scp -P 22 be/package.json user@server:/var/www/iitp-dabt-backend/
scp -P 22 be/package-lock.json user@server:/var/www/iitp-dabt-backend/
scp -P 22 be/build-info.json user@server:/var/www/iitp-dabt-backend/
```

### Frontend
```bash
scp -P 22 -r fe/dist/* user@server:/var/www/iitp-dabt-frontend/
```

## 🔄 서버 재시작

### Backend 서버 재시작
```bash
ssh -p 22 user@server 'cd /var/www/iitp-dabt-backend && npm install && pm2 restart iitp-dabt-backend'
```

## 🔧 유지보수성

### 모듈화된 배포 시스템
통합 배포 스크립트(`deploy.js`)는 개별 배포 스크립트들을 호출하여 구성됩니다.

**장점:**
- **코드 재사용**: 개별 배포와 통합 배포가 동일한 로직 사용
- **유지보수성**: 배포 로직 변경 시 한 곳만 수정하면 모든 곳에 적용
- **일관성**: 모든 배포 방식이 동일한 로직 사용
- **테스트 용이성**: 개별 배포 스크립트를 독립적으로 테스트 가능

**구조:**
```
deploy.js (통합 배포)
├── deploy-common.js (Common 패키지 배포)
├── deploy-be.js (Backend 배포)
└── deploy-fe.js (Frontend 배포)
```

## 📝 주의사항

1. **의존성 순서**: Backend/Frontend 배포 시 packages/common이 먼저 빌드되어야 합니다.
2. **환경 변수**: 배포 전 반드시 환경 변수를 설정해야 합니다.
3. **서버 접근**: SSH 키 설정이 필요합니다.
4. **권한**: 서버 디렉토리에 쓰기 권한이 필요합니다.
5. **pm2**: Backend 서버 재시작을 위해 pm2가 설치되어 있어야 합니다.

## 🆘 문제 해결

### 빌드 실패
- packages/common이 먼저 빌드되었는지 확인
- TypeScript 컴파일 에러 확인

### 배포 실패
- SSH 연결 확인
- 서버 디렉토리 권한 확인
- 환경 변수 설정 확인

### 서버 재시작 실패
- pm2 설치 확인
- 서버 프로세스 상태 확인 