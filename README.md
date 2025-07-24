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

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **PostgreSQL**: 12.x 이상
- **Git**: 최신 버전

### 2. 프로젝트 클론

```bash
git clone <repository-url>
cd 05-IITP-DABT-Admin
```

### 3. 공통 패키지 빌드

```bash
cd packages/common
npm install
npm run build
```

### 4. Backend 설정 및 실행

```bash
cd ../../be
npm install
# 환경 변수 설정 (아래 Backend 섹션 참조)
npm run dev
```

### 5. Frontend 설정 및 실행

```bash
cd ../fe
npm install
npm run dev
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
import { isValidEmail, isValidPassword } from '@iitp/common';
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
- React 19
- TypeScript
- Vite
- Material-UI
- React Router

## 🔧 상세 설정

### Backend 설정

자세한 설정은 [be/README.md](be/README.md)를 참조하세요.

**주요 설정 항목:**
- 데이터베이스 연결
- 환경 변수 설정
- JWT 설정
- 로깅 설정

### Frontend 설정

자세한 설정은 [fe/README.md](fe/README.md)를 참조하세요.

**주요 설정 항목:**
- API 엔드포인트 설정
- 환경 변수 설정
- 빌드 설정

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

1. **전체 빌드**
   ```bash
   # 공통 패키지
   cd packages/common && npm run build
   
   # Backend
   cd ../../be && npm run build
   
   # Frontend
   cd ../fe && npm run build
   ```

2. **개별 빌드**
   - Backend: `cd be && npm run build`
   - Frontend: `cd fe && npm run build`

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
# 전체 프로덕션 빌드
cd packages/common && npm run build
cd ../../be && npm run build
cd ../fe && npm run build
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

# Frontend
VITE_API_BASE_URL=https://your-api-domain.com
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