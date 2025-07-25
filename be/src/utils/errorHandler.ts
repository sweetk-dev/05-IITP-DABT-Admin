import { Response, Request } from 'express';
import { ErrorCode, ErrorMeta, ErrorMetaMap } from '@iitp-dabt/common';
import { appLogger } from './logger';

interface RequestWithId extends Request {
  requestId?: string;
  user?: {
    userId: number;
    userType: 'U' | 'A';
  };
}

/**
 * 에러 응답 전송
 * @param res Express Response 객체
 * @param errorCode 에러 코드
 * @param customMessage 커스텀 메시지 (선택사항)
 * @param details 추가 상세 정보 (선택사항)
 * @param skipLogging 로깅 건너뛰기 (선택사항, 기본값: false)
 */
export const sendError = (
  res: Response, 
  errorCode: ErrorCode, 
  customMessage?: string,
  details?: any,
  skipLogging: boolean = false
) => {
  const errorMeta: ErrorMeta = ErrorMetaMap[errorCode];
  const req = res.req as unknown as RequestWithId;
  
  // 로그 기록 (skipLogging이 true가 아닌 경우에만)
  if (!skipLogging) {
    appLogger.error(`[${errorCode}] ${customMessage || errorMeta.message}`, {
      requestId: req.requestId,
      errorCode,
      statusCode: errorMeta.statusCode,
      customMessage,
      details,
      url: req.url,
      method: req.method,
      userAgent: req.headers['user-agent'] as string
    });
  }

  // 응답 전송
  res.status(errorMeta.statusCode).json({
    success: false,
    errorCode,
    errorMessage: customMessage || errorMeta.message,
    ...(details && { details })
  });
};

/**
 * 성공 응답 전송
 * @param res Express Response 객체
 * @param data 응답 데이터
 * @param message 성공 메시지 (선택사항)
 * @param event 비즈니스 이벤트명 (선택사항)
 * @param eventData 이벤트 데이터 (선택사항)
 */
export const sendSuccess = (
  res: Response, 
  data: any, 
  message?: string,
  event?: string,
  eventData?: any
) => {
  const req = res.req as unknown as RequestWithId;
  
  // 비즈니스 이벤트 로깅
  if (event) {
    appLogger.info(`Business Event: ${event}`, {
      requestId: req.requestId,
      event,
      eventData,
      url: req.url,
      method: req.method,
      userId: req.user?.userId,
      userType: req.user?.userType
    });
  }

  res.json({
    success: true,
    data,
    ...(message && { message })
  });
};

/**
 * 유효성 검증 에러 전송
 * @param res Express Response 객체
 * @param field 필드명
 * @param message 커스텀 메시지
 */
export const sendValidationError = (res: Response, field: string, message: string) => {
  sendError(
    res, 
    ErrorCode.VALIDATION_ERROR, 
    `${field}: ${message}`
  );
};

/**
 * 데이터베이스 에러 전송
 * @param res Express Response 객체
 * @param operation 작업명 (예: '조회', '생성', '수정', '삭제')
 * @param entity 엔티티명 (예: '사용자', 'FAQ', 'QnA')
 */
export const sendDatabaseError = (res: Response, operation: string, entity: string) => {
  sendError(
    res, 
    ErrorCode.DATABASE_ERROR, 
    `${entity} ${operation} 중 데이터베이스 오류가 발생했습니다.`
  );
}; 