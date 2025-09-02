# @iitp-dabt/common

IITP DABT Admin 프로젝트의 공통 유틸리티 및 타입 정의 패키지입니다.

## 📦 설치

```bash
npm install @iitp-dabt/common
```

## 🚀 사용법

### 검증 함수들

```typescript
import { 
  isValidEmail, 
  isValidPassword, 
  validatePassword,
  getPasswordStrength,
  isValidName,
  isValidAffiliation 
} from '@iitp-dabt/common';

// 이메일 검증
const isValid = isValidEmail('user@example.com'); // true

// 비밀번호 검증
const isStrongPassword = isValidPassword('MyPass123!'); // true

// 비밀번호 상세 검증 (에러 메시지 포함)
const validation = validatePassword('weak');
// { isValid: false, errorMessage: '비밀번호는 최소 8자 이상이어야 합니다.' }

// 비밀번호 강도 확인
const strength = getPasswordStrength('MyPass123!'); // 'strong'

// 이름 검증
const isValidName = isValidName('홍길동'); // true

// 소속 검증
const isValidAffiliation = isValidAffiliation('한국정보통신기술협회'); // true
```

### API 타입 정의

```typescript
import { 
  ApiResponse,
  LoginRequest,
  LoginResponse,
  UserProfile,
  AdminUser,
  FaqItem,
  QnaItem,
  NoticeItem,
  OpenApiClient,
  CommonCode
} from '@iitp-dabt/common';

// API 응답 타입
const response: ApiResponse<UserProfile> = {
  result: 'ok',
  data: userProfile,
  message: 'Success'
};

// 로그인 요청 타입
const loginData: LoginRequest = {
  email: 'user@example.com',
  password: 'password123'
};
```

### 에러 코드

```typescript
import { ErrorCode } from '@iitp-dabt/common';

// 에러 코드 사용
if (error.code === ErrorCode.EMAIL_ALREADY_EXISTS) {
  console.log('이미 존재하는 이메일입니다.');
}

if (error.code === ErrorCode.INVALID_PASSWORD) {
  console.log('비밀번호가 올바르지 않습니다.');
}
```

## 📋 API 문서

### 검증 함수들

| 함수명 | 설명 | 반환값 |
|--------|------|--------|
| `isValidEmail(email)` | 이메일 주소 유효성 검사 (RFC 5322 표준) | `boolean` |
| `isValidPassword(password)` | 비밀번호 유효성 검사 (8자+, 영문, 숫자, 특수문자) | `boolean` |
| `validatePassword(password)` | 비밀번호 상세 검증 (에러 메시지 포함) | `{isValid: boolean, errorMessage?: string}` |
| `getPasswordStrength(password)` | 비밀번호 강도 평가 | `'weak' \| 'medium' \| 'strong'` |
| `isValidName(name)` | 이름 유효성 검사 (2-50자, 한글/영문/숫자/공백) | `boolean` |
| `isValidAffiliation(affiliation)` | 소속 유효성 검사 (2-100자, 한글/영문/숫자/공백/특수문자) | `boolean` |

### API 타입 정의

#### `ApiResponse<T>`
모든 API 응답의 표준 형식입니다.
```typescript
interface ApiResponse<T> {
  result: 'ok' | 'error';
  data?: T;
  message?: string;
  errorCode?: number;
}
```

#### `LoginRequest` & `LoginResponse`
사용자 로그인 관련 타입입니다.
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}
```

#### `UserProfile` & `AdminUser`
사용자 정보 관련 타입입니다.
```typescript
interface UserProfile {
  id: number;
  email: string;
  name: string;
  affiliation: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### `FaqItem`, `QnaItem`, `NoticeItem`
콘텐츠 관련 타입들입니다.
```typescript
interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### `OpenApiClient`
OpenAPI 클라이언트 관련 타입입니다.
```typescript
interface OpenApiClient {
  id: number;
  clientName: string;
  apiKey: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### `CommonCode`
공통 코드 관련 타입입니다.
```typescript
interface CommonCode {
  id: number;
  codeGroup: string;
  codeValue: string;
  codeName: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}
```

### 에러 코드

#### 주요 에러 코드들
```typescript
enum ErrorCode {
  // 기본 에러
  UNKNOWN_ERROR = 11000,
  VALIDATION_ERROR = 11001,
  DATABASE_ERROR = 11002,
  NETWORK_ERROR = 11003,
  
  // 요청 관련
  INVALID_REQUEST = 12000,
  MISSING_REQUIRED_FIELD = 12001,
  INVALID_PARAMETER = 12002,
  EMAIL_ALREADY_EXISTS = 12020,
  EMAIL_INVALID_FORMAT = 12021,
  
  // 인증 관련
  AUTH_INVALID_CREDENTIALS = 14000,
  AUTH_TOKEN_EXPIRED = 14001,
  AUTH_TOKEN_INVALID = 14002,
  AUTH_ACCESS_DENIED = 14003,
  
  // 사용자 관련
  USER_NOT_FOUND = 15000,
  USER_ALREADY_EXISTS = 15001,
  USER_INACTIVE = 15002,
  
  // 관리자 관련
  ADMIN_NOT_FOUND = 16000,
  ADMIN_ACCESS_DENIED = 16001,
  
  // FAQ 관련
  FAQ_NOT_FOUND = 17000,
  FAQ_CREATE_FAILED = 17001,
  FAQ_UPDATE_FAILED = 17002,
  FAQ_DELETE_FAILED = 17003,
  
  // QNA 관련
  QNA_NOT_FOUND = 18000,
  QNA_CREATE_FAILED = 18001,
  QNA_UPDATE_FAILED = 18002,
  QNA_DELETE_FAILED = 18003,
  QNA_ALREADY_REPLIED = 18004,
  
  // 공지사항 관련
  NOTICE_NOT_FOUND = 19000,
  NOTICE_CREATE_FAILED = 19001,
  NOTICE_UPDATE_FAILED = 19002,
  NOTICE_DELETE_FAILED = 19003,
  
  // OpenAPI 관련
  OPENAPI_CLIENT_NOT_FOUND = 20000,
  OPENAPI_CLIENT_CREATE_FAILED = 20001,
  OPENAPI_CLIENT_UPDATE_FAILED = 20002,
  OPENAPI_CLIENT_DELETE_FAILED = 20003,
  OPENAPI_KEY_INVALID = 20004,
  OPENAPI_QUOTA_EXCEEDED = 20005,
  
  // 공통 코드 관련
  COMMON_CODE_NOT_FOUND = 21000,
  COMMON_CODE_CREATE_FAILED = 21001,
  COMMON_CODE_UPDATE_FAILED = 21002,
  COMMON_CODE_DELETE_FAILED = 21003,
  COMMON_CODE_ALREADY_EXISTS = 21004,
  
  // 시스템 관련
  SYS_INTERNAL_SERVER_ERROR = 22000,
  SYS_SERVICE_UNAVAILABLE = 22001,
  SYS_MAINTENANCE_MODE = 22002
}
```

## 📁 프로젝트 구조

```
packages/common/
├── src/
│   ├── types/
│   │   ├── api/              # API 관련 타입 정의
│   │   │   ├── account.ts    # 계정 관련 타입
│   │   │   ├── admin.ts      # 관리자 관련 타입
│   │   │   ├── api.ts        # API 공통 타입
│   │   │   ├── auth.ts       # 인증 관련 타입
│   │   │   ├── common.ts     # 공통 타입
│   │   │   ├── commonCode.ts # 공통 코드 타입
│   │   │   ├── faq.ts        # FAQ 관련 타입
│   │   │   ├── notice.ts     # 공지사항 관련 타입
│   │   │   ├── openApi.ts    # OpenAPI 관련 타입
│   │   │   ├── qna.ts        # QNA 관련 타입
│   │   │   ├── user.ts       # 사용자 관련 타입
│   │   │   └── index.ts      # 타입 export
│   │   └── errorCodes.ts     # 에러 코드 정의
│   ├── validation.ts         # 검증 함수들
│   └── index.ts             # 메인 export
├── dist/                    # 빌드 결과물
├── package.json
└── README.md
```

## 🛠️ 개발

### 빌드

```bash
npm run build
```

### 개발 모드 (watch)

```bash
npm run dev
```

### 클린 빌드

```bash
npm run build:clean
```

### 의존성

이 패키지는 다른 패키지에 의존하지 않으며, 순수한 유틸리티와 타입 정의만을 제공합니다.

## 🔧 사용 예시

### Frontend에서 사용

```typescript
// React 컴포넌트에서 사용
import { isValidEmail, ErrorCode } from '@iitp-dabt/common';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = () => {
    if (!isValidEmail(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }
    // 로그인 로직...
  };
};
```

### Backend에서 사용

```typescript
// Express 라우터에서 사용
import { validatePassword, ErrorCode } from '@iitp-dabt/common';

app.post('/api/user/register', (req, res) => {
  const { password } = req.body;
  
  const validation = validatePassword(password);
  if (!validation.isValid) {
    return res.status(400).json({
      result: 'error',
      errorCode: ErrorCode.VALIDATION_ERROR,
      message: validation.errorMessage
    });
  }
  
  // 회원가입 로직...
});
```

## 📄 라이선스

MIT License 