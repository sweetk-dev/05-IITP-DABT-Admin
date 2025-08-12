// 에러 코드 정의
export enum ErrorCode {
  // 기본 에러
  UNKNOWN_ERROR = 11000,
  VALIDATION_ERROR = 11001,
  DATABASE_ERROR = 11002,
  NETWORK_ERROR = 11003,
  
    // 요청 관련
  INVALID_REQUEST = 12000,
  MISSING_REQUIRED_FIELD = 12001,
  INVALID_PARAMETER = 12002,
  REQUEST_TIMEOUT = 12003,
  EMAIL_ALREADY_EXISTS = 12020,
  EMAIL_INVALID_FORMAT = 12021,
  
  
  // 서버 관련
  SYS_INTERNAL_SERVER_ERROR = 19000,
  SYS_SERVICE_UNAVAILABLE = 19001,
  SYS_MAINTENANCE_MODE = 19002,


  //System 정보 관련
  SYS_CODE_NOT_FOUND = 13000,
  SYS_CODE_CREATE_FAILED = 13001,
  SYS_CODE_UPDATE_FAILED = 13002,
  SYS_CODE_DELETE_FAILED = 13003,
  SYS_CODE_INVALID = 13004,
  SYS_CODE_ALREADY_EXISTS = 13005,
  SYS_CODE_INACTIVE = 13006,

  SYS_CODE_GRP_NOT_FOUND = 13020,
  SYS_CODE_GRP_CREATE_FAILED = 13021,
  SYS_CODE_GRP_UPDATE_FAILED = 13022,
  SYS_CODE_GRP_DELETE_FAILED = 13023,
  SYS_CODE_GRP_INVALID = 13024,
  SYS_CODE_GRP_ALREADY_EXISTS = 13025,
  SYS_CODE_GRP_INACTIVE = 13026,
  SYS_CODE_GRP_NOT_FOUND_BY_CODE = 13030,
  SYS_CODE_GRP_NOT_FOUND_BY_ID = 13031,
  SYS_CODE_GRP_NOT_FOUND_BY_SYS_CODE = 13032, 


  SYS_CODE_PARENT_NOT_FOUND_BY_GRP = 13050, 
  SYS_CODE_PARENT_NOT_FOUND_BY_CODE = 13051,

  SYS_CODE_CHILD_NOT_FOUND_BY_GRP = 13060,
  SYS_CODE_CHILD_NOT_FOUND_BY_CODE = 13061,


  ////////////////////////
  //// 인증 및 사용자 관련 에러 코드  
  ///////////////////////
  
  // 인증 관련
  UNAUTHORIZED = 14000,
  LOGIN_FAILED = 14001,
  LOGOUT_FAILED = 14002,
  TOKEN_EXPIRED = 14003,
  INVALID_TOKEN = 14004,
  ACCESS_DENIED = 14005,
  TOKEN_REQUIRED = 14006,
  TOKEN_INVALID = 14007,
  FORBIDDEN = 14008,
  
  // 사용자 관련
  USER_NOT_FOUND = 16000,
  USER_ALREADY_EXISTS = 16001,
  INVALID_EMAIL = 16002,
  INVALID_PASSWORD = 16003,
  USER_PASSWORD_TOO_WEAK = 16004,
  
  // Admin 관련
  ADMIN_NOT_FOUND = 17000,
  ADMIN_ALREADY_EXISTS = 17001,
  ADMIN_CREATE_FAILED = 17002,
  ADMIN_UPDATE_FAILED = 17003,
  ADMIN_DELETE_FAILED = 17004,
  ADMIN_PASSWORD_CHANGE_FAILED = 17005,
  ADMIN_STATUS_CHANGE_FAILED = 17006,
  



  ////////////////////////
  //// Service Bessiness Logic 에러 코드
  ///////////////////////

  //Account 관련
  ACCOUNT_NOT_FOUND = 20000,
  ACCOUNT_CREATE_FAILED = 20001,
  ACCOUNT_UPDATE_FAILED = 20002,
  ACCOUNT_DELETE_FAILED = 20003,
  ACCOUNT_ALREADY_EXISTS = 20005,
  ACCOUNT_EMAIL_DUPLICATE = 20040,
  ACCOUNT_ADMIN_ROLE_NOT_FOUND = 20020,
  ACCOUNT_INACTIVE = 20050,
  ACCOUNT_PASSWORD_INVALID = 20051,
  

  //Notice 관련
  NOTICE_NOT_FOUND = 21000, 
  NOTICE_CREATE_FAILED = 21001,
  NOTICE_UPDATE_FAILED = 21002, 
  NOTICE_DELETE_FAILED = 21003,
  NOTICE_ACCESS_DENIED = 21004,

 // FAQ 관련
  FAQ_NOT_FOUND = 22000,
  FAQ_CREATE_FAILED = 22001,
  FAQ_UPDATE_FAILED = 22002,
  FAQ_DELETE_FAILED = 22003,
  
  // QnA 관련
  QNA_NOT_FOUND = 23000,
  QNA_CREATE_FAILED = 23001,
  QNA_UPDATE_FAILED = 23002,
  QNA_DELETE_FAILED = 23003,
  QNA_ANSWER_FAILED = 23004,
  QNA_ACCESS_DENIED = 23005,
  

  // Open API 관련
  OPEN_API_NOT_FOUND = 24000,
  OPEN_API_CREATE_FAILED = 24001,
  OPEN_API_UPDATE_FAILED = 24002,
  OPEN_API_DELETE_FAILED = 24003,
  OPEN_API_EXTENDED_FAILED = 24004
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
  [ErrorCode.REQUEST_TIMEOUT]: {
    message: '요청 시간이 초과되었습니다.',
    statusCode: 408
  },
    [ErrorCode.EMAIL_ALREADY_EXISTS]: {
    message: '이미 사용 중인 이메일입니다.',
    statusCode: 409
  },
  [ErrorCode.EMAIL_INVALID_FORMAT]: {
    message: '이메일 형식이 올바르지 않습니다.',
    statusCode: 400
  },
  
  // 서버 관련
  [ErrorCode.SYS_INTERNAL_SERVER_ERROR]: {
    message: '서버 내부 오류가 발생했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_SERVICE_UNAVAILABLE]: {
    message: '서비스가 일시적으로 사용할 수 없습니다.',
    statusCode: 503
  },
  [ErrorCode.SYS_MAINTENANCE_MODE]: {
    message: '시스템 점검 중입니다. 잠시 후 다시 시도해주세요.',
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
  [ErrorCode.TOKEN_REQUIRED]: {
    message: '토큰이 필요합니다.',
    statusCode: 401
  },
  [ErrorCode.TOKEN_INVALID]: {
    message: '유효하지 않은 토큰입니다.',
    statusCode: 401
  },
  [ErrorCode.FORBIDDEN]: {
    message: '접근이 거부되었습니다.',
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
  [ErrorCode.USER_PASSWORD_TOO_WEAK]: {
    message: '비밀번호가 너무 약합니다.',
    statusCode: 400
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
  

  // Open API 관련
  [ErrorCode.OPEN_API_NOT_FOUND]: {
    message: 'Open API를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.OPEN_API_CREATE_FAILED]: {
    message: 'Open API 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.OPEN_API_UPDATE_FAILED]: {
    message: 'Open API 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.OPEN_API_DELETE_FAILED]: {
    message: 'Open API 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.OPEN_API_EXTENDED_FAILED]: {
    message: 'Open API 기간 연장에 실패했습니다.',
    statusCode: 500
  },

  // System 정보 관련
  [ErrorCode.SYS_CODE_NOT_FOUND]: {
    message: '시스템 코드를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_CREATE_FAILED]: {
    message: '시스템 코드 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_CODE_UPDATE_FAILED]: {
    message: '시스템 코드 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_CODE_DELETE_FAILED]: {
    message: '시스템 코드 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_CODE_INVALID]: {
    message: '유효하지 않은 시스템 코드입니다.',
    statusCode: 400
  },
  [ErrorCode.SYS_CODE_ALREADY_EXISTS]: {
    message: '이미 존재하는 시스템 코드입니다.',
    statusCode: 409
  },
  [ErrorCode.SYS_CODE_INACTIVE]: {
    message: '비활성화된 시스템 코드입니다.',
    statusCode: 403
  },
  [ErrorCode.SYS_CODE_GRP_NOT_FOUND]: {
    message: '시스템 코드 그룹을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_GRP_CREATE_FAILED]: {
    message: '시스템 코드 그룹 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_CODE_GRP_UPDATE_FAILED]: {
    message: '시스템 코드 그룹 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_CODE_GRP_DELETE_FAILED]: {
    message: '시스템 코드 그룹 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.SYS_CODE_GRP_INVALID]: {
    message: '유효하지 않은 시스템 코드 그룹입니다.',
    statusCode: 400
  },
  [ErrorCode.SYS_CODE_GRP_ALREADY_EXISTS]: {
    message: '이미 존재하는 시스템 코드 그룹입니다.',
    statusCode: 409
  },
  [ErrorCode.SYS_CODE_GRP_INACTIVE]: {
    message: '비활성화된 시스템 코드 그룹입니다.',
    statusCode: 403
  },
  [ErrorCode.SYS_CODE_GRP_NOT_FOUND_BY_CODE]: {
    message: '코드로 시스템 코드 그룹을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_GRP_NOT_FOUND_BY_ID]: {
    message: 'ID로 시스템 코드 그룹을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_GRP_NOT_FOUND_BY_SYS_CODE]: {
    message: '시스템 코드로 그룹을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_PARENT_NOT_FOUND_BY_GRP]: {
    message: '그룹으로 부모 코드를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_PARENT_NOT_FOUND_BY_CODE]: {
    message: '코드로 부모 코드를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_CHILD_NOT_FOUND_BY_GRP]: {
    message: '그룹으로 자식 코드를 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.SYS_CODE_CHILD_NOT_FOUND_BY_CODE]: {
    message: '코드로 자식 코드를 찾을 수 없습니다.',
    statusCode: 404
  },

  // Account 관련
  [ErrorCode.ACCOUNT_NOT_FOUND]: {
    message: '계정을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.ACCOUNT_CREATE_FAILED]: {
    message: '계정 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ACCOUNT_UPDATE_FAILED]: {
    message: '계정 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ACCOUNT_DELETE_FAILED]: {
    message: '계정 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.ACCOUNT_ALREADY_EXISTS]: {
    message: '이미 존재하는 계정입니다.',
    statusCode: 409
  },
  [ErrorCode.ACCOUNT_EMAIL_DUPLICATE]: {
    message: '이미 사용 중인 이메일입니다.',
    statusCode: 409
  },
  [ErrorCode.ACCOUNT_ADMIN_ROLE_NOT_FOUND]: {
    message: '관리자 역할을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.ACCOUNT_INACTIVE]: {
    message: '비활성화된 계정입니다.',
    statusCode: 403
  },
  [ErrorCode.ACCOUNT_PASSWORD_INVALID]: {
    message: '비밀번호가 올바르지 않습니다.',
    statusCode: 400
  },


  // Notice 관련
  [ErrorCode.NOTICE_NOT_FOUND]: {
    message: '공지사항을 찾을 수 없습니다.',
    statusCode: 404
  },
  [ErrorCode.NOTICE_CREATE_FAILED]: {
    message: '공지사항 생성에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.NOTICE_UPDATE_FAILED]: {
    message: '공지사항 수정에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.NOTICE_DELETE_FAILED]: {
    message: '공지사항 삭제에 실패했습니다.',
    statusCode: 500
  },
  [ErrorCode.NOTICE_ACCESS_DENIED]: {
    message: '공지사항에 접근할 권한이 없습니다.',
    statusCode: 403
  }
 
}; 