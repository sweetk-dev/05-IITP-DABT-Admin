// User API 요청/응답 타입 정의 (BE 표준)
//응답은 ApiResponse<UserRegisterResult> 등으로 사용

//UserRegister
export interface UserRegisterRequest {
  email: string;
  password: string;
  name: string;
  affiliation?: string;
}

export interface UserRegisterResult {
  userId?: number;
}

//UserCheckEmail
export interface UserCheckEmailRequest {
  email: string;
}

export interface UserCheckEmailResult {
  exists: boolean;
} 