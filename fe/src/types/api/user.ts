// User API 요청/응답 타입 정의 (React 표준)

export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
  affiliation?: string;
}

export interface UserRegisterResponse {
  success: boolean;
  userId?: string;
  error?: string;
} 