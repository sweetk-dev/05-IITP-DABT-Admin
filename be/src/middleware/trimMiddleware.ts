import { Request, Response, NextFunction } from 'express';
import { trimStringFieldsExcept } from '../utils/trimUtils';

/**
 * API 요청 body의 string 필드들을 자동으로 trim 처리하는 미들웨어
 * 
 * @param excludeFields trim 처리에서 제외할 필드명 배열 (예: ['password'])
 */
export function createTrimMiddleware(excludeFields: string[] = []) {
  return (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    // POST, PUT, PATCH 요청의 body만 trim 처리
    if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
      req.body = trimStringFieldsExcept(req.body, excludeFields);
    }
    
    // query parameters도 trim 처리 (선택적)
    if (req.query && Object.keys(req.query).length > 0) {
      req.query = trimStringFieldsExcept(req.query, excludeFields);
    }
    
    next();
  };
}

/**
 * 기본 trim 미들웨어 (비밀번호 필드 제외)
 */
export const trimMiddleware = createTrimMiddleware(['password', 'confirmPassword']);

/**
 * 모든 필드 trim 미들웨어 (제외 필드 없음)
 */
export const trimAllMiddleware = createTrimMiddleware([]);

/**
 * 특정 필드만 제외하는 trim 미들웨어
 */
export const createCustomTrimMiddleware = (excludeFields: string[]) => 
  createTrimMiddleware(excludeFields); 