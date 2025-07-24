# @iitp/common

IITP DABT Admin 프로젝트의 공통 유틸리티 패키지입니다.

## 📦 설치

```bash
npm install @iitp/common
```

## 🚀 사용법

### 검증 함수들

```typescript
import { 
  isValidEmail, 
  isValidPassword, 
  getPasswordStrength,
  isValidName,
  isValidAffiliation 
} from '@iitp/common';

// 이메일 검증
const isValid = isValidEmail('user@example.com'); // true

// 비밀번호 검증
const isStrongPassword = isValidPassword('MyPass123!'); // true

// 비밀번호 강도 확인
const strength = getPasswordStrength('MyPass123!'); // 'strong'

// 이름 검증
const isValidName = isValidName('홍길동'); // true

// 소속 검증
const isValidAffiliation = isValidAffiliation('한국정보통신기술협회'); // true
```

## 📋 API 문서

### `isValidEmail(email: string): boolean`

이메일 주소의 유효성을 검사합니다.

- **매개변수**: `email` - 검사할 이메일 주소
- **반환값**: 유효한 이메일 형식인지 여부

### `isValidPassword(password: string): boolean`

비밀번호의 유효성을 검사합니다.

**조건:**
- 최소 8자 이상
- 영문 대/소문자 포함
- 숫자 포함
- 특수문자 포함

- **매개변수**: `password` - 검사할 비밀번호
- **반환값**: 유효한 비밀번호 형식인지 여부

### `getPasswordStrength(password: string): 'weak' | 'medium' | 'strong'`

비밀번호의 강도를 평가합니다.

- **매개변수**: `password` - 평가할 비밀번호
- **반환값**: 비밀번호 강도

### `isValidName(name: string): boolean`

이름의 유효성을 검사합니다.

- **조건**: 2-50자, 한글/영문/숫자/공백 허용
- **매개변수**: `name` - 검사할 이름
- **반환값**: 유효한 이름 형식인지 여부

### `isValidAffiliation(affiliation: string): boolean`

소속의 유효성을 검사합니다.

- **조건**: 2-100자, 한글/영문/숫자/공백/특수문자 허용
- **매개변수**: `affiliation` - 검사할 소속
- **반환값**: 유효한 소속 형식인지 여부

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

## 📄 라이선스

MIT License 