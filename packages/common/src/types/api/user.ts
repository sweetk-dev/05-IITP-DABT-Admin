// 사용자 관련 타입 정의
export interface User {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateData {
  email: string;
  password: string;
  name: string;
}

export interface UserUpdateData {
  name?: string;
  password?: string;
} 