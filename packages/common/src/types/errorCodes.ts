// 에러 코드 정의
export enum ErrorCode {
  // 기본 에러
  UNKNOWN_ERROR = 1000,
  VALIDATION_ERROR = 1001,
  DATABASE_ERROR = 1002,
  NETWORK_ERROR = 1003,
  
  // 인증 관련
  UNAUTHORIZED = 2000,
  LOGIN_FAILED = 2001,
  LOGOUT_FAILED = 2002,
  TOKEN_EXPIRED = 2003,
  INVALID_TOKEN = 2004,
  ACCESS_DENIED = 2005,
  
  // 사용자 관련
  USER_NOT_FOUND = 3000,
  USER_ALREADY_EXISTS = 3001,
  INVALID_EMAIL = 3002,
  INVALID_PASSWORD = 3003,
  EMAIL_ALREADY_EXISTS = 3004,
  
  // FAQ 관련
  FAQ_NOT_FOUND = 4000,
  FAQ_CREATE_FAILED = 4001,
  FAQ_UPDATE_FAILED = 4002,
  FAQ_DELETE_FAILED = 4003,
  FAQ_STATS_FAILED = 4004,
  
  // QnA 관련
  QNA_NOT_FOUND = 5000,
  QNA_CREATE_FAILED = 5001,
  QNA_UPDATE_FAILED = 5002,
  QNA_DELETE_FAILED = 5003,
  QNA_ANSWER_FAILED = 5004,
  QNA_ACCESS_DENIED = 5005,
  
  // Admin 관련
  ADMIN_NOT_FOUND = 6000,
  ADMIN_ALREADY_EXISTS = 6001,
  ADMIN_CREATE_FAILED = 6002,
  ADMIN_UPDATE_FAILED = 6003,
  ADMIN_DELETE_FAILED = 6004,
  ADMIN_PASSWORD_CHANGE_FAILED = 6005,
  ADMIN_STATUS_CHANGE_FAILED = 6006,
  
  // 요청 관련
  INVALID_REQUEST = 7000,
  MISSING_REQUIRED_FIELD = 7001,
  INVALID_PARAMETER = 7002,
  
  // 서버 관련
  INTERNAL_SERVER_ERROR = 8000,
  SERVICE_UNAVAILABLE = 8001,
  MAINTENANCE_MODE = 8002
}

// 기본 에러 메타데이터 (BE/FE 공통)
export interface ErrorMeta {
  message: string;
  statusCode: number;
}

// 기본 에러 메타데이터 맵 (모든 ErrorCode 포함)
export const ErrorMetaMap: Record<ErrorCode, ErrorMeta> = {
  // 기본 에러
  [ErrorCode.UNKNOWN_ERROR]: {
    message: '알 수 없는 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.VALIDATION_ERROR]: {
    message: '입력 데이터가 올바르지 않습니다.',
    statusCode: 400
  },
  [ErrorCode.DATABASE_ERROR]: {
    message: '데이터베이스 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.NETWORK_ERROR]: {
    message: '네트워크 오류가 발생했습니다.',
    statusCode: 503
  },
  
  // 인증 관련
  [ErrorCode.UNAUTHORIZED]: {
    message: '로그인이 필요합니다.',
    statusCode: 401
  },
  [ErrorCode.LOGIN_FAILED]: {
    message: '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.',
    statusCode: 401
  },
  [ErrorCode.LOGOUT_FAILED]: {
    message: '로그아웃 처리 중 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.TOKEN_EXPIRED]: {
    message: '세션이 만료되었습니다. 다시 로그인해주세요.',
    statusCode: 401
  },
  [ErrorCode.INVALID_TOKEN]: {
    message: '유효하지 않은 토큰입니다.',
    statusCode: 401
  },
  [ErrorCode.ACCESS_DENIED]: {
    message: '접근 권한이 없습니다.',
    statusCode: 403
  },
  
  // 사용자 관련
  [ErrorCode.USER_NOT_FOUND]: {
    message: '사용자를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.USER_ALREADY_EXISTS]: {
    message: '이미 존재하는 사용자입니다.',
    statusCode: 409
  },
  [ErrorCode.INVALID_EMAIL]: {
    message: '올바르지 않은 이메일 형식입니다.',
    statusCode: 400
  },
  [ErrorCode.INVALID_PASSWORD]: {
    message: '올바르지 않은 비밀번호 형식입니다.',
    statusCode: 400
  },
  [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    message: '이미 사용 중인 이메일입니다.',
    statusCode: 409
  },
  
  // FAQ 관련
  [ErrorCode.FAQ_NOT_FOUND]: {
    message: 'FAQ를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.FAQ_CREATE_FAILED]: {
    message: 'FAQ 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.FAQ_UPDATE_FAILED]: {
    message: 'FAQ 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.FAQ_DELETE_FAILED]: {
    message: 'FAQ 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.FAQ_STATS_FAILED]: {
    message: 'FAQ 통계 조회에 실패했습니다.',
    statusCode: 500
  },
  
  // QnA 관련
  [ErrorCode.QNA_NOT_FOUND]: {
    message: 'QnA를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.QNA_CREATE_FAILED]: {
    message: 'QnA 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.QNA_UPDATE_FAILED]: {
    message: 'QnA 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.QNA_DELETE_FAILED]: {
    message: 'QnA 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.QNA_ANSWER_FAILED]: {
    message: 'QnA 답변 등록에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.QNA_ACCESS_DENIED]: {
    message: 'QnA에 접근할 권한이 없습니다.',
    statusCode: 403
  },
  
  // Admin 관련
  [ErrorCode.ADMIN_NOT_FOUND]: {
    message: '관리자를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.ADMIN_ALREADY_EXISTS]: {
    message: '이미 존재하는 관리자입니다.',
    statusCode: 409
  },
  [ErrorCode.ADMIN_CREATE_FAILED]: {
    message: '관리자 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ADMIN_UPDATE_FAILED]: {
    message: '관리자 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ADMIN_DELETE_FAILED]: {
    message: '관리자 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ADMIN_PASSWORD_CHANGE_FAILED]: {
    message: '비밀번호 변경에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ADMIN_STATUS_CHANGE_FAILED]: {
    message: '상태 변경에 실패했습니다.',
    statusCode: 500
  },
  
  // 요청 관련
  [ErrorCode.INVALID_REQUEST]: {
    message: '잘못된 요청입니다.',
    statusCode: 400
  },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    message: '필수 필드가 누락되었습니다.',
    statusCode: 400
  },
  [ErrorCode.INVALID_PARAMETER]: {
    message: '잘못된 파라미터입니다.',
    statusCode: 400
  },
  
  // 서버 관련
  [ErrorCode.INTERNAL_SERVER_ERROR]: {
    message: '서버 내부 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.SERVICE_UNAVAILABLE]: {
    message: '서비스가 일시적으로 사용할 수 없습니다.',
    statusCode: 503
  },
  [ErrorCode.MAINTENANCE_MODE]: {
    message: '시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
    statusCode: 503
  }
}; 