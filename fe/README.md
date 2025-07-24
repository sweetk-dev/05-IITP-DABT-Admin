# IITP DABT Admin - Frontend

IITP DABT Admin 시스템의 Frontend 웹 애플리케이션입니다.

## 📋 개요

React + TypeScript + Vite 기반의 관리자 웹 인터페이스로, 사용자 인증, 대시보드, 사용자 관리 등의 기능을 제공합니다.

### 🏗️ 기술 스택

- **Framework**: React 19
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 7.x
- **UI Library**: Material-UI (MUI) 7.x
- **Routing**: React Router DOM 7.x
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Authentication**: JWT
- **Package Manager**: npm

## 🚀 빠른 시작

### 1. 사전 요구사항

- **Node.js**: 18.x 이상
- **npm**: 9.x 이상
- **Git**: 최신 버전

### 2. 설치 및 설정

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
│   ├── api/                 # API 호출 함수들
│   │   ├── api.ts          # 공통 API 함수
│   │   ├── user.ts         # 사용자 API
│   │   ├── admin.ts        # 관리자 API
│   │   └── common.ts       # 공통 API
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── AppBarCommon.tsx
│   │   ├── LoginForm.tsx
│   │   └── CommonDialog.tsx
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── UserProfile.tsx
│   │   └── AdminLogin.tsx
│   ├── store/              # 상태 관리
│   │   └── auth.ts         # 인증 상태 관리
│   ├── utils/              # 유틸리티 함수
│   │   ├── jwt.ts          # JWT 관련 유틸리티
│   │   └── validation.ts   # 검증 함수 (로컬)
│   ├── types/              # TypeScript 타입 정의
│   ├── App.tsx             # 메인 앱 컴포넌트
│   ├── main.tsx            # 앱 진입점
│   └── index.css           # 전역 스타일
├── public/                 # 정적 파일
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

### 홈 페이지 (`/`)
- 시스템 개요
- 최근 활동
- 빠른 액션

### 로그인 페이지 (`/login`)
- 사용자 로그인
- 이메일/비밀번호 검증
- 에러 메시지 표시

### 회원가입 페이지 (`/register`)
- 사용자 회원가입
- 이메일 중복 확인
- 비밀번호 강도 측정

### 사용자 프로필 (`/profile`)
- 사용자 정보 조회/수정
- 비밀번호 변경
- 소속 정보 관리

### 관리자 로그인 (`/admin/login`)
- 관리자 전용 로그인
- 관리자 권한 확인

## 🔧 컴포넌트 구조

### AppBarCommon
공통으로 사용되는 상단 네비게이션 바입니다.

```typescript
import { AppBarCommon } from './components/AppBarCommon';

<AppBarCommon type="user" />
```

**Props:**
- `type`: 'user' | 'auth' | 'admin-login' | 'admin' | 'public'

### LoginForm
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

### CommonDialog
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
