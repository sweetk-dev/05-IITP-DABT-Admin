# BE (Backend) - 장애인 자립 생활 지원 플랫폼 API 센터

## 빌드 스크립트 안내

### BE 빌드
```sh
./scripts/build.sh
```
- BE 소스 빌드 (자동으로 common도 빌드)
- 매번 clean build 수행 (dist 폴더 삭제 후 빌드)

### 전체 빌드 (common, be, fe)
```sh
./scripts/build-all.sh
```
- common, be, fe를 순서대로 빌드
- 매번 clean build 수행

## TypeScript 프로젝트 빌드 안내

- tsc가 인식되지 않는 경우, 아래처럼 npx로 실행하세요:
  ```sh
  npx tsc --build
  ```
- 공통 패키지(packages/common)만 별도 빌드:
  ```sh
  cd ../../packages/common
  npx tsc --build
  ```
- BE만 빌드해도 TypeScript가 자동으로 공통 패키지를 먼저 빌드합니다:
  ```sh
  npx tsc --build
  ```
- 루트에 tsconfig.json이 있으면 전체를 한 번에 빌드할 수 있습니다:
  ```sh
  cd ../..
  npx tsc --build
  ```

## 로그 레벨 지정 방법

- 운영/개발 모두 .env 파일에 LOG_LEVEL을 추가하세요.
  예시:
  ```env
  LOG_LEVEL=info      # 개발
  LOG_LEVEL=warn      # 운영
  ```
- 서버 실행 스크립트(start-dev.sh, start-prod.sh)는 .env 파일을 자동으로 로드합니다.
- 지원 레벨: error, warn, info, debug 등

## 서버 설치 및 실행 순서

1. 최초 환경 세팅(모든 의존성 설치, logs 디렉토리 생성 등)
   ```sh
   ./scripts/setup.sh
   ```
   > `setup.sh` 스크립트는 `package.json` 의존성 외에 `sequelize`, `winston`, `morgan`, `prompt-sync` 등 모든 필수 패키지를 자동으로 설치합니다.

2. 서버 실행
   - 개발 환경: 
     ```sh
     ./scripts/start-dev.sh
     ```
   - 운영(프로덕션) 환경:
     ```sh
     export ENC_SECRET=복호화키
     ./scripts/start-prod.sh
     ```
     > 운영 환경에서는 .env 파일에 ENC_SECRET을 두지 말고, 반드시 export로만 주입하세요.

> setup.sh는 최초 1회(또는 패키지/환경 변경 시)만 실행하면 됩니다.
> 서버 실행은 start-dev.sh/start-prod.sh로 환경에 맞게 실행하세요.

## 로그 관리 정책

- 모든 로그는 logs/ 폴더에 일자별(app-YYYY-MM-DD.log, access-YYYY-MM-DD.log)로 저장됩니다.
- Application Log(app-YYYY-MM-DD.log): 비즈니스/에러/시스템 로그 (appLogger)
- Access Log(access-YYYY-MM-DD.log): HTTP 요청/응답 로그 (accessLogger, morgan)
- 로그는 30일간 보관되며, 이후 자동 삭제됩니다.
- 로그 레벨은 환경변수 LOG_LEVEL로 제어합니다. (예: info, error, warn, debug)
- 로그 포맷 예시:
  ```
  [2024-07-22T13:45:30.123Z] [INFO] [userService.ts:register] 회원가입 성공: userId=123
  [2024-07-22T13:45:31.456Z] [ERROR] [userController.ts:checkEmail] 이메일 중복 에러: ...
  [2024-07-22T13:45:32.789Z] GET /api/user/email/check 200 - 12ms
  ```
- 로그에 파일명:함수명을 포함하려면 appLogger 사용 시 메시지에 명시하세요.
- logger 유틸: src/utils/logger.ts

## 환경 구분(NODE_ENV) 및 .env 예시

- .env 파일에 NODE_ENV를 반드시 명시하세요.
- 예시:
  ```env
  NODE_ENV=development   # 또는 production
  DB_HOST=localhost
  DB_USER=...
  DB_PASSWORD=ENC(...)
  ENC_SECRET=...
  ```
- 코드에서는 `process.env.NODE_ENV`로 환경(운영/개발/테스트 등)을 구분할 수 있습니다.

## ENC_SECRET 관리 권장 사항

- **개발/테스트 환경:** .env 파일에 ENC_SECRET 저장 가능
- **운영/프로덕션 환경:** .env 파일에 저장하지 말고, 환경 변수(서버/배포 환경에서만 주입)로만 관리하세요
  - 예: export ENC_SECRET=... (리눅스)
  - Docker/K8s secret 등 보안 환경 변수로 주입

## 환경 변수 암호화(ENC) 사용 안내

- .env 파일에 DB 비밀번호 등 민감 정보는 `ENC(암호화된문자열)` 형태로 저장할 수 있습니다.
- 복호화 키는 `ENC_SECRET` 환경 변수에 저장해야 하며, 서버 실행 시 자동 복호화됩니다.
- 암호화된 문자열을 만들려면 아래 스크립트를 사용하세요:
  ```sh
  npm install prompt-sync   # ← 반드시 최초 1회 설치
  export ENC_SECRET=복호화키
  node scripts/encrypt-env.js
  ```
  (또는, 실행 중 프롬프트에서 복호화 키를 입력할 수도 있습니다)
  프롬프트에 따라 암호화할 값과 복호화 키를 입력하면 `ENC(암호화된문자열)`이 출력됩니다.
- 예시:
  ```env
  DB_PASSWORD=ENC(암호화된문자열)
  ENC_SECRET=복호화키
  ```
- 복호화 로직은 `src/utils/decrypt.ts`에 구현되어 있습니다.

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