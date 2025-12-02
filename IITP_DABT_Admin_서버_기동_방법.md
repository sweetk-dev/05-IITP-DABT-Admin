<style>
/* PDF 변환 시 페이지 번호 표시 */
@page {
  @bottom-center {
    content: counter(page) " / " counter(pages);
    font-size: 10pt;
    color: #666;
    font-family: Arial, sans-serif;
  }
}
</style>

<div style="text-align: center; margin-top: 100px;">
  <h1 style="font-size: 48px; margin-bottom: 30px;">IITP DABT Admin</h1>
  <h2 style="font-size: 36px; margin-bottom: 80px;">배포 및 설치 가이드</h2>

  <p style="font-size: 18px; margin-top: 60px;">
    <strong>문서 버전:</strong> 1.0.0<br/>
    <strong>작성일:</strong> 2025-11-12<br/>
    <p style="color: #999;">(주)스위트케이</p>
  </p>
</div>








# 🚀 IITP DABT Admin 프로젝트 서버 기동 방법

이 프로젝트는 **Backend (Node.js + Express)**와 **Frontend (React + Vite)**로 구성된 풀스택 애플리케이션입니다.

## 📋 사전 요구사항

- **Node.js**: 22.x 이상
- **npm**: 9.x 이상  
- **PostgreSQL**: 12.x 이상
- **Git**: 최신 버전

## 🔧 1. 프로젝트 설정

### 전체 프로젝트 한 번에 설정 (권장)
```bash
# 프로젝트 루트에서 실행
npm run setup
```

### 개별 설정
```bash
# 1. 공통 패키지 설정
cd packages/common && npm install && npm run build

# 2. Backend 설정  
cd ../../be && npm install

# 3. Frontend 설정
cd ../fe && npm install
```

## 🗄️ 2. 데이터베이스 설정

### PostgreSQL 설치 및 데이터베이스 생성

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql
brew services start postgresql
```

#### Windows
[PostgreSQL 공식 사이트](https://www.postgresql.org/download/windows/)에서 다운로드

### 데이터베이스 생성
```sql
-- PostgreSQL에 접속
sudo -u postgres psql

-- 데이터베이스 생성
CREATE DATABASE iitp_dabt_admin;

-- 사용자 생성 (선택사항)
CREATE USER iitp_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE iitp_dabt_admin TO iitp_user;

-- 종료
\q
```

## ⚙️ 3. 환경 변수 설정

> **환경 변수 파일(.env) 역할 정리:**
> - **Backend**: 빌드 시 `.env` 불필요, **실행 시 `.env` 필수** (DB, JWT, 포트 등 런타임 설정)
>   - 실행 서버: `/var/www/iitp-dabt-admin/be/.env` 반드시 필요
> - **Frontend**: 빌드 시 `.env` 조건부 필요(서브패스 시), **실행 시 `.env` 불필요** (정적 파일만 서빙)
>   - 실행 서버: `fe/.env` 불필요, 빌드 서버에서만 사용

### Backend 환경 변수 (.env 파일 생성)
```bash
cd be
# .env.example이 있다면 복사, 없다면 직접 생성
cp .env.example .env
```

### .env 파일 내용
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

### 환경별 설정

#### Development
```env
NODE_ENV=development
LOG_LEVEL=debug
```

#### Production
```env
NODE_ENV=production
LOG_LEVEL=warn
```

## 🚀 4. 서버 실행

### 개발 환경에서 실행

#### Backend 서버 실행
```bash
# 방법 1: 프로젝트 루트에서
npm run dev:be

# 방법 2: be 디렉토리에서
cd be
npm run dev
```

#### Frontend 서버 실행
```bash
# 방법 1: 프로젝트 루트에서  
npm run dev:fe

# 방법 2: fe 디렉토리에서
cd fe
npm run dev
```

### 프로덕션 환경에서 실행

#### Backend 프로덕션 실행
```bash
cd be
npm run build
npm start
```

#### Frontend 프로덕션 실행

**로컬 프리뷰 (빌드 검증용):**
```bash
cd fe
npm run build
npm run preview  # http://localhost:4173에서 확인
```

**프로덕션 서버 배포 (Nginx):**

Frontend는 정적 파일로 빌드되어 Nginx로 서빙됩니다.

**Nginx 설정 예시 (서브패스 배포):**
```nginx
upstream backend {
    server 127.0.0.1:30000;
}

server {
    listen 80;
    server_name <SERVER_IP>;

    # API 프록시
    location /adm/api/ {
        proxy_pass http://backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # /adm → /adm/ 리다이렉트
    location = /adm { return 301 /adm/; }

    # 정적 자산
    location ^~ /adm/assets/ {
        alias /var/www/iitp-dabt-admin/fe/dist/assets/;
        try_files $uri =404;
    }

    # 루트 레벨 정적 파일 (이미지 등)
    # 주의: 정규식 location에서 alias 사용 시 try_files와 충돌 가능하므로 제거
    location ~* ^/adm/([^/]+\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|js|css|map))$ {
        alias /var/www/iitp-dabt-admin/fe/dist/$1;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # SPA fallback
    location /adm/ {
        alias /var/www/iitp-dabt-admin/fe/dist/;
        index index.html;
        try_files $uri $uri/ /adm/index.html;
    }
}
```

적용:
```bash

sudo nginx -t && sudo systemctl reload nginx
```

## 🌐 5. 서비스 접속

- **Backend API**: `http://localhost:30000`
- **Frontend**: `http://localhost:5173` (개발) 또는 `http://localhost:4173` (프로덕션 프리뷰)

## 🔍 6. 서버 상태 확인

```bash
# Backend 헬스 체크
curl http://localhost:30000/api/common/health

# 버전 정보 확인
curl http://localhost:30000/api/common/version

# JWT 설정 확인
curl http://localhost:30000/api/common/jwt-config
```

## 📊 7. 로그 확인

```bash
# Backend 로그 확인
tail -f be/logs/app-$(date +%Y-%m-%d).log

# 에러 로그 확인
grep -i error be/logs/app-$(date +%Y-%m-%d).log

# 실시간 로그 확인
tail -f be/logs/app-$(date +%Y-%m-%d).log
```

## 🚀 8. 배포 (서버 환경)

### 운영 스크립트 배포 (최초 1회 또는 변경 시)

```bash
# 실행 서버에 기동/재기동 스크립트 배포 (최초 1회 또는 변경 시)
npm run deploy:server:ops
# 직접 실행 대안: node script/deploy-server-ops.js
# 기본 경로: /var/www/iitp-dabt-admin/script
```

### 권장 실행 순서
```bash
# 1) 빌드 서버: 전체 빌드
npm run build:server

# 2) (최초 1회 또는 스크립트 변경 시) 운영 스크립트 배포
npm run deploy:server:ops

# 3) 실행 서버로 전체 배포
npm run deploy:server

# 4) 서버 기동
npm run start:server:be
npm run start:server:fe

# (필요 시) 서버 재시작
npm run restart:server:be
npm run restart:server:fe

# (필요 시) 서버 중지
npm run stop:server:be
npm run stop:server:fe
```

### 로컬에서 원격 서버로 배포 (기존 방식)

#### 전체 배포
```bash
# 환경 변수 설정
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-admin/be
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-admin/fe

# 전체 배포 실행
npm run deploy
```

#### 개별 배포
```bash
# Backend만 배포
npm run deploy:be

# Frontend만 배포  
npm run deploy:fe

# Common 패키지만 배포
npm run deploy:common
```

### 서버에서 직접 빌드 및 배포 (새로운 방식)

#### 빌드 서버에서 실행

##### 전체 빌드
```bash
# 환경 변수 설정
export SOURCE_PATH=/home/iitp-adm/iitp-dabt-admin/source
export DEPLOY_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main

# 전체 빌드 (Git pull + 빌드 + 배포 폴더 복사)
npm run build:server
```

- 최신 스크립트 동작: dist 검증/보강(ensureBuilt) → 안전 복사(`cp -a dist/. <deploy>`)로 글롭(*) 문제와 빈 디렉터리 문제 방지

##### 개별 빌드
```bash
# Backend만 빌드
npm run build:server:be

# Frontend만 빌드
npm run build:server:fe

# Common 패키지만 빌드
npm run build:server:common
```

> 중요(Frontend 빌드 환경변수): Vite의 `VITE_*` 변수는 "빌드 시점"에만 주입됩니다. 실행 서버의 `fe/.env`는 프로덕션(dist) 런타임에 영향을 주지 않습니다.
>
> **시나리오 A: 독립 도메인/루트 경로 배포 (기본)**
> - 예: `https://admin.example.com` 또는 `http://192.168.1.100`
> - 환경변수 설정 불필요 (기본값 `/` 사용)
>
> **시나리오 B: 서브패스 배포 (한 서버에 여러 서비스 공존 시)**
> - 예: `https://example.com/adm` (관리자), `https://example.com/docs` (문서)
> - 빌드 전 환경변수 설정 필수:
> ```bash
> export VITE_BASE=/adm/
> export VITE_API_BASE_URL=/adm/api
> npm run build:server:fe
> ```

#### 기동 서버에서 실행

##### 전체 배포
```bash
# 환경 변수 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_BE_PATH=/var/www/iitp-dabt-admin/be
export PROD_FE_PATH=/var/www/iitp-dabt-admin/fe

# 전체 배포 (빌드 서버 → 기동 서버)
npm run deploy:server
```

> 중요: 실행 서버 의존성 설치 안내
>
> - Backend: 최초 배포이거나 `be/package.json`이 변경되었을 때, 실행 서버에서 다음을 실행하세요.
>   ```bash
>   cd /var/www/iitp-dabt-admin/be
>   npm ci --omit=dev || npm install --omit=dev
>   pm2 restart iitp-dabt-adm-be
>   ```
>
> - Frontend: 정적 산출물만 배포하므로 실행 서버에서 `npm install`이 필요하지 않습니다.

##### 개별 배포
```bash
# Common 패키지만 배포
npm run deploy:server:common
# 배포 후 BE 재시작 필수
npm run restart:server:be

# Backend만 배포
npm run deploy:server:be
npm run restart:server:be

# Frontend만 배포
npm run deploy:server:fe
npm run restart:server:fe
```

> **Common 단독 배포 시나리오:**
> - 공통 검증 로직 버그 수정 (예: `isValidEmail` 핫픽스)
> - 타입 정의 추가/수정
> - 에러 코드 추가
> - **장점**: BE/FE 재빌드 없이 5분 내 배포 가능
> - **주의**: 배포 후 반드시 BE 재시작 필요, FE는 불필요

##### 서버 시작
```bash
# Backend 서버 시작 (PM2)
npm run start:server:be

# Frontend 서버 시작 (Nginx)
npm run start:server:fe
```

##### 서버 재시작
```bash
# Backend 서버 재시작
npm run restart:server:be

# Frontend 서버 재시작
npm run restart:server:fe
```

##### 서버 중지
```bash
# Backend 서버 중지
npm run stop:server:be

# Frontend 서버 중지
npm run stop:server:fe
```

### 8.4 재부팅 자동 기동 설정 (PM2)

서버 재부팅 후 BE가 자동 기동되도록 PM2를 systemd에 등록합니다.

```bash
# root로 실행: iitp-adm 사용자용 PM2 systemd 유닛 생성
# 주의: 홈 디렉토리 경로(/home/iitp-adm)가 실제 환경과 일치하는지 확인하세요
sudo env PATH=$PATH pm2 startup systemd -u iitp-adm --hp /home/iitp-adm

# iitp-adm 사용자로 프로세스 등록 및 저장
# 주의: BE 경로(/var/www/iitp-dabt-admin/be)가 실제 배포 경로와 일치하는지 확인하세요
sudo -iu iitp-adm
pm2 start /var/www/iitp-dabt-admin/be/dist/index.js --name iitp-dabt-adm-be || true
pm2 save

# 재부팅 후 검증
pm2 status
pm2 logs iitp-dabt-adm-be --lines 50
```

주의:
- `npm run start:be`는 .env 로드와 `npm install --omit=dev`까지 수행합니다. `pm2 start dist/index.js`는 앱만 실행하므로, 최초 한 번은 `npm run start:be`로 기동 후 `pm2 save`를 권장합니다.
- 이후 `be/package.json` 변경 배포 시에는 실행 서버에서:
  ```bash
  cd /var/www/iitp-dabt-admin/be
  npm ci --omit=dev || npm install --omit=dev
  pm2 restart iitp-dabt-adm-be
  pm2 save
  ```

검증 체크리스트:
```bash
# 유닛 상태/활성화
sudo systemctl status pm2-iitp-adm | cat
sudo systemctl is-enabled pm2-iitp-adm

# 부팅 직후 복구 로그 확인(이번 부팅 범위)
journalctl -u pm2-iitp-adm -b --no-pager | tail -n 100

# 반드시 iitp-adm 컨텍스트에서 상태 확인
sudo -iu iitp-adm pm2 status
```
권장 실행 위치/사용자:
- BE 기동/저장은 반드시 `iitp-adm` 사용자로, 프로젝트 루트(`/var/www/iitp-dabt-admin`)에서 수행하세요.

## 9. 환경 변수 설정 (배포용)

> 배포 시 필요한 환경 변수 전체 목록은 **[script/env-guide.md](script/env-guide.md)**를 참조하세요.

### 로컬 배포용
```bash
# Backend 서버 설정
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-admin/be

# Frontend 서버 설정
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-admin/fe
```

#### 서버 빌드용
```bash
# 빌드 서버 설정
export SOURCE_PATH=/home/iitp-adm/iitp-dabt-admin/source
export DEPLOY_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main
```

#### 서버 배포용
```bash
# 빌드 서버 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy

# 기동 서버 설정
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_BE_PATH=/var/www/iitp-dabt-admin/be
export PROD_FE_PATH=/var/www/iitp-dabt-admin/fe
export PM2_APP_NAME_BE=iitp-dabt-adm-be
export FRONTEND_DOMAIN=your-domain.com
export NGINX_CONFIG_PATH=/etc/nginx/conf.d/iitp-dabt-admin.conf
```

## 🛠️ 10. 개발 가이드

### 스크립트 명령어

#### 로컬용 명령어 (OS 자동 분기)
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
```

#### 서버용 명령어 (Linux 전용)
```bash
# 빌드 서버에서 실행
npm run build:server        # Git pull + 전체 빌드 + 배포 폴더 복사
npm run build:server:be     # BE만 빌드 + 배포 폴더 복사
npm run build:server:fe     # FE만 빌드 + 배포 폴더 복사
npm run build:server:common # Common만 빌드 + 배포 폴더 복사

# 기동 서버에서 실행
npm run deploy:server        # 전체 배포 (빌드 서버 → 기동 서버)
npm run deploy:server:be     # BE만 배포
npm run deploy:server:fe     # FE만 배포
npm run deploy:server:common # Common만 배포

# 서버 시작/재시작
npm run start:server:be
npm run start:server:fe
npm run restart:server:be
npm run restart:server:fe
```

### 빌드

#### 전체 빌드 (권장)
```bash
npm run build
```

#### 개별 빌드
```bash
# 공통 패키지
cd packages/common && npm run build

# Backend
cd be && npm run build

# Frontend
cd fe && npm run build
```

## 🔒 11. 보안 설정

### JWT 인증
- **Access Token**: 15분 만료
- **Refresh Token**: 7일 만료
- **자동 갱신**: Access Token 만료 5분 전 자동 갱신

### 비밀번호 보안
- **해싱**: bcrypt (salt rounds: 10)
- **검증**: 공통 패키지의 `isValidPassword` 함수 사용

### 환경 변수 암호화
```bash
# 환경 변수 암호화
node scripts/encrypt-env.js <encryption-key>
```

## 🐛 12. 문제 해결

### 일반적인 문제들

#### 1. 데이터베이스 연결 실패
```bash
# PostgreSQL 서비스 상태 확인
sudo systemctl status postgresql

# 데이터베이스 연결 테스트
psql -h localhost -U your_username -d iitp_dabt_admin
```

#### 2. 포트 충돌
```bash
# 포트 사용 확인
netstat -tulpn | grep :30000

# 프로세스 종료
kill -9 <process-id>
```

#### 3. 권한 문제
```bash
# 로그 디렉토리 권한 확인
ls -la be/logs/

# 권한 수정
chmod 755 be/logs/
```

#### 4. 의존성/빌드 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install

# 서버 빌드 시 dist 오류 방지 (ensureBuilt + 안전 복사)
# 최신 build-server.js는 dist가 없거나 비어 있으면 자동 빌드 보강 후 cp -a로 복사합니다.
```

### 로그 확인
```bash
# 최신 로그 확인
tail -n 50 be/logs/app-$(date +%Y-%m-%d).log

# 에러 로그 확인
grep -i error be/logs/app-$(date +%Y-%m-%d).log
```

## 📚 13. API 문서

### 인증 API
- `POST /api/user/login` - 사용자 로그인
- `POST /api/user/register` - 사용자 회원가입
- `POST /api/user/refresh` - 토큰 갱신
- `GET /api/user/profile` - 사용자 프로필 조회

### 관리자 API
- `GET /api/admin/users` - 사용자 목록 조회
- `POST /api/admin/users` - 사용자 생성
- `PUT /api/admin/users/:id` - 사용자 정보 수정
- `DELETE /api/admin/users/:id` - 사용자 삭제

### 공통 API
- `GET /api/common/version` - 서버 버전 정보
- `GET /api/common/health` - 서버 상태 확인
- `GET /api/common/jwt-config` - JWT 설정 정보

## 📋 14. 전체 명령어 구조 정리

### 로컬용 vs 서버용 명령어 구분

| 구분 | 로컬용 (OS 자동 분기) | 서버용 (Linux 전용) |
|------|---------------------|-------------------|
| **설정** | `npm run setup` | - |
| **빌드** | `npm run build` | `npm run build:server` |
| **개발 서버** | `npm run dev:be`, `npm run dev:fe` | - |
| **배포** | `npm run deploy` | `npm run deploy:server` |
| **서버 시작** | `npm run start:be`, `npm run start:fe` | `npm run start:server:be`, `npm run start:server:fe` |

### 배포 플로우 비교

#### 기존 방식 (로컬 → 서버)
```bash
# 로컬에서 실행
npm run build          # 로컬에서 빌드
npm run deploy         # 로컬 → 서버 배포
```

#### 새로운 방식 (서버 → 서버)
```bash
# 빌드 서버에서 실행
npm run build:server   # Git pull + 빌드 + 배포 폴더 복사 (ensureBuilt + cp -a)

# 기동 서버에서 실행  
npm run deploy:server  # 빌드 서버 → 기동 서버 배포
npm run start:server:be # 서버 시작
```

### 환경 변수 설정 가이드 (요약)
- 빌드 서버: `SOURCE_PATH`, `DEPLOY_PATH`, `GIT_*`, `NPM_CONFIG_PRODUCTION`
- 기동 서버: `PROD_*_PATH`, `PM2_APP_NAME_BE`, `NGINX_CONFIG_PATH`

## 🔎 15. 버전/빌드 정보 출력

- 빌드 시: `script/build-server.js`가 시작 시 버전 정보(Backend/Frontend/Common, Git 태그)를 STDOUT에 출력
- 실행 시: `script/start-server-*.js`가 각 앱 `package.json` 버전과 `dist/build-info.json`의 빌드 시간을 STDOUT에 출력
- 수동 확인:
```bash
# BE/FE 버전
cat be/package.json | grep "\"version\""
cat fe/package.json | grep "\"version\""

# Common 버전 (설치본)
cd /var/www/iitp-dabt-admin/be && npm list @iitp-dabt/common
cd /var/www/iitp-dabt-admin/fe && npm list @iitp-dabt/common

# 빌드 시간 (실행 서버)
cat /var/www/iitp-dabt-admin/be/dist/build-info.json | grep buildDate || true
cat /var/www/iitp-dabt-admin/fe/dist/build-info.json | grep buildDate || true
```

