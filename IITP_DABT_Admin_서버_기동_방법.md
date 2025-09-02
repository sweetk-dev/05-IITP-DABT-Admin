# 🚀 IITP DABT Admin 프로젝트 서버 기동 방법

이 프로젝트는 **Backend (Node.js + Express)**와 **Frontend (React + Vite)**로 구성된 풀스택 애플리케이션입니다.

## 📋 사전 요구사항

- **Node.js**: 18.x 이상
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
```bash
cd fe
npm run build
npm run preview
```

## 🌐 5. 서비스 접속

- **Backend API**: `http://localhost:30000`
- **Frontend**: `http://localhost:5173` (개발) 또는 `http://localhost:4173` (프로덕션)

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

### 로컬에서 원격 서버로 배포 (기존 방식)

#### 전체 배포
```bash
# 환경 변수 설정
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-backend
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-frontend

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
export SOURCE_PATH=/var/www/iitp-dabt-admin
export DEPLOY_PATH=/var/www/iitp-dabt-deploy
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main

# 전체 빌드 (Git pull + 빌드 + 배포 폴더 복사)
npm run build:server
```

##### 개별 빌드
```bash
# Backend만 빌드
npm run build:server:be

# Frontend만 빌드
npm run build:server:fe

# Common 패키지만 빌드
npm run build:server:common
```

#### 기동 서버에서 실행

##### 전체 배포
```bash
# 환경 변수 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/var/www/iitp-dabt-deploy
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_BE_PATH=/var/www/iitp-dabt-backend
export PROD_FE_PATH=/var/www/iitp-dabt-frontend

# 전체 배포 (빌드 서버 → 기동 서버)
npm run deploy:server
```

##### 개별 배포
```bash
# Backend만 배포
npm run deploy:server:be

# Frontend만 배포
npm run deploy:server:fe

# Common 패키지만 배포
npm run deploy:server:common
```

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

### 배포 전 환경 변수 설정

#### 로컬 배포용
```bash
# Backend 서버 설정
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-backend

# Frontend 서버 설정
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-frontend
```

#### 서버 빌드용
```bash
# 빌드 서버 설정
export SOURCE_PATH=/var/www/iitp-dabt-admin
export DEPLOY_PATH=/var/www/iitp-dabt-deploy
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main
```

#### 서버 배포용
```bash
# 빌드 서버 설정
export BUILD_SERVER_HOST=build-server.com
export BUILD_SERVER_USER=builduser
export BUILD_SERVER_PATH=/var/www/iitp-dabt-deploy

# 기동 서버 설정
export PROD_SERVER_HOST=prod-server.com
export PROD_SERVER_USER=produser
export PROD_BE_PATH=/var/www/iitp-dabt-backend
export PROD_FE_PATH=/var/www/iitp-dabt-frontend
export PM2_APP_NAME_BE=iitp-dabt-backend
export FRONTEND_DOMAIN=your-domain.com
export NGINX_CONFIG_PATH=/etc/nginx/sites-available/iitp-dabt-frontend
```

## 🛠️ 9. 개발 가이드

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

## 🔒 10. 보안 설정

### JWT 인증
- **Access Token**: 15분 만료
- **Refresh Token**: 7일 만료
- **자동 갱신**: Access Token 만료 5분 전 자동 갱신

### 비밀번호 보안
- **해싱**: bcryptjs (salt rounds: 10)
- **검증**: 공통 패키지의 `isValidPassword` 함수 사용

### 환경 변수 암호화
```bash
# 환경 변수 암호화
node scripts/encrypt-env.js <encryption-key>
```

## 🐛 11. 문제 해결

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

#### 4. 의존성 문제
```bash
# node_modules 삭제 후 재설치
rm -rf node_modules package-lock.json
npm install
```

### 로그 확인
```bash
# 최신 로그 확인
tail -n 50 be/logs/app-$(date +%Y-%m-%d).log

# 에러 로그 확인
grep -i error be/logs/app-$(date +%Y-%m-%d).log
```

## 📚 12. API 문서

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

## 📋 13. 전체 명령어 구조 정리

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
npm run build:server   # Git pull + 빌드 + 배포 폴더 복사

# 기동 서버에서 실행  
npm run deploy:server  # 빌드 서버 → 기동 서버 배포
npm run start:server:be # 서버 시작
```

### 환경 변수 설정 가이드

#### 로컬 개발용
```bash
# .env 파일에 설정
NODE_ENV=development
PORT=30000
DB_HOST=localhost
# ... 기타 설정
```

#### 서버 빌드용
```bash
# 빌드 서버 환경 변수
export SOURCE_PATH=/var/www/iitp-dabt-admin
export DEPLOY_PATH=/var/www/iitp-dabt-deploy
export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git
export GIT_BRANCH=main
```

#### 서버 배포용
```bash
# 기동 서버 환경 변수
export BUILD_SERVER_HOST=build-server.com
export PROD_SERVER_HOST=prod-server.com
export PROD_BE_PATH=/var/www/iitp-dabt-backend
export PROD_FE_PATH=/var/www/iitp-dabt-frontend
export PM2_APP_NAME_BE=iitp-dabt-backend
export FRONTEND_DOMAIN=your-domain.com
```

## 🔍 14. 모니터링

### 헬스 체크
```bash
curl http://your-server:30000/api/common/health
```

### 성능 모니터링
- **API 응답 시간**: Morgan 액세스 로그
- **메모리 사용량**: Node.js 내장 모니터링
- **데이터베이스 성능**: Sequelize 로깅

## 📞 15. 지원

문제가 발생하거나 질문이 있으시면:

1. **로그 확인**: `be/logs/` 디렉토리의 로그 파일 확인
2. **문서 참조**: 각 디렉토리의 README.md 파일 참조
3. **이슈 등록**: GitHub Issues에 등록

---

**IITP DABT Admin Team** © 2024
