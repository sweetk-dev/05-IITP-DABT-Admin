# IITP DABT Admin - Frontend

IITP DABT Admin 시스템의 Frontend 웹 애플리케이션입니다.

## 📋 개요

React + TypeScript + Vite 기반의 관리자 웹 인터페이스로, 사용자 인증, 대시보드, 사용자 관리 등의 기능을 제공합니다.

### 🏗️ 기술 스택

- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **UI Library**: Material-UI (MUI) 5.x
- **Routing**: React Router DOM 6.x
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Authentication**: JWT
- **Package Manager**: npm

## 🚀 빠른 시작

### 1. 사전 요구사항

- **Node.js**: 22.x 이상
- **npm**: 9.x 이상
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

# 2. 공통 패키지 빌드 (필수)
cd ../packages/common && npm run build && cd ../../fe

# 3. 개발 서버 실행
npm run dev
```

### 3. 프로덕션 빌드

```bash
# 1. 빌드
npm run build

# 2. 빌드 결과물 확인
ls dist/
```

## ⚙️ 환경 변수 설정

### .env 파일 생성

```bash
cp .env.example .env
```

### 환경 변수

```env
# API 서버 설정
VITE_API_BASE_URL=http://localhost:30000
VITE_API_TIMEOUT=10000

# 개발 서버 설정
VITE_PORT=5173
```

> 중요: Vite의 `VITE_*` 환경변수는 "빌드 시점"에만 주입됩니다. 실행 서버의 `fe/.env`는 프로덕션(dist) 런타임에 영향을 주지 않습니다. 서브패스 배포 시에는 빌드 전에 아래와 같이 설정하세요.

```bash
# 예: /adm/에서 FE를 서빙하고, API를 Nginx로 /adm/api 프록시할 때
VITE_BASE=/adm/
VITE_API_BASE_URL=/adm/api
```

빌드 후 `dist/index.html`에서 `/adm/` 경로가 반영되었는지 확인하세요.

### 환경별 설정

#### Development
```env
VITE_API_BASE_URL=http://localhost:30000
VITE_API_TIMEOUT=10000
```

#### Production
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=30000
```

## 📁 프로젝트 구조

```
fe/
├── src/
│   ├── api/                 # API 호출 함수들 (11개 파일)
│   │   ├── account.ts      # 계정 관련 API
│   │   ├── admin.ts        # 관리자 API
│   │   ├── api.ts          # 공통 API 함수
│   │   ├── common.ts       # 공통 API
│   │   ├── commonCode.ts   # 공통 코드 API
│   │   ├── faq.ts          # FAQ API
│   │   ├── index.ts        # API export
│   │   ├── notice.ts       # 공지사항 API
│   │   ├── openApi.ts      # OpenAPI API
│   │   ├── qna.ts          # QNA API
│   │   └── user.ts         # 사용자 API
│   ├── components/         # 재사용 가능한 컴포넌트 (33개 파일)
│   │   ├── admin/          # 관리자 전용 컴포넌트
│   │   │   ├── AdminPageHeader.tsx
│   │   │   └── SideNav.tsx
│   │   ├── common/         # 공통 컴포넌트
│   │   │   ├── ByteLimitHelper.tsx
│   │   │   ├── CardListBody.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ExtendKeyDialog.tsx
│   │   │   ├── ListHeader.tsx
│   │   │   ├── ListItemCard.tsx
│   │   │   ├── ListScaffold.tsx
│   │   │   ├── ListTotal.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── PageTitle.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── QnaTypeChip.tsx
│   │   │   ├── SelectField.tsx
│   │   │   ├── StatusChip.tsx
│   │   │   ├── TableListBody.tsx
│   │   │   ├── ThemedButton.tsx
│   │   │   └── ThemedCard.tsx
│   │   ├── AdminMenuBar.tsx
│   │   ├── AppBar.tsx
│   │   ├── AppBarCommon.tsx
│   │   ├── CommonDialog.tsx
│   │   ├── CommonToast.tsx
│   │   ├── ErrorAlert.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoginForm.tsx
│   │   ├── ProfileForm.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── ToastProvider.tsx
│   ├── pages/              # 페이지 컴포넌트 (49개 파일)
│   │   ├── admin/          # 관리자 페이지 (25개)
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── AdminProfile.tsx
│   │   │   ├── CodeCreate.tsx
│   │   │   ├── CodeDetail.tsx
│   │   │   ├── CodeGroupDetail.tsx
│   │   │   ├── CodeManagement.tsx
│   │   │   ├── FaqCreate.tsx
│   │   │   ├── FaqDetail.tsx
│   │   │   ├── FaqEdit.tsx
│   │   │   ├── FaqList.tsx
│   │   │   ├── NoticeCreate.tsx
│   │   │   ├── NoticeDetail.tsx
│   │   │   ├── NoticeEdit.tsx
│   │   │   ├── NoticeManage.tsx
│   │   │   ├── OpenApiDetail.tsx
│   │   │   ├── OpenApiEdit.tsx
│   │   │   ├── OpenApiManage.tsx
│   │   │   ├── OpenApiRequestDetail.tsx
│   │   │   ├── OpenApiRequests.tsx
│   │   │   ├── OperatorCreate.tsx
│   │   │   ├── OperatorDetail.tsx
│   │   │   ├── OperatorEdit.tsx
│   │   │   ├── OperatorManagement.tsx
│   │   │   ├── QnaDetail.tsx
│   │   │   ├── QnaEdit.tsx
│   │   │   ├── QnaManage.tsx
│   │   │   ├── QnaReply.tsx
│   │   │   ├── UserCreate.tsx
│   │   │   ├── UserDetail.tsx
│   │   │   ├── UserEdit.tsx
│   │   │   └── UserManagement.tsx
│   │   ├── public/         # 공개 페이지 (3개)
│   │   │   ├── OpenApiAbout.tsx
│   │   │   ├── Privacy.tsx
│   │   │   └── Terms.tsx
│   │   ├── user/           # 사용자 페이지 (13개)
│   │   │   ├── Dashboard.tsx
│   │   │   ├── FaqList.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── NoticeDetail.tsx
│   │   │   ├── NoticeList.tsx
│   │   │   ├── OpenApiManagement.tsx
│   │   │   ├── QnaCreate.tsx
│   │   │   ├── QnaDetail.tsx
│   │   │   ├── QnaHistory.tsx
│   │   │   ├── QnaList.tsx
│   │   │   ├── Register.tsx
│   │   │   └── UserProfile.tsx
│   │   └── ThemePreview.tsx
│   ├── hooks/              # 커스텀 훅 (7개 파일)
│   │   ├── useCommonCode.ts
│   │   ├── useDataFetching.ts
│   │   ├── useErrorHandler.ts
│   │   ├── useInputWithTrim.ts
│   │   ├── usePagination.ts
│   │   ├── usePasswordValidation.ts
│   │   └── useQuerySync.ts
│   ├── store/              # 상태 관리
│   │   ├── auth.ts         # 인증 상태 관리
│   │   └── user.ts         # 사용자 상태 관리
│   ├── utils/              # 유틸리티 함수
│   │   ├── apiResponseHandler.ts
│   │   ├── auth.ts
│   │   ├── date.ts
│   │   ├── jwt.ts
│   │   └── openApiStatus.ts
│   ├── types/              # TypeScript 타입 정의
│   │   ├── api.ts
│   │   └── errorCodes.ts
│   ├── theme/              # 테마 설정
│   │   ├── index.ts
│   │   └── mui.ts
│   ├── routes/             # 라우팅 설정
│   │   ├── guards/
│   │   │   └── PublicRoute.tsx
│   │   └── index.ts
│   ├── constants/          # 상수 정의
│   │   ├── noticeTypes.ts
│   │   ├── pagination.ts
│   │   └── spacing.ts
│   ├── config.ts           # 설정 파일
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── App.css             # 앱 스타일
│   ├── main.tsx            # 앱 진입점
│   ├── index.css           # 전역 스타일
│   └── vite-env.d.ts       # Vite 타입 정의
├── public/                 # 정적 파일
│   ├── iitp_cms_logo_img_1.png
│   ├── iitp_cms_logo_img_2.png
│   ├── index.html
│   └── vite.svg
├── dist/                   # 빌드 결과물
└── package.json
```

## 🔧 개발 가이드

### 스크립트 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview

# 린트 검사
npm run lint

# 스크립트를 사용한 빌드 (packages/common 의존성 자동 처리)
bash scripts/build.sh

# 클린 빌드
npm run build:clean

# 전체 빌드 (공통 패키지 포함)
npm run build:all
```

### 개발 서버 실행

```bash
npm run dev
```

애플리케이션이 `http://localhost:5173`에서 실행됩니다.

### 핫 리로드

Vite의 핫 리로드 기능으로 코드 변경 시 자동으로 브라우저가 새로고침됩니다.

## 🔐 인증 시스템

### JWT 토큰 관리

- **Access Token**: 15분 만료
- **Refresh Token**: 7일 만료
- **자동 갱신**: Access Token 만료 5분 전 자동 갱신

### 인증 상태 관리

```typescript
import { 
  saveTokens, 
  getAccessToken, 
  removeTokens,
  isAuthenticated 
} from './store/auth';

// 토큰 저장
saveTokens(accessToken, refreshToken);

// 토큰 확인
const token = getAccessToken();

// 인증 상태 확인
const isAuth = isAuthenticated();

// 로그아웃
removeTokens();
```

### JWT 유틸리티

```typescript
import { 
  isTokenExpired, 
  getTokenTimeRemaining,
  shouldRefreshToken 
} from './utils/jwt';

// 토큰 만료 확인
const expired = isTokenExpired(token);

// 남은 시간 확인
const remaining = getTokenTimeRemaining(token);

// 갱신 필요 여부 확인
const needsRefresh = shouldRefreshToken(token);
```

## 📱 주요 페이지

### 사용자 페이지

#### 홈 페이지 (`/`)
- 시스템 개요 및 대시보드
- 최근 활동 및 통계
- 빠른 액션 메뉴

#### 로그인 페이지 (`/login`)
- 사용자 로그인
- 이메일/비밀번호 검증
- 에러 메시지 표시

#### 회원가입 페이지 (`/register`)
- 사용자 회원가입
- 이메일 중복 확인
- 비밀번호 강도 측정

#### 사용자 프로필 (`/profile`)
- 사용자 정보 조회/수정
- 비밀번호 변경
- 소속 정보 관리

#### 대시보드 (`/dashboard`)
- 개인 대시보드
- 최근 활동 내역
- 통계 정보

#### FAQ 목록 (`/faq`)
- 자주 묻는 질문 목록
- 카테고리별 필터링
- 검색 기능

#### QNA 관리 (`/qna`)
- QNA 목록 조회
- QNA 생성
- QNA 상세 조회
- QNA 이력 관리

#### 공지사항 (`/notice`)
- 공지사항 목록
- 공지사항 상세 조회
- 중요 공지사항 표시

#### OpenAPI 관리 (`/openapi`)
- OpenAPI 클라이언트 관리
- API 키 생성/관리
- 요청 내역 조회

### 관리자 페이지

#### 관리자 로그인 (`/admin/login`)
- 관리자 전용 로그인
- 관리자 권한 확인

#### 관리자 대시보드 (`/admin/dashboard`)
- 시스템 전체 통계
- 최근 활동 모니터링
- 관리 기능 접근

#### 사용자 관리 (`/admin/users`)
- 사용자 목록 조회
- 사용자 생성/수정/삭제
- 사용자 권한 관리

#### 운영자 관리 (`/admin/operators`)
- 운영자 계정 관리
- 운영자 권한 설정
- 운영자 활동 모니터링

#### FAQ 관리 (`/admin/faq`)
- FAQ 목록 관리
- FAQ 생성/수정/삭제
- FAQ 카테고리 관리

#### QNA 관리 (`/admin/qna`)
- QNA 목록 조회
- QNA 답변 작성
- QNA 상태 관리

#### 공지사항 관리 (`/admin/notice`)
- 공지사항 목록 관리
- 공지사항 생성/수정/삭제
- 중요 공지사항 설정

#### OpenAPI 관리 (`/admin/openapi`)
- OpenAPI 클라이언트 관리
- API 키 생성/관리
- 요청 내역 모니터링

#### 공통 코드 관리 (`/admin/codes`)
- 공통 코드 그룹 관리
- 공통 코드 생성/수정/삭제
- 코드 정렬 및 활성화 관리

### 공개 페이지

#### OpenAPI 소개 (`/about/openapi`)
- OpenAPI 서비스 소개
- 사용 방법 안내
- API 문서 링크

#### 개인정보처리방침 (`/privacy`)
- 개인정보 처리 방침
- 데이터 보호 정책

#### 이용약관 (`/terms`)
- 서비스 이용약관
- 사용자 권리 및 의무

## 🔧 컴포넌트 구조

### 공통 컴포넌트

#### AppBarCommon
공통으로 사용되는 상단 네비게이션 바입니다.

```typescript
import { AppBarCommon } from './components/AppBarCommon';

<AppBarCommon type="user" />
```

**Props:**
- `type`: 'user' | 'auth' | 'admin-login' | 'admin' | 'public'

#### LoginForm
로그인 폼 컴포넌트입니다.

```typescript
import LoginForm from './components/LoginForm';

<LoginForm 
  onSubmit={handleLogin}
  showRegisterButton={true}
/>
```

**Props:**
- `onSubmit`: 로그인 처리 함수
- `showRegisterButton`: 회원가입 버튼 표시 여부

#### CommonDialog
공통 다이얼로그 컴포넌트입니다.

```typescript
import CommonDialog from './components/CommonDialog';

<CommonDialog
  open={open}
  onClose={handleClose}
  title="제목"
  actions={<Button>확인</Button>}
>
  내용
</CommonDialog>
```

#### LoadingSpinner
로딩 상태 표시 컴포넌트입니다.

```typescript
import LoadingSpinner from './components/LoadingSpinner';

<LoadingSpinner />
```

#### ErrorAlert
에러 메시지 표시 컴포넌트입니다.

```typescript
import ErrorAlert from './components/ErrorAlert';

<ErrorAlert 
  message="에러 메시지"
  severity="error"
/>
```

### 리스트 관련 컴포넌트

#### ListScaffold
리스트 페이지의 기본 구조를 제공하는 컴포넌트입니다.

```typescript
import { ListScaffold } from './components/common/ListScaffold';

<ListScaffold
  title="제목"
  actions={<Button>추가</Button>}
  filters={<FilterComponent />}
>
  <ListContent />
</ListScaffold>
```

#### DataTable
데이터 테이블 컴포넌트입니다.

```typescript
import { DataTable } from './components/common/DataTable';

<DataTable
  columns={columns}
  data={data}
  pagination={pagination}
  onRowClick={handleRowClick}
/>
```

#### Pagination
페이지네이션 컴포넌트입니다.

```typescript
import { Pagination } from './components/common/Pagination';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

### 폼 관련 컴포넌트

#### SelectField
선택 필드 컴포넌트입니다.

```typescript
import { SelectField } from './components/common/SelectField';

<SelectField
  label="카테고리"
  options={categories}
  value={selectedCategory}
  onChange={handleCategoryChange}
/>
```

#### ThemedButton
테마가 적용된 버튼 컴포넌트입니다.

```typescript
import { ThemedButton } from './components/common/ThemedButton';

<ThemedButton
  variant="contained"
  color="primary"
  onClick={handleClick}
>
  버튼 텍스트
</ThemedButton>
```

### 상태 표시 컴포넌트

#### StatusChip
상태를 표시하는 칩 컴포넌트입니다.

```typescript
import { StatusChip } from './components/common/StatusChip';

<StatusChip 
  status="active"
  label="활성"
/>
```

#### QnaTypeChip
QNA 타입을 표시하는 칩 컴포넌트입니다.

```typescript
import { QnaTypeChip } from './components/common/QnaTypeChip';

<QnaTypeChip 
  type="technical"
  label="기술 문의"
/>
```

### 관리자 전용 컴포넌트

#### AdminPageHeader
관리자 페이지 헤더 컴포넌트입니다.

```typescript
import { AdminPageHeader } from './components/admin/AdminPageHeader';

<AdminPageHeader
  title="사용자 관리"
  breadcrumbs={breadcrumbs}
  actions={<Button>추가</Button>}
/>
```

#### SideNav
관리자 사이드 네비게이션 컴포넌트입니다.

```typescript
import { SideNav } from './components/admin/SideNav';

<SideNav
  currentPath={currentPath}
  onNavigate={handleNavigate}
/>
```

## 🪝 커스텀 훅

### useCommonCode
공통 코드 데이터를 관리하는 훅입니다.

```typescript
import { useCommonCode } from './hooks/useCommonCode';

const { codes, loading, error } = useCommonCode('category');
```

### useDataFetching (표준 에러 처리 패턴)
```typescript
import { useDataFetching } from './hooks/useDataFetching';

const { data, isLoading, isEmpty, isError, status, refetch } = useDataFetching(
  () => fetchUsers({ page, limit }),
  [page, limit]
);

const error = isError && status === 'error' ? (data as any)?.error : undefined;
```

- 에러는 `isError + status === 'error'`로 판별하고, 메시지는 `data?.error`에서 꺼냅니다.

### usePagination
페이지네이션을 관리하는 훅입니다.

```typescript
import { usePagination } from './hooks/usePagination';

const {
  currentPage,
  totalPages,
  pageSize,
  goToPage,
  nextPage,
  prevPage
} = usePagination({
  totalItems: 100,
  pageSize: 10
});
```

### usePasswordValidation
비밀번호 검증을 관리하는 훅입니다.

```typescript
import { usePasswordValidation } from './hooks/usePasswordValidation';

const {
  password,
  setPassword,
  isValid,
  strength,
  errors
} = usePasswordValidation();
```

### useInputWithTrim
입력값 자동 트림을 관리하는 훅입니다.

```typescript
import { useInputWithTrim } from './hooks/useInputWithTrim';

const {
  value,
  onChange,
  onBlur
} = useInputWithTrim('');
```

### useErrorHandler
에러 처리를 관리하는 훅입니다.

```typescript
import { useErrorHandler } from './hooks/useErrorHandler';

const { handleError, showError } = useErrorHandler();
```

### useQuerySync
URL 쿼리 파라미터와 상태를 동기화하는 훅입니다.

```typescript
import { useQuerySync } from './hooks/useQuerySync';

const { queryParams, updateQuery } = useQuerySync({
  page: 1,
  limit: 10,
  search: ''
});
```

## 🌐 API 통신

### API 함수 사용법

```typescript
import { loginUser, getUserProfile } from './api/user';

// 로그인
const response = await loginUser({
  email: 'user@example.com',
  password: 'password123'
});

// 프로필 조회
const profile = await getUserProfile();
```

### 에러 처리

```typescript
try {
  const response = await apiFetch('/api/user/profile');
  if (response.result === 'ok') {
    // 성공 처리
  } else {
    // 에러 처리
    console.error(response.message);
  }
} catch (error) {
  // 네트워크 에러 처리
  console.error('Network error:', error);
}
```

### 자동 토큰 갱신

API 호출 시 토큰이 만료되면 자동으로 갱신됩니다.

```typescript
// 토큰이 만료되면 자동으로 갱신 후 재시도
const response = await apiFetch('/api/user/profile');
```

## 🎨 스타일링

### Material-UI 사용

```typescript
import { Box, Button, Typography } from '@mui/material';

<Box sx={{ p: 2, bgcolor: 'background.paper' }}>
  <Typography variant="h5">제목</Typography>
  <Button variant="contained" color="primary">
    버튼
  </Button>
</Box>
```

### CSS 변수 사용

```css
:root {
  --appbar-height: 64px;
  --footer-height: 56px;
  --primary-color: #1976d2;
}
```

### 반응형 디자인

```typescript
import { useTheme, useMediaQuery } from '@mui/material';

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('md'));

// 모바일 대응
{isMobile ? <MobileView /> : <DesktopView />}
```

## 🔍 디버깅

### 개발자 도구

1. **React Developer Tools**: 컴포넌트 구조 및 상태 확인
2. **Redux DevTools**: 상태 관리 디버깅 (필요시)
3. **Network Tab**: API 호출 확인

### 로깅

```typescript
// 개발 환경에서만 로그 출력
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data);
}
```

### 에러 바운더리

```typescript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <YourComponent />
</ErrorBoundary>
```

## 🚀 배포

### 프로덕션 빌드

```bash
# 1. 의존성 설치
npm install

# 2. 공통 패키지 빌드
cd ../packages/common && npm run build && cd ../../fe

# 3. 프로덕션 빌드
npm run build

# 4. 빌드 결과물 확인
ls dist/
```

### 정적 파일 서빙

빌드된 `dist/` 폴더를 웹 서버에서 서빙합니다.

#### Nginx 설정 예시

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/fe/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:30000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Apache 설정 예시

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/fe/dist

    <Directory /path/to/fe/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]
</VirtualHost>
```

### 환경 변수 설정

프로덕션 환경에서는 다음 환경 변수를 설정해야 합니다:

```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_API_TIMEOUT=30000
```

## 🧪 테스트

### 단위 테스트

```bash
# 테스트 실행
npm test

# 테스트 커버리지
npm run test:coverage
```

### E2E 테스트

```bash
# E2E 테스트 실행
npm run test:e2e
```

## 📊 성능 최적화

### 코드 스플리팅

```typescript
import { lazy, Suspense } from 'react';

const UserProfile = lazy(() => import('./pages/UserProfile'));

<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>
```

### 이미지 최적화

```typescript
// WebP 포맷 사용
<img src="image.webp" alt="이미지" />

// 지연 로딩
<img src="image.jpg" loading="lazy" alt="이미지" />
```

### 번들 분석

```bash
# 번들 크기 분석
npm run build:analyze
```

## 🔒 보안

### XSS 방지

- React의 기본 XSS 방지 기능 활용
- 사용자 입력 검증 및 이스케이프

### CSRF 방지

- JWT 토큰 기반 인증
- SameSite 쿠키 설정

### 환경 변수 보안

- 민감한 정보는 환경 변수로 관리
- 빌드 시 환경 변수 주입

## 🐛 문제 해결

### 일반적인 문제

#### 1. 빌드 실패
```bash
# 캐시 삭제
rm -rf node_modules/.cache
npm run build:clean
```

#### 2. 개발 서버 시작 실패
```bash
# 포트 확인
netstat -tulpn | grep :5173

# 다른 포트 사용
npm run dev -- --port 3001
```

#### 3. API 연결 실패
```bash
# API 서버 상태 확인
curl http://localhost:30000/api/common/health

# CORS 설정 확인
```

### 브라우저 호환성

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📞 지원

문제가 발생하거나 질문이 있으시면:

1. **개발자 도구 확인**: 브라우저 개발자 도구의 콘솔 확인
2. **문서 참조**: 이 README.md 파일 참조
3. **이슈 등록**: GitHub Issues에 등록

---

**IITP DABT Admin Frontend Team** © 2024
