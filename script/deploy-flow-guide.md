# 🚀 배포 플로우 가이드

이 문서는 IITP DABT Admin 프로젝트의 다양한 배포 방식을 설명하는 가이드입니다.

## 📋 목차

1. [배포 방식 개요](#배포-방식-개요)
2. [로컬 → 서버 배포](#로컬--서버-배포)
3. [서버 → 서버 배포](#서버--서버-배포)
4. [배포 플로우 비교](#배포-플로우-비교)
5. [문제 해결](#문제-해결)

## 🔄 배포 방식 개요

### 1. 로컬 → 서버 배포 (기존 방식)
- **장점**: 간단하고 직관적
- **단점**: 로컬 환경에 의존, 네트워크 대역폭 사용
- **적용**: 소규모 프로젝트, 개발 단계

### 2. 서버 → 서버 배포 (새로운 방식)
- **장점**: 안정적, 확장 가능, CI/CD 친화적
- **단점**: 복잡한 설정, 서버 인프라 필요
- **적용**: 프로덕션 환경, 대규모 프로젝트

## 🏠 로컬 → 서버 배포

### 전체 배포
```bash
# 1. 환경 변수 설정
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-backend
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-frontend

# 2. 전체 배포 실행
npm run deploy
```

### 개별 배포
```bash
# Backend만 배포
npm run deploy:be

# Frontend만 배포
npm run deploy:fe

# Common 패키지만 배포
npm run deploy:common
```

### 배포 과정
1. **로컬 빌드**: `npm run build`
2. **원격 서버 연결**: SSH를 통한 서버 접속
3. **파일 전송**: rsync/scp를 통한 파일 복사
4. **서버 재시작**: PM2/Nginx 재시작

## 🏗️ 서버 → 서버 배포

### 빌드 서버에서 실행

#### 전체 빌드
```bash
# 1. 환경 변수 설정
export SOURCE_PATH=your-build-server-dir/iitp-dabt-admin
export DEPLOY_PATH=/var/www/iitp-dabt-deploy
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main

# 2. 전체 빌드 실행
npm run build:server
```

#### 개별 빌드
```bash
# Backend만 빌드
npm run build:server:be

# Frontend만 빌드
npm run build:server:fe

# Common 패키지만 빌드
npm run build:server:common
```

### 기동 서버에서 실행

#### 전체 배포
```bash
# 1. 환경 변수 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/var/www/iitp-dabt-deploy
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_BE_PATH=/var/www/iitp-dabt-backend
export PROD_FE_PATH=/var/www/iitp-dabt-frontend

# 2. 전체 배포 실행
npm run deploy:server
```

#### 개별 배포
```bash
# Backend만 배포
npm run deploy:server:be

# Frontend만 배포
npm run deploy:server:fe

# Common 패키지만 배포
npm run deploy:server:common
```

#### 서버 시작
```bash
# Backend 서버 시작 (PM2)
npm run start:server:be

# Frontend 서버 시작 (Nginx)
npm run start:server:fe
```

#### 서버 재시작
```bash
# Backend 서버 재시작
npm run restart:server:be

# Frontend 서버 재시작
npm run restart:server:fe
```

### 배포 과정
1. **Git Pull**: 최신 소스 코드 가져오기
2. **빌드**: TypeScript 컴파일 및 번들링
3. **배포 폴더 복사**: 빌드 결과물을 배포 폴더로 복사
4. **서버 간 전송**: rsync를 통한 서버 간 파일 전송
5. **서버 시작**: PM2/Nginx를 통한 서버 시작

## 📊 배포 플로우 비교

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

## 🔧 상세 배포 과정

### 1. 빌드 서버 설정

#### 디렉토리 구조
```
/var/www/iitp-dabt-admin/          # 소스 코드
├── packages/common/
├── be/
├── fe/
└── script/

/var/www/iitp-dabt-deploy/         # 배포 폴더
├── common/
├── backend/
└── frontend/
```

#### 권한 설정
```bash
# 소스 디렉토리 권한
sudo chown -R $USER:$USER /var/www/iitp-dabt-admin
sudo chmod -R 755 /var/www/iitp-dabt-admin

# 배포 디렉토리 권한
sudo chown -R $USER:$USER /var/www/iitp-dabt-deploy
sudo chmod -R 755 /var/www/iitp-dabt-deploy
```

### 2. 기동 서버 설정

#### 디렉토리 구조
```
/var/www/iitp-dabt-backend/        # Backend 서비스
├── dist/
├── node_modules/
├── package.json
└── .env

/var/www/iitp-dabt-frontend/       # Frontend 서비스
├── index.html
├── assets/
└── static/
```

#### PM2 설정
```bash
# PM2 설치
npm install -g pm2

# PM2 설정 파일 생성
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'iitp-dabt-backend',
    script: 'dist/index.js',
    cwd: '/var/www/iitp-dabt-backend',
    env: {
      NODE_ENV: 'production',
      PORT: 30000
    }
  }]
}
```

#### Nginx 설정
```bash
# Nginx 설치
sudo apt install nginx

# 설정 파일 생성
# /etc/nginx/sites-available/iitp-dabt-frontend
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/iitp-dabt-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:30000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🚨 문제 해결

### 1. 빌드 실패
```bash
# 로그 확인
tail -f /var/log/npm-build.log

# 의존성 문제 해결
rm -rf node_modules package-lock.json
npm install

# 권한 문제 해결
sudo chown -R $USER:$USER /var/www/iitp-dabt-admin
```

### 2. 배포 실패
```bash
# SSH 연결 확인
ssh -p 22 user@server.com

# rsync 연결 확인
rsync -avz --dry-run user@server.com:/path/to/source /path/to/dest

# 네트워크 연결 확인
ping server.com
telnet server.com 22
```

### 3. 서버 시작 실패
```bash
# PM2 상태 확인
pm2 status
pm2 logs iitp-dabt-backend

# Nginx 상태 확인
sudo systemctl status nginx
sudo nginx -t

# 포트 사용 확인
netstat -tulpn | grep :30000
```

### 4. 환경 변수 문제
```bash
# 환경 변수 확인
env | grep -E "(DB_|JWT_|ENC_)"

# .env 파일 확인
cat /var/www/iitp-dabt-backend/.env

# 환경 변수 로드 테스트
node -e "console.log(process.env.JWT_SECRET)"
```

## 📝 배포 체크리스트

### 빌드 서버
- [ ] Git 저장소 클론 완료
- [ ] Node.js 및 npm 설치 완료
- [ ] 환경 변수 설정 완료
- [ ] 빌드 스크립트 실행 가능
- [ ] 배포 폴더 권한 설정 완료

### 기동 서버
- [ ] PM2 설치 및 설정 완료
- [ ] Nginx 설치 및 설정 완료
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 연결 확인
- [ ] 방화벽 설정 완료

### 배포 과정
- [ ] Git pull 성공
- [ ] 빌드 성공
- [ ] 배포 폴더 복사 성공
- [ ] 서버 간 파일 전송 성공
- [ ] 서버 시작 성공
- [ ] 헬스 체크 통과

## 🔄 CI/CD 통합

### GitHub Actions 예시
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy
        run: npm run deploy:server
        env:
          BUILD_SERVER_HOST: ${{ secrets.BUILD_SERVER_HOST }}
          PROD_SERVER_HOST: ${{ secrets.PROD_SERVER_HOST }}
```

### Jenkins Pipeline 예시
```groovy
pipeline {
    agent any
    
    stages {
        stage('Build') {
            steps {
                sh 'npm install'
                sh 'npm run build:server'
            }
        }
        
        stage('Deploy') {
            steps {
                sh 'npm run deploy:server'
            }
        }
        
        stage('Start') {
            steps {
                sh 'npm run start:server:be'
                sh 'npm run start:server:fe'
            }
        }
    }
}
```

---

**IITP DABT Admin Team** © 2025
