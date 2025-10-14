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

### 로컬 개발 빌드

```bash
# 전체 빌드 (권장)
npm run build

# 개별 빌드
npm run build:be
npm run build:fe
npm run build:common
```

> **🖥️ OS 자동 감지**: Windows, Linux, macOS 환경에서 자동으로 적절한 스크립트를 실행합니다.

### 배포

#### 로컬 → 서버 배포 (개발/테스트용)
```bash
npm run deploy        # 전체 배포
npm run deploy:be     # Backend만
npm run deploy:fe     # Frontend만
```

환경 변수 상세는 **[script/README.md](script/README.md)** 참조

#### 서버 간 배포 (프로덕션 권장)
**빌드 서버:**
```bash
npm run build:server           # 전체 빌드
# 또는 개별 빌드
npm run build:server:common    # Common만
npm run build:server:be        # Backend만
npm run build:server:fe        # Frontend만
```

**실행 서버:**
```bash
# 최초 1회
npm run deploy:server:ops

# 전체 배포
npm run deploy:server
npm run start:server:be
npm run restart:server:fe

# 개별 배포
npm run deploy:server:common && npm run restart:server:be  # Common만
npm run deploy:server:be && npm run restart:server:be      # BE만
npm run deploy:server:fe && npm run restart:server:fe      # FE만
```

> **환경 변수 파일(.env) 역할:**
> - **Backend**: 실행 시 필수 (`/var/www/iitp-dabt-admin/be/.env`)
> - **Frontend**: 빌드 시 조건부 필요 (서브패스 배포 시)
>   - 시나리오 A (독립 도메인): 설정 불필요
>   - 시나리오 B (서브패스 `/adm/`): `VITE_BASE=/adm/`, `VITE_API_BASE_URL=/adm/api` 필요

상세 가이드:
- **서버 배포 상세**: [script/README-SERVER-DEPLOYMENT.md](script/README-SERVER-DEPLOYMENT.md)
- **단계별 기동 튜토리얼**: [IITP_DABT_Admin_서버_기동_방법.md](IITP_DABT_Admin_서버_기동_방법.md)
- **환경 변수 전체**: [script/env-guide.md](script/env-guide.md)

### 테스트

```bash
# Backend 테스트
cd be && npm test

# Frontend 테스트
cd fe && npm test
```

## 📚 API 문서

주요 API 엔드포인트:
- 인증: 로그인, 회원가입, 토큰 갱신, 프로필 조회
- 관리자: 사용자 CRUD, 운영자 관리, FAQ/QNA/공지사항 관리
- 공통: 버전 정보, 헬스 체크, JWT 설정

상세 API 문서는 **[be/README.md](be/README.md)**를 참조하세요.

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

## 🔄 배포 요약 (서버 간)

- 실행 위치
  - 아래 npm 스크립트들은 “프로젝트 루트”에서 실행해야 합니다. (루트 package.json에 정의)
  - 대안: 개별 스크립트를 직접 실행 `node script/<file>.js`

- 명령어
  - 전체 빌드(빌드 서버): `npm run build:server`
  - 운영 스크립트 배포(최초 1회 또는 변경 시): `npm run deploy:server:ops`
  - 전체 배포(빌드→실행): `npm run deploy:server`
  - 기동: `npm run start:server:be`, `npm run start:server:fe`
  - 재시작: `npm run restart:server:be`, `npm run restart:server:fe`
  - 중지: `npm run stop:server:be`, `npm run stop:server:fe`

- 권장 실행 순서
```bash
npm run build:server
npm run deploy:server:ops   # 최초 1회 또는 스크립트 변경 시
npm run deploy:server
npm run start:server:be
npm run start:server:fe
```

자세한 내용은 `script/README-SERVER-DEPLOYMENT.md`를 참조하세요.

> **PM2 자동 기동 설정**: 서버 재부팅 후 자동 복구가 필요하다면 **[IITP_DABT_Admin_서버_기동_방법.md](IITP_DABT_Admin_서버_기동_방법.md#24-재부팅-자동-기동-설정-pm2)** 또는 **[script/README-SERVER-DEPLOYMENT.md](script/README-SERVER-DEPLOYMENT.md#-재부팅-자동-기동-설정-pm2)**를 참조하세요.

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