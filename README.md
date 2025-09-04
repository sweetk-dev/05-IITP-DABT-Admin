# IITP DABT Admin

IITP DABT (Data API Business Tool) Admin 시스템입니다.

## 📋 프로젝트 개요

이 프로젝트는 IITP DABT 시스템의 관리자 인터페이스로, 사용자 관리, API 키 관리, 시스템 모니터링 등의 기능을 제공합니다.

### 🏗️ 아키텍처

```
05-IITP-DABT-Admin/
├── packages/
│   └── common/          # BE/FE 공통 유틸리티
├── be/                  # Backend (Node.js + Express + Sequelize)
├── fe/                  # Frontend (React + TypeScript + Vite)
└── README.md           # 이 파일
```

## 🚀 빠른 시작

### 1. 사전 요구사항

- **Node.js**: 22.x 이상
- **npm**: 9.x 이상
- **PostgreSQL**: 12.x 이상
- **Git**: 최신 버전

### 2. 프로젝트 클론

```bash
git clone <repository-url>
cd 05-IITP-DABT-Admin
```

### 3. 전체 프로젝트 설정 (권장)

```bash
# 전체 프로젝트 한 번에 설정 (OS 자동 감지)
npm run setup
```

> **🖥️ OS 자동 감지**: Windows, Linux, macOS 환경에서 자동으로 적절한 스크립트를 실행합니다.

또는 개별 설정:

```bash
# 공통 패키지 설정
cd packages/common && npm install && npm run build

# Backend 설정
cd ../../be && bash scripts/setup.sh

# Frontend 설정  
cd ../fe && bash scripts/setup.sh
```

### 4. 개발 서버 실행

```bash
# Backend 개발 서버
npm run dev:be
# 또는
cd be && npm run dev

# Frontend 개발 서버
npm run dev:fe
# 또는
cd fe && npm run dev
```

## 📁 프로젝트 구조

### packages/common
공통 유틸리티 패키지로, Frontend와 Backend에서 공통으로 사용되는 검증 함수들과 타입 정의를 제공합니다.

**주요 기능:**
- 이메일/비밀번호 검증
- 이름/소속 검증
- 비밀번호 강도 측정

**사용법:**
```typescript
import { isValidEmail, isValidPassword } from '@iitp-dabt/common';
```

### be/ (Backend)
Node.js + Express + Sequelize 기반의 REST API 서버입니다.

**주요 기능:**
- 사용자 인증/인가 (JWT)
- 사용자 관리 (회원가입, 로그인, 프로필)
- API 키 관리
- 시스템 모니터링

**기술 스택:**
- Node.js + Express
- TypeScript
- PostgreSQL + Sequelize
- JWT 인증
- Winston 로깅

### fe/ (Frontend)
React + TypeScript + Vite 기반의 관리자 웹 인터페이스입니다.

**주요 기능:**
- 사용자 로그인/회원가입
- 대시보드
- 사용자 프로필 관리
- API 키 관리

**기술 스택:**
- React 18.x
- TypeScript
- Vite 5.x
- Material-UI (MUI) 5.x
- React Router 6.x

## 🔧 상세 설정

각 워크스페이스의 상세한 설정 방법은 해당 README 파일을 참조하세요:

- **[packages/common/README.md](packages/common/README.md)**: 공통 패키지 설정 및 API 문서
- **[be/README.md](be/README.md)**: Backend 설정, API 문서, 데이터베이스 설정
- **[fe/README.md](fe/README.md)**: Frontend 설정, 컴포넌트 문서, 페이지 구조
- **[script/README.md](script/README.md)**: 배포 스크립트 가이드
- **[script/env-guide.md](script/env-guide.md)**: 환경 변수 설정 가이드
- **[script/README-SERVER-DEPLOYMENT.md](script/README-SERVER-DEPLOYMENT.md)**: 서버 간 배포 전체 가이드(빌드 서버/실행 서버 설정, 버전/빌드 정보 출력, 플로우 다이어그램 포함)

## 🛠️ 개발 가이드

### 개발 환경 설정

1. **공통 패키지 개발**
   ```bash
   cd packages/common
   npm run dev  # watch 모드
   ```

2. **Backend 개발**
   ```bash
   cd be
   npm run dev  # nodemon으로 자동 재시작
   ```

3. **Frontend 개발**
   ```bash
   cd fe
   npm run dev  # Vite 개발 서버
   ```

### 빌드

1. **전체 빌드 (권장)**
   ```bash
   npm run build
   ```
   
   > **🖥️ OS 자동 감지**: Windows, Linux, macOS 환경에서 자동으로 적절한 스크립트를 실행합니다.

2. **개별 빌드**
   ```bash
   # 공통 패키지
   cd packages/common && npm run build
   
   # Backend
   cd be && npm run build
   
   # Frontend
   cd fe && npm run build
   ```

### 배포

#### 1. 전체 배포 (권장)
```bash
npm run deploy
```

> **🖥️ OS 자동 감지**: Windows, Linux, macOS 환경에서 자동으로 적절한 배포 스크립트를 실행합니다.

#### 2. 개별 배포
```bash
# Common 패키지만 배포
npm run deploy:common

# Backend만 배포
npm run deploy:be

# Frontend만 배포
npm run deploy:fe
```

#### 3. 배포 전 환경 변수 설정

**전체 배포용:**
```bash
# Backend 서버 설정
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-adm-be

# Frontend 서버 설정
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-adm-fe
```

**개별 배포용:**
```bash
# Common 패키지 배포용
export COMMON_HOST=your-common-server.com
export COMMON_USER=your-username
export COMMON_PATH=/var/www/iitp-dabt-common

# Backend 개별 배포용
export BE_HOST=your-backend-server.com
export BE_USER=your-username
export BE_PATH=/var/www/iitp-dabt-adm-be

# Frontend 개별 배포용
export FE_HOST=your-frontend-server.com
export FE_USER=your-username
export FE_PATH=/var/www/iitp-dabt-adm-fe
```

#### 4. 배포 과정

**전체 배포:**
- Common 패키지 배포 (개별 스크립트 호출)
- Backend 배포 (개별 스크립트 호출)
- Frontend 배포 (개별 스크립트 호출)

**개별 배포:**
- **Common**: packages/common 빌드 및 배포
- **Backend**: packages/common 의존성 확인 → Backend 빌드 → 배포 → 서버 재시작
- **Frontend**: packages/common 의존성 확인 → Frontend 빌드 → 배포

#### 5. 유지보수성

> **🔧 모듈화된 배포 시스템**: 통합 배포는 개별 배포 스크립트들을 호출하여 구성됩니다.
> 
> **장점:**
> - 배포 로직 변경 시 한 곳만 수정하면 모든 곳에 적용
> - 개별 배포와 통합 배포가 동일한 로직 사용
> - 코드 중복 최소화
> - 유지보수성 향상

### 테스트

```bash
# Backend 테스트
cd be && npm test

# Frontend 테스트
cd fe && npm test
```

## 📚 API 문서

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

## 🔒 보안

### 인증
- JWT 기반 인증
- Access Token (15분) + Refresh Token (7일)
- 자동 토큰 갱신

### 데이터 보호
- 비밀번호 bcrypt 해싱
- 환경 변수 암호화
- CORS 설정

## 📊 모니터링

### 로깅
- Winston 기반 구조화된 로깅
- 일별 로그 파일 로테이션
- 에러 추적 및 모니터링

### 성능
- API 응답 시간 모니터링
- 데이터베이스 쿼리 최적화
- 메모리 사용량 추적

## 🚀 배포

### 프로덕션 빌드

```bash
# 전체 프로덕션 빌드 (권장)
npm run build
```

### 환경 변수

프로덕션 환경에서는 다음 환경 변수들을 설정해야 합니다:

```bash
# Backend
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-jwt-secret
ENC_SECRET=your-encryption-secret
CORS_ORIGINS=https://your-frontend-domain.com,https://your-admin-domain.com

# Frontend
VITE_PORT=5173
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=10000
OPPEN_API_DOC_URL=https://your-openapi-doc-domain.com
```

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 다음 방법으로 문의해 주세요:

- **이슈 등록**: GitHub Issues
- **문서**: 각 디렉토리의 README.md 참조
- **개발팀**: 개발팀 내부 채널

---

**IITP DABT Admin Team** © 2024 