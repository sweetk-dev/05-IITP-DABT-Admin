export enum ErrorCode {
  // 공통 (9000~)
  SUCCESS = 0,
  UNKNOWN_ERROR = 9000,
  INVALID_REQUEST = 9001,
  UNAUTHORIZED = 9002,
  FORBIDDEN = 9003,
  NOT_FOUND = 9004,

  // User (1000~1999)
  USER_EMAIL_REQUIRED = 1001,
  USER_EMAIL_DUPLICATE = 1002,
  USER_PASSWORD_REQUIRED = 1003,
  USER_NAME_REQUIRED = 1004,
  USER_NOT_FOUND = 1005,
  USER_PASSWORD_INVALID = 1006,

  // Admin (2000~2999)
  ADMIN_ID_REQUIRED = 2001,
  ADMIN_NOT_FOUND = 2002,
  ADMIN_PASSWORD_INVALID = 2003,
  ADMIN_INACTIVE = 2004,

  // Auth (3000~3999)
  TOKEN_REQUIRED = 3001,
  TOKEN_INVALID = 3002,
  TOKEN_EXPIRED = 3003,
  LOGIN_FAILED = 3004,
  LOGOUT_FAILED = 3005,
}

export interface ErrorMeta {
  statusCode: number;
  message: string;
  showPopup?: boolean;
  redirectTo?: string;
  autoLogout?: boolean;
}

export const ErrorMetaMap: Record<ErrorCode, ErrorMeta> = {
  [ErrorCode.SUCCESS]: { statusCode: 200, message: '성공' },
  [ErrorCode.UNKNOWN_ERROR]: { statusCode: 500, message: '알 수 없는 오류입니다.', showPopup: true },
  [ErrorCode.INVALID_REQUEST]: { statusCode: 400, message: '잘못된 요청입니다.', showPopup: true },
  [ErrorCode.UNAUTHORIZED]: { statusCode: 401, message: '인증이 필요합니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.FORBIDDEN]: { statusCode: 403, message: '권한이 없습니다.', showPopup: true },
  [ErrorCode.NOT_FOUND]: { statusCode: 404, message: '대상을 찾을 수 없습니다.', showPopup: true },
  [ErrorCode.USER_EMAIL_REQUIRED]: { statusCode: 400, message: '이메일이 필요합니다.', showPopup: true },
  [ErrorCode.USER_EMAIL_DUPLICATE]: { statusCode: 409, message: '이미 가입된 이메일입니다.', showPopup: true },
  [ErrorCode.USER_PASSWORD_REQUIRED]: { statusCode: 400, message: '비밀번호가 필요합니다.', showPopup: true },
  [ErrorCode.USER_NAME_REQUIRED]: { statusCode: 400, message: '이름이 필요합니다.', showPopup: true },
  [ErrorCode.USER_NOT_FOUND]: { statusCode: 404, message: '존재하지 않는 계정입니다.', showPopup: true },
  [ErrorCode.USER_PASSWORD_INVALID]: { statusCode: 401, message: '비밀번호가 일치하지 않습니다.', showPopup: true },
  [ErrorCode.ADMIN_ID_REQUIRED]: { statusCode: 400, message: '관리자 ID가 필요합니다.', showPopup: true },
  [ErrorCode.ADMIN_NOT_FOUND]: { statusCode: 404, message: '관리자를 찾을 수 없습니다.', showPopup: true },
  [ErrorCode.ADMIN_PASSWORD_INVALID]: { statusCode: 401, message: '관리자 비밀번호가 일치하지 않습니다.', showPopup: true },
  [ErrorCode.ADMIN_INACTIVE]: { statusCode: 403, message: '비활성화된 관리자 계정입니다.', showPopup: true },
  [ErrorCode.TOKEN_REQUIRED]: { statusCode: 401, message: '인증 토큰이 필요합니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.TOKEN_INVALID]: { statusCode: 401, message: '유효하지 않은 토큰입니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.TOKEN_EXPIRED]: { statusCode: 401, message: '만료된 토큰입니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.LOGIN_FAILED]: { statusCode: 401, message: '로그인에 실패했습니다.', showPopup: true },
  [ErrorCode.LOGOUT_FAILED]: { statusCode: 500, message: '로그아웃 처리 중 오류가 발생했습니다.', showPopup: true },
}; 