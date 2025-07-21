# 05-IITP-DABT-Admin
5.장애인 자립 생활 지원 플랫폼 운영관리 SW

> **ℹ️ 자세한 백엔드 운영/설정은 [be/README.md](be/README.md) 파일을 참고하세요.**
> 
> **ℹ️ 자세한 프론트엔드 운영/설정은 [fe/README.md](fe/README.md) 파일을 참고하세요.**

## 1. 프로젝트 개요

이 프로젝트는 장애인 자립 생활 지원 플랫폼 API 센터의 Open API 및 사용자/관리자 관리를 위한 실용적이고 간단한 CMS입니다.

- **프론트엔드(React + Vite + Material UI)**
- **백엔드(Node.js + Express + PostgreSQL)**
- **Monorepo 구조(fe, be 폴더 분리, 루트에서 통합 관리)**
- **JWT 기반 인증(일반/관리자/어드민 권한 분리)**
- **운영/개발 모두 1개 포트로 서비스 가능(Express가 FE 빌드 파일과 API를 모두 서비스)**

---

## 2. 주요 요구사항 및 기능

### 201. 홈 화면
- 상단: 로고, 로그인/회원가입 버튼
- 서비스 소개, FAQ/문서 바로가기, 최근 공지사항 미리보기

### 2-2. 로그인/회원가입
- 일반 사용자: 홈에서 로그인/가입
- 관리자/어드민: 별도 링크로 로그인

### 2-3. 일반 유저 메뉴(로그인 후)
- 대시보드(내 API 키, 사용 현황)
- API 관리(신청/삭제)
- 개인정보 관리(정보/비번 변경, 탈퇴)
- FAQ, QnA

### 2-4. 관리자 메뉴
- 일반 사용자/어드민 관리(목록, 상세, 수정, 삭제, 계정 생성, 키 발급 이력)
- API Client 관리(신청 승인/반려/삭제, 사용 현황)
- 이력(키 발급, 관리자 작업)

### 2-55. FAQ, QnA, 공지사항
- 홈에 미리보기, 전체 페이지 별도 제공

### 2-66. 인증/보안
- JWT 기반 로그인/토큰 관리
- 권한별 접근 제어

---

## 3. 프로젝트 구성 
IITP-DABT-Admin 프로젝트는 React + Material UI 기반의 프론트엔드와 Express + PostgreSQL 백엔드로 구성된 관리 시스템입니다.

---

## 4. 폴더 구조

```
├── fe/   # 프론트엔드 (React + Material UI)
├── be/   # 백엔드 (Express + PostgreSQL)
├── README.md
├── .gitignore
```

---

## 5. 개발 환경 및 주요 라이브러리

### 5-1. 프론트엔드 (fe)
- cd fe
- [React](https://react.dev/)
- [Material UI (MUI)](https://mui.com/)
  - 설치:
    ```sh
    npm install @mui/material @emotion/react @emotion/styled
    ```
  - 아이콘 사용 시:
    ```sh
    npm install @mui/icons-material
    ```
- [TypeScript](https://www.typescriptlang.org/)
  - 설치:
    ```sh
    npm install -D typescript @types/react @types/react-dom
    ```

### 5-2. 백엔드 (be)
#### 5-2-1. 백엔드(BE) 개발 환경 구성 절차
1. **be 폴더 생성 및 초기화**
   ```sh
   mkdir be
   cd be
   npm init -y
   ```
2. **필수 패키지 설치**
   ```sh
   npm install express cors dotenv jsonwebtoken bcryptjs pg
   npm install --save-dev typescript @types/node @types/express ts-node nodemon
   npx tsc --init
   ```
3. **디렉토리 구조 생성**
   ```sh
   mkdir src
   cd src
   mkdir controllers models routes services
   type nul > index.ts  # (윈도우) 또는 touch index.ts (맥/리눅스)
   ```
4. **.env 파일 생성 및 DB 정보 입력**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=youruser
   DB_PASS=yourpassword
   DB_NAME=yourdb
   JWT_SECRET=your_jwt_secret
   ```
5. **기본 서버 코드 작성 (src/index.ts)**
   - Express 서버 생성, /health 라우트로 정상 동작 확인
6. **서버 실행**
   ```sh
   npx ts-node src/index.ts
   # 또는
   npm run dev
   ```

---

## 6. 개발/운영 방법

### 6-1. 프론트엔드(fe) 세팅 및 실행
```sh
cd fe
npm install           # 의존성 설치
npm run dev           # 개발 서버 실행 (기본: http://localhost:3000)
```

### 6-2. 백엔드(be) 세팅 및 실행
```sh
cd be
npm install           # 의존성 설치
npm run dev           # 개발 서버 실행 (기본: http://localhost:40000)
```

### 6-3. 전체 통합 운영
- Express 서버에서 React 빌드 파일과 API를 모두 40000 포트에서 서비스하도록 설정할 수 있습니다.
- 환경 변수(.env) 파일이 필요할 수 있습니다.

---

## 7. ".gitignore" 관리
- 루트, fe, be 폴더 각각에 .gitignore 파일을 두어 불필요한 파일(node_modules, build, .env 등)을 관리합니다.

---

## 8. 기타 참고 사항
- 권장 Node.js 버전: **v18.x 또는 v20.x (LTS)**
- 최신 Node.js(v22.x)에서는 일부 패키지 호환성 문제가 발생할 수 있습니다.
- IDE: VSCode, WebStorm, IntelliJ 등 모두 사용 가능 (VSCode 추천)

---

## 9. 앞으로의 세팅 계획
- Tailwind CSS, ESLint/Prettier, 테스트 환경 등 추가 세팅 예정
- 상세한 개발 가이드 및 문서화 예정

---

## 10. 문의
- 추가 문의사항은 이슈 또는 메일로 연락 바랍니다. 

---

## A. 부록: ShadCN + Tailwind CSS(v4) 설치 및 적용 절차 (Vite + React 기준)

아래 절차를 **순서대로 정확히 따라야** CSS가 정상적으로 적용됩니다.

### A-1. 필수 패키지 설치
```sh
npm install -D tailwindcss@latest @tailwindcss/vite
```

### A-2. Vite 플러그인 설정 (vite.config.ts)
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

### A-3. Tailwind CSS import (src/index.css)
```css
@import "tailwindcss";
```

### A-4. Tailwind 설정 파일 (tailwind.config.js)
```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### A-5. (중요) postcss.config.js/cjs 파일은 **생성하지 않음**
- Tailwind v4 + Vite 공식 방식에서는 postcss 설정 파일이 필요 없습니다.
- 기존에 있다면 삭제하세요.

### A-6. index.css가 main.tsx(또는 index.tsx)에서 import되어 있는지 확인
```ts
import './index.css';
```

### A-7. 개발 서버 실행
```sh
npm run dev
```

---

#### ✅ 위 절차를 정확히 따르면, 웹 화면 로딩 시 Tailwind CSS가 100% 정상 적용됩니다.
- ShadCN UI 컴포넌트는 필요할 때 npx shadcn-ui@latest add [컴포넌트명] 으로 추가 사용
- 불필요한 postcss 설정, 구버전 명령어, @tailwindcss/postcss 등은 절대 사용하지 마세요.

--- 