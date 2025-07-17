# IITP-DABT-Admin

## 소개
IITP-DABT-Admin 프로젝트는 React + Material UI 기반의 프론트엔드와 Express + PostgreSQL 백엔드로 구성된 관리 시스템입니다.

---

## 폴더 구조

```
├── fe/   # 프론트엔드 (React + Material UI)
├── be/   # 백엔드 (Express + PostgreSQL)
├── README.md
├── .gitignore
```

---

## 개발 환경 및 주요 라이브러리

### 프론트엔드 (fe)
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
- [TypeScript](https://www.typescriptlang.org/) (선택적)

### 백엔드 (be)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/) (ORM, 선택적)

---

## 개발/운영 방법

### 1. 프론트엔드(fe) 세팅 및 실행
```sh
cd fe
npm install           # 의존성 설치
npm run dev           # 개발 서버 실행 (기본: http://localhost:3000)
```

### 2. 백엔드(be) 세팅 및 실행
```sh
cd be
npm install           # 의존성 설치
npm run dev           # 개발 서버 실행 (기본: http://localhost:40000)
```

### 3. 전체 통합 운영
- Express 서버에서 React 빌드 파일과 API를 모두 40000 포트에서 서비스하도록 설정할 수 있습니다.
- 환경 변수(.env) 파일이 필요할 수 있습니다.

---

## .gitignore 관리
- 루트, fe, be 폴더 각각에 .gitignore 파일을 두어 불필요한 파일(node_modules, build, .env 등)을 관리합니다.

---

## 기타 참고 사항
- 권장 Node.js 버전: **v18.x 또는 v20.x (LTS)**
- 최신 Node.js(v22.x)에서는 일부 패키지 호환성 문제가 발생할 수 있습니다.
- IDE: VSCode, WebStorm, IntelliJ 등 모두 사용 가능 (VSCode 추천)

---

## 앞으로의 세팅 계획
- Tailwind CSS, ESLint/Prettier, 테스트 환경 등 추가 세팅 예정
- 상세한 개발 가이드 및 문서화 예정

---

## 문의
- 추가 문의사항은 이슈 또는 메일로 연락 바랍니다. 