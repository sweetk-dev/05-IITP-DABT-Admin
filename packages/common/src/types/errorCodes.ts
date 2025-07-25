export enum ErrorCode {
  // 공통 (9000~)
  SUCCESS = 0,
  UNKNOWN_ERROR = 9000,
  INVALID_REQUEST = 9001,
  UNAUTHORIZED = 9002,
  FORBIDDEN = 9003,
  NOT_FOUND = 9004,
  VALIDATION_ERROR = 9005,
  DATABASE_ERROR = 9006,
  EXTERNAL_API_ERROR = 9007,

  // User (1000~1999)
  USER_EMAIL_REQUIRED = 1001,
  USER_EMAIL_DUPLICATE = 1002,
  USER_PASSWORD_REQUIRED = 1003,
  USER_NAME_REQUIRED = 1004,
  USER_NOT_FOUND = 1005,
  USER_PASSWORD_INVALID = 1006,
  USER_ACCOUNT_INACTIVE = 1007,
  USER_EMAIL_INVALID_FORMAT = 1008,
  USER_PASSWORD_TOO_WEAK = 1009,

  // Admin (2000~2999)
  ADMIN_ID_REQUIRED = 2001,
  ADMIN_NOT_FOUND = 2002,
  ADMIN_PASSWORD_REQUIRED = 2003,
  ADMIN_PASSWORD_INVALID = 2004,
  ADMIN_INACTIVE = 2005,
  ADMIN_ACCOUNT_LOCKED = 2006,

  // Auth (3000~3999)
  TOKEN_REQUIRED = 3001,
  TOKEN_INVALID = 3002,
  TOKEN_EXPIRED = 3003,
  LOGIN_FAILED = 3004,
  LOGOUT_FAILED = 3005,
  REFRESH_TOKEN_INVALID = 3006,
  SESSION_EXPIRED = 3007,

  // FAQ (4000~4999)
  FAQ_NOT_FOUND = 4001,
  FAQ_CREATE_FAILED = 4002,
  FAQ_UPDATE_FAILED = 4003,
  FAQ_DELETE_FAILED = 4004,
  FAQ_TYPE_INVALID = 4005,

  // QnA (5000~5999)
  QNA_NOT_FOUND = 5001,
  QNA_CREATE_FAILED = 5002,
  QNA_UPDATE_FAILED = 5003,
  QNA_DELETE_FAILED = 5004,
  QNA_ANSWER_FAILED = 5005,
  QNA_ACCESS_DENIED = 5006,
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
  [ErrorCode.UNKNOWN_ERROR]: { statusCode: 500, message: '알 수 없는 오류가 발생했습니다.', showPopup: true },
  [ErrorCode.INVALID_REQUEST]: { statusCode: 400, message: '잘못된 요청입니다.', showPopup: true },
  [ErrorCode.UNAUTHORIZED]: { statusCode: 401, message: '인증이 필요합니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.FORBIDDEN]: { statusCode: 403, message: '권한이 없습니다.', showPopup: true },
  [ErrorCode.NOT_FOUND]: { statusCode: 404, message: '대상을 찾을 수 없습니다.', showPopup: true },
  [ErrorCode.VALIDATION_ERROR]: { statusCode: 400, message: '입력값 검증에 실패했습니다.', showPopup: true },
  [ErrorCode.DATABASE_ERROR]: { statusCode: 500, message: '데이터베이스 오류가 발생했습니다.', showPopup: true },
  [ErrorCode.EXTERNAL_API_ERROR]: { statusCode: 502, message: '외부 서비스 연결에 실패했습니다.', showPopup: true },

  // User
  [ErrorCode.USER_EMAIL_REQUIRED]: { statusCode: 400, message: '이메일이 필요합니다.', showPopup: true },
  [ErrorCode.USER_EMAIL_DUPLICATE]: { statusCode: 409, message: '이미 가입된 이메일입니다.', showPopup: true },
  [ErrorCode.USER_PASSWORD_REQUIRED]: { statusCode: 400, message: '비밀번호가 필요합니다.', showPopup: true },
  [ErrorCode.USER_NAME_REQUIRED]: { statusCode: 400, message: '이름이 필요합니다.', showPopup: true },
  [ErrorCode.USER_NOT_FOUND]: { statusCode: 404, message: '존재하지 않는 계정입니다.', showPopup: true },
  [ErrorCode.USER_PASSWORD_INVALID]: { statusCode: 401, message: '비밀번호가 일치하지 않습니다.', showPopup: true },
  [ErrorCode.USER_ACCOUNT_INACTIVE]: { statusCode: 403, message: '비활성화된 계정입니다.', showPopup: true },
  [ErrorCode.USER_EMAIL_INVALID_FORMAT]: { statusCode: 400, message: '올바른 이메일 형식이 아닙니다.', showPopup: true },
  [ErrorCode.USER_PASSWORD_TOO_WEAK]: { statusCode: 400, message: '비밀번호가 너무 약합니다.', showPopup: true },

  // Admin
  [ErrorCode.ADMIN_ID_REQUIRED]: { statusCode: 400, message: '관리자 ID가 필요합니다.', showPopup: true },
  [ErrorCode.ADMIN_NOT_FOUND]: { statusCode: 404, message: '관리자를 찾을 수 없습니다.', showPopup: true },
  [ErrorCode.ADMIN_PASSWORD_REQUIRED]: { statusCode: 400, message: '관리자 비밀번호가 필요합니다.', showPopup: true },
  [ErrorCode.ADMIN_PASSWORD_INVALID]: { statusCode: 401, message: '관리자 비밀번호가 일치하지 않습니다.', showPopup: true },
  [ErrorCode.ADMIN_INACTIVE]: { statusCode: 403, message: '비활성화된 관리자 계정입니다.', showPopup: true },
  [ErrorCode.ADMIN_ACCOUNT_LOCKED]: { statusCode: 423, message: '잠긴 관리자 계정입니다.', showPopup: true },

  // Auth
  [ErrorCode.TOKEN_REQUIRED]: { statusCode: 401, message: '인증 토큰이 필요합니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.TOKEN_INVALID]: { statusCode: 401, message: '유효하지 않은 토큰입니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.TOKEN_EXPIRED]: { statusCode: 401, message: '만료된 토큰입니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.LOGIN_FAILED]: { statusCode: 401, message: '로그인에 실패했습니다.', showPopup: true },
  [ErrorCode.LOGOUT_FAILED]: { statusCode: 500, message: '로그아웃 처리 중 오류가 발생했습니다.', showPopup: true },
  [ErrorCode.REFRESH_TOKEN_INVALID]: { statusCode: 401, message: '새로고침 토큰이 유효하지 않습니다.', autoLogout: true, redirectTo: '/login' },
  [ErrorCode.SESSION_EXPIRED]: { statusCode: 401, message: '세션이 만료되었습니다.', autoLogout: true, redirectTo: '/login' },

  // FAQ
  [ErrorCode.FAQ_NOT_FOUND]: { statusCode: 404, message: 'FAQ를 찾을 수 없습니다.', showPopup: true },
  [ErrorCode.FAQ_CREATE_FAILED]: { statusCode: 500, message: 'FAQ 생성에 실패했습니다.', showPopup: true },
  [ErrorCode.FAQ_UPDATE_FAILED]: { statusCode: 500, message: 'FAQ 수정에 실패했습니다.', showPopup: true },
  [ErrorCode.FAQ_DELETE_FAILED]: { statusCode: 500, message: 'FAQ 삭제에 실패했습니다.', showPopup: true },
  [ErrorCode.FAQ_TYPE_INVALID]: { statusCode: 400, message: '올바르지 않은 FAQ 유형입니다.', showPopup: true },

  // QnA
  [ErrorCode.QNA_NOT_FOUND]: { statusCode: 404, message: 'QnA를 찾을 수 없습니다.', showPopup: true },
  [ErrorCode.QNA_CREATE_FAILED]: { statusCode: 500, message: 'QnA 생성에 실패했습니다.', showPopup: true },
  [ErrorCode.QNA_UPDATE_FAILED]: { statusCode: 500, message: 'QnA 수정에 실패했습니다.', showPopup: true },
  [ErrorCode.QNA_DELETE_FAILED]: { statusCode: 500, message: 'QnA 삭제에 실패했습니다.', showPopup: true },
  [ErrorCode.QNA_ANSWER_FAILED]: { statusCode: 500, message: 'QnA 답변 등록에 실패했습니다.', showPopup: true },
  [ErrorCode.QNA_ACCESS_DENIED]: { statusCode: 403, message: 'QnA에 접근할 권한이 없습니다.', showPopup: true },
}; 