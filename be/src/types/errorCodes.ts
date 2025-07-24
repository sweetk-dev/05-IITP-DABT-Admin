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
}

export const ErrorMessage: Record<ErrorCode, string> = {
  [ErrorCode.SUCCESS]: '성공',
  [ErrorCode.UNKNOWN_ERROR]: '알 수 없는 오류입니다.',
  [ErrorCode.INVALID_REQUEST]: '잘못된 요청입니다.',
  [ErrorCode.UNAUTHORIZED]: '인증이 필요합니다.',
  [ErrorCode.FORBIDDEN]: '권한이 없습니다.',
  [ErrorCode.NOT_FOUND]: '대상을 찾을 수 없습니다.',
  [ErrorCode.USER_EMAIL_REQUIRED]: '이메일이 필요합니다.',
  [ErrorCode.USER_EMAIL_DUPLICATE]: '이미 가입된 이메일입니다.',
  [ErrorCode.USER_PASSWORD_REQUIRED]: '비밀번호가 필요합니다.',
  [ErrorCode.USER_NAME_REQUIRED]: '이름이 필요합니다.',
  [ErrorCode.USER_NOT_FOUND]: '존재하지 않는 계정입니다.',
  [ErrorCode.USER_PASSWORD_INVALID]: '비밀번호가 일치하지 않습니다.',
  [ErrorCode.ADMIN_ID_REQUIRED]: '관리자 ID가 필요합니다.',
  [ErrorCode.ADMIN_NOT_FOUND]: '관리자를 찾을 수 없습니다.',
};

export interface ErrorMeta {
  statusCode: number;
  message: string;
}

export const ErrorMetaMap: Record<ErrorCode, ErrorMeta> = {
  [ErrorCode.SUCCESS]: { statusCode: 200, message: '성공' },
  [ErrorCode.UNKNOWN_ERROR]: { statusCode: 500, message: '알 수 없는 오류입니다.' },
  [ErrorCode.INVALID_REQUEST]: { statusCode: 400, message: '잘못된 요청입니다.' },
  [ErrorCode.UNAUTHORIZED]: { statusCode: 401, message: '인증이 필요합니다.' },
  [ErrorCode.FORBIDDEN]: { statusCode: 403, message: '권한이 없습니다.' },
  [ErrorCode.NOT_FOUND]: { statusCode: 404, message: '대상을 찾을 수 없습니다.' },
  [ErrorCode.USER_EMAIL_REQUIRED]: { statusCode: 400, message: '이메일이 필요합니다.' },
  [ErrorCode.USER_EMAIL_DUPLICATE]: { statusCode: 409, message: '이미 가입된 이메일입니다.' },
  [ErrorCode.USER_PASSWORD_REQUIRED]: { statusCode: 400, message: '비밀번호가 필요합니다.' },
  [ErrorCode.USER_NAME_REQUIRED]: { statusCode: 400, message: '이름이 필요합니다.' },
  [ErrorCode.USER_NOT_FOUND]: { statusCode: 404, message: '존재하지 않는 계정입니다.' },
  [ErrorCode.USER_PASSWORD_INVALID]: { statusCode: 401, message: '비밀번호가 일치하지 않습니다.' },
  [ErrorCode.ADMIN_ID_REQUIRED]: { statusCode: 400, message: '관리자 ID가 필요합니다.' },
  [ErrorCode.ADMIN_NOT_FOUND]: { statusCode: 404, message: '관리자를 찾을 수 없습니다.' },
}; 