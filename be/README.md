# BE (Backend) - 장애인 자립 생활 지원 플랫폼 API 센터

## 공통 코드(유틸) 사용 안내

- 이메일/비밀번호 패턴 검증 등은 `packages/common/validation`에서 import해서 사용하세요.
- TypeScript paths가 설정되어 있어야 정상 동작합니다.

## 1. 개요
Express + PostgreSQL 기반의 API 서버입니다. JWT 인증, 사용자/관리자 관리, Open API 제공 등 주요 기능을 담당합니다.

## 2. 주요 요구사항 및 기능
- 사용자/관리자 인증 및 권한 관리
- Open API 클라이언트 관리
- FAQ, QnA, 공지사항 등 콘텐츠 제공
- API 버전 및 빌드 정보 제공

## 3. 개발 환경 및 주요 라이브러리
- Node.js (권장: v18.x 또는 v20.x)
- Express
- PostgreSQL
- TypeScript
- JWT, bcryptjs, dotenv 등

## 4. 환경설정 및 실행

### 4-1. 의존성 설치
```sh
npm install
```

### 4-2. 환경 변수 설정
- `.env.dev`, `.env.prod` 등 환경별 파일을 생성하여 사용하세요.
- 예시:
  ```env
  PORT=30000
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=your_db_name
  JWT_SECRET=your_jwt_secret
  ```

### 4-3. 빌드 및 실행
- 개발:
  ```sh
  npm run dev
  ```
- 운영 빌드 및 실행:
  ```sh
  npm run build
  npm start
  # 또는
  npm run prod
  ```

### 4-4. 빌드 정보 자동 생성
- `npm run build` 시 `build-info.json`이 자동 생성되어, API에서 빌드 버전/날짜를 확인할 수 있습니다.

## 5. API 버전/빌드 정보 확인
- `GET /api/comm/version` 호출 시 다음과 같은 정보가 반환됩니다:
  ```json
  {
    "version": "1.0.0",
    "buildDate": "2024-07-21 22:15:30.123"
  }
  ```

## 6. 기타 참고
- pm2 등 프로세스 매니저 사용 권장
- 환경별 .env 파일은 git에 커밋하지 않도록 주의하세요
- 자세한 라우팅/컨트롤러 구조는 src/ 디렉토리 참고

---

문의: 프로젝트 관리자 또는 이슈 게시판 이용 