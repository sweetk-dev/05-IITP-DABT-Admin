# IITP DABT Admin - Backend

IITP DABT Admin 시스템의 Backend API 서버입니다.

## 📋 개요

Node.js + Express + Sequelize 기반의 REST API 서버로, 사용자 인증, 관리자 기능, 시스템 모니터링 등의 기능을 제공합니다.

### 🏗️ 기술 스택

- **Runtime**: Node.js 18.x+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 12.x + Sequelize 6.x
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Logging**: Winston + Winston Daily Rotate File
- **HTTP Logging**: Morgan
- **Environment**: dotenv

## 🚀 빠른 시작

### 1. 사전 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **PostgreSQL**: 12.x 이상
- **Git**: 최신 버전

### 2. 설치 및 설정

#### 방법 1: 스크립트 사용 (권장)
```bash
# 자동으로 packages/common 의존성까지 처리
bash scripts/setup.sh
```

> **🖥️ OS 자동 감지**: Windows, Linux, macOS 환경에서 자동으로 적절한 스크립트를 실행합니다.

#### 방법 2: 수동 설정
```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 정보 입력

# 3. 공통 패키지 빌드 (필수)
cd ../packages/common && npm run build && cd ../../be

# 4. 개발 서버 실행
npm run dev
```

### 3. 프로덕션 실행

```bash
# 1. 빌드
npm run build

# 2. 프로덕션 서버 실행
npm run prod
```

## ⚙️ 환경 변수 설정

### .env 파일 생성

```bash
cp .env.example .env
```

### 필수 환경 변수

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

# CORS 설정 (설정하지 않으면 localhost는 기본 허용)
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

## 📁 프로젝트 구조

```
be/
├── src/
│   ├── controllers/          # 컨트롤러
│   │   ├── user/            # 사용자 관련 컨트롤러
│   │   ├── admin/           # 관리자 관련 컨트롤러
│   │   └── common/          # 공통 컨트롤러
│   ├── models/              # Sequelize 모델
│   ├── repositories/        # 데이터 접근 계층
│   ├── routes/              # 라우터
│   ├── services/            # 비즈니스 로직
│   ├── middleware/          # 미들웨어
│   ├── utils/               # 유틸리티
│   ├── types/               # TypeScript 타입 정의
│   └── index.ts             # 애플리케이션 진입점
├── scripts/                 # 빌드 및 유틸리티 스크립트
├── logs/                    # 로그 파일 (자동 생성)
├── dist/                    # 빌드 결과물
└── package.json
```

## 🗄️ 데이터베이스 설정

### PostgreSQL 설치 및 설정

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

### 테이블 생성

애플리케이션 실행 시 Sequelize가 자동으로 테이블을 생성합니다.

## 🔧 개발 가이드

### 스크립트 명령어

```bash
# 개발 서버 실행 (nodemon)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run prod

# 스크립트를 사용한 빌드 (packages/common 의존성 자동 처리)
bash scripts/build.sh

# 클린 빌드
npm run build:clean

# 전체 빌드 (공통 패키지 포함)
npm run build:all

# 비밀번호 해싱 테스트
npm run hash-password <password>
```

### 개발 서버 실행

```bash
npm run dev
```

서버가 `http://localhost:30000`에서 실행됩니다.

### API 테스트

```bash
# 서버 상태 확인
curl http://localhost:30000/api/common/health

# 버전 정보 확인
curl http://localhost:30000/api/common/version

# JWT 설정 확인
curl http://localhost:30000/api/common/jwt-config
```

## 📚 API 문서

### 인증 API

#### 사용자 로그인
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 사용자 회원가입
```http
POST /api/user/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "홍길동",
  "affiliation": "한국정보통신기술협회"
}
```

#### 토큰 갱신
```http
POST /api/user/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

#### 사용자 프로필 조회
```http
GET /api/user/profile
Authorization: Bearer your-access-token
```

### 관리자 API

#### 사용자 목록 조회
```http
GET /api/admin/users?page=1&limit=10
Authorization: Bearer your-admin-token
```

#### 사용자 생성
```http
POST /api/admin/users
Authorization: Bearer your-admin-token
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "Password123!",
  "name": "새사용자",
  "affiliation": "소속기관"
}
```

### 공통 API

#### 서버 버전 정보
```http
GET /api/common/version
```

#### 서버 상태 확인
```http
GET /api/common/health
```

#### JWT 설정 정보
```http
GET /api/common/jwt-config
```

## 🔒 보안

### JWT 인증

- **Access Token**: 15분 만료
- **Refresh Token**: 7일 만료
- **자동 갱신**: Access Token 만료 5분 전 자동 갱신

### 비밀번호 보안

- **해싱**: bcryptjs (salt rounds: 10)
- **검증**: 공통 패키지의 `isValidPassword` 함수 사용

### 환경 변수 암호화

중요한 환경 변수는 암호화하여 저장할 수 있습니다.

```bash
# 환경 변수 암호화
node scripts/encrypt-env.js <encryption-key>
```

## 📊 로깅

### 로그 설정

- **로그 레벨**: `LOG_LEVEL` 환경 변수로 설정
- **로그 파일**: `logs/` 디렉토리에 일별 저장
- **보관 기간**: 30일

### 로그 레벨

- `error`: 에러만 기록
- `warn`: 경고 이상 기록
- `info`: 정보 이상 기록 (기본값)
- `debug`: 모든 로그 기록

### 로그 형식

```
[2024-01-15 10:30:45] [INFO] [userController.ts:25] User login attempt: user@example.com
```

## 🛠️ 유틸리티

### 비밀번호 해싱 도구

관리자 계정 초기 설정을 위한 비밀번호 해싱 도구를 제공합니다.

```bash
npm run hash-password "admin123"
```

출력 예시:
```
=== 비밀번호 해싱 테스트 ===

1. 비밀번호 해싱 중...
   평문 비밀번호: admin123 (길이: 8)
   해싱된 비밀번호: $2a$10$... (길이: 60)
   Salt Rounds: 10

2. SQL INSERT 문 생성:
INSERT INTO open_api_user (loginId, userName, password, isAdmin, createdAt, updatedAt) 
VALUES ('admin@example.com', '관리자', '$2a$10$...', true, NOW(), NOW());

3. 비밀번호 검증 테스트:
   검증 결과: ✅ 성공
   잘못된 비밀번호 검증: ✅ 성공 (올바르게 거부됨)

=== 테스트 완료 ===
```

## 🚀 배포

### 프로덕션 빌드

```bash
# 1. 의존성 설치
npm install --production

# 2. 공통 패키지 빌드
cd ../packages/common && npm run build && cd ../../be

# 3. 애플리케이션 빌드
npm run build

# 4. 프로덕션 서버 실행
npm run prod
```

### Docker 배포 (선택사항)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY scripts ./scripts

EXPOSE 30000

CMD ["npm", "run", "prod"]
```

### 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수들을 반드시 설정해야 합니다:

```bash
export NODE_ENV=production
export DB_HOST=your-db-host
export DB_PORT=5432
export DB_NAME=your-db-name
export DB_USER=your-db-user
export DB_PASSWORD=your-db-password
export JWT_SECRET=your-super-secret-jwt-key
export ENC_SECRET=your-encryption-secret
export LOG_LEVEL=warn
```

## 🔍 모니터링

### 헬스 체크

```bash
curl http://your-server:30000/api/common/health
```

### 로그 모니터링

```bash
# 실시간 로그 확인
tail -f logs/app-2024-01-15.log

# 에러 로그만 확인
grep "ERROR" logs/app-2024-01-15.log
```

### 성능 모니터링

- **API 응답 시간**: Morgan 액세스 로그
- **메모리 사용량**: Node.js 내장 모니터링
- **데이터베이스 성능**: Sequelize 로깅

## 🐛 문제 해결

### 일반적인 문제

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
ls -la logs/

# 권한 수정
chmod 755 logs/
```

### 로그 확인

```bash
# 최신 로그 확인
tail -n 50 logs/app-$(date +%Y-%m-%d).log

# 에러 로그 확인
grep -i error logs/app-$(date +%Y-%m-%d).log
```

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. **로그 확인**: `logs/` 디렉토리의 로그 파일 확인
2. **문서 참조**: 이 README.md 파일 참조
3. **이슈 등록**: GitHub Issues에 등록

---

**IITP DABT Admin Backend Team** © 2024 