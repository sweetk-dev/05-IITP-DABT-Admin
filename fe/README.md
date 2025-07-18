# React + TypeScript + Vite

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
