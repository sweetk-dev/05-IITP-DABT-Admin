import { ErrorCode } from '@iitp-dabt/common';

/**
 * 서비스/리포지토리에서 발생하는 비즈니스 에러
 * Controller에서 ErrorCode를 추출하여 적절한 HTTP 응답을 생성할 수 있도록 함
 */
export class BusinessError extends Error {
  constructor(
    public errorCode: ErrorCode,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'BusinessError';
  }
}

/**
 * 데이터 검증 에러
 * 특정 필드에 대한 검증 실패 시 사용
 */
export class ValidationError extends Error {
  constructor(
    public errorCode: ErrorCode,
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * 리소스 관련 에러 (Not Found, Already Exists 등)
 * 가장 일반적으로 사용되는 에러 타입
 */
export class ResourceError extends Error {
  constructor(
    public errorCode: ErrorCode,
    message: string,
    public resourceType?: string,
    public resourceId?: string | number
  ) {
    super(message);
    this.name = 'ResourceError';
  }
}