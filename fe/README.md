# React + TypeScript + Vite

## 빌드 스크립트 안내

### FE 빌드
```sh
./scripts/build.sh
```
- FE 소스 빌드 (자동으로 common도 빌드)
- 매번 clean build 수행 (dist 폴더 삭제 후 빌드)

### 전체 빌드 (common, be, fe)
```sh
../be/scripts/build-all.sh
```
- common, be, fe를 순서대로 빌드
- 매번 clean build 수행

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## 프론트엔드 라우터 구조

| URL | 컴포넌트 | 설명 |
|-----|----------|------|
| `/` | Home | 메인 홈 화면 |
| `/notice` | NoticeList | 공지사항 목록 |
| `/notice/:id` | NoticeDetail | 공지사항 상세 |
| `/faq` | FaqList | FAQ 목록 |
| `/faq/:id` | FaqDetail | FAQ 상세 |
| `/qna` | QnaList | QnA 목록 |
| `/qna/:id` | QnaDetail | QnA 상세 |
| `/login` | Login | 로그인 |
| `/register` | Register | 회원가입 |
| `/dashbd` | UserDashboard | 사용자 대시보드 |
| `/mng/openapi` | OpenApiManagement | 오픈API 관리 |
| `/profile` | UserProfile | 사용자 프로필/정보 |
| `/admin` | AdminDashboard | 관리자 대시보드 |
| `/admin/users` | UserManagement | 사용자 관리(목록) |
| `/admin/users/:id` | UserDetail | 사용자 상세/수정 |
| `/admin/openapi/clients` | ApiClientManagement | API 클라이언트 관리(목록) |
| `/admin/openapi/clients/:id` | ApiClientDetail | API 클라이언트 상세 |
| `/admin/openapi/requests` | ApiRequestManagement | Open API 신청/요청 관리(목록) |
| `/admin/openapi/requests/:id` | ApiRequestDetail | Open API 신청/요청 상세 |
| `/admin/notices` | AdminNoticeList | 관리자 공지 목록 |
| `/admin/notices/create` | AdminNoticeCreate | 관리자 공지 생성 |
| `/admin/notices/:id` | AdminNoticeDetail | 관리자 공지 상세 |
| `/admin/notices/:id/edit` | AdminNoticeEdit | 관리자 공지 수정 |
| `/admin/faqs` | AdminFaqList | 관리자 FAQ 목록 |
| `/admin/faqs/create` | AdminFaqCreate | 관리자 FAQ 생성 |
| `/admin/faqs/:id` | AdminFaqDetail | 관리자 FAQ 상세 |
| `/admin/faqs/:id/edit` | AdminFaqEdit | 관리자 FAQ 수정 |
| `/admin/qnas` | AdminQnaList | 관리자 QnA 목록 |
| `/admin/qnas/:id` | AdminQnaDetail | 관리자 QnA 상세 |
| `/admin/qnas/:id/edit` | AdminQnaEdit | 관리자 QnA 답변/수정 |

### 라우팅 설계 원칙
- 목록은 복수형(`/notices`, `/faqs`, `/qnas`, `/users` 등)
- 상세는 파라미터(`/notices/:id`)
- 생성/수정은 `/create`, `/edit` 등 액션 명시
- 관리자/사용자/공개 URL 명확히 분리(`/admin/` prefix)
- 404는 모든 미정의 경로를 홈으로 리다이렉트

## 로컬 개발 서버 접속 안내

- 로컬 개발 시: [http://localhost:5173/](http://localhost:5173/) (기본 포트)
- dev, prod 환경에서는 [http://localhost:40000/](http://localhost:40000/) 으로 동작하도록 설정되어 있습니다.
- 포트는 vite.config.ts와 .env 파일로 환경별로 쉽게 변경할 수 있습니다.

### 포트 변경 방법

1. **vite.config.ts**에서 아래처럼 설정:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
  },
});
```

2. **.env 파일**을 환경별로 생성:

- `.env.development`
  ```
  VITE_PORT=5173
  ```
- `.env.production` 및 `.env.dev`
  ```
  VITE_PORT=40000
  ```

3. **실행 시 자동 적용**
- 개발: `npm run dev` (5173)
- 배포: `npm run build` 후 서버에서 40000 포트로 서비스

# FE (Frontend)

## TypeScript 프로젝트 빌드 안내 (모노레포)

- tsc가 인식되지 않는 경우, 아래처럼 npx로 실행하세요:
  ```sh
  npx tsc --build
  ```
- 공통 패키지(packages/common)만 별도 빌드:
  ```sh
  cd ../packages/common
  npx tsc --build
  ```
- FE만 빌드해도 TypeScript가 자동으로 공통 패키지를 먼저 빌드합니다:
  ```sh
  npx tsc --build
  ```
- 루트에 tsconfig.json이 있으면 전체를 한 번에 빌드할 수 있습니다:
  ```sh
  cd ..
  npx tsc --build
  ```

## FE(프론트엔드) 기동 스크립트

- 개발 서버 실행: `npm run dev`
- 프로덕션 빌드: `npm run build`
- 빌드 결과물 실행(프리뷰): `npm run preview`

## 공통 코드(유틸) 사용 안내

- 이메일/비밀번호 패턴 검증 등은 `packages/common/validation`에서 import해서 사용하세요.
- TypeScript paths가 설정되어 있어야 정상 동작합니다.
