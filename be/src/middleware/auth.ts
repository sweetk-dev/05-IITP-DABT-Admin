import { Request, Response, NextFunction } from 'express';
import { TokenPayload, verifyToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { ErrorCode } from '../types/errorCodes';

// 인증된 요청 인터페이스
export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

/**
 * JWT 인증 미들웨어
 * 토큰을 검증하고 사용자 정보를 req.user에 할당
 */
export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return sendError(res, ErrorCode.UNAUTHORIZED, '인증 토큰이 필요합니다.');
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;

  if (!token) {
    return sendError(res, ErrorCode.UNAUTHORIZED, '유효한 토큰 형식이 아닙니다.');
  }

  const payload = verifyToken(token);
  if (!payload) {
    return sendError(res, ErrorCode.UNAUTHORIZED, '토큰이 유효하지 않거나 만료되었습니다.');
  }

  req.user = payload;
  next();
};

/**
 * 선택적 JWT 인증 미들웨어 (토큰이 없어도 통과)
 * 토큰이 있으면 검증하고, 없으면 그대로 통과
 */
export const optionalAuthJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return next(); // 토큰이 없어도 통과
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7) 
    : authHeader;

  if (!token) {
    return next(); // 토큰 형식이 잘못되어도 통과
  }

  const payload = verifyToken(token);
  if (payload) {
    req.user = payload; // 유효한 토큰이면 사용자 정보 설정
  }
  
  next();
};

/**
 * 역할 기반 인증 미들웨어
 * @param allowedRoles 허용된 역할 배열
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, ErrorCode.UNAUTHORIZED, '인증이 필요합니다.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(res, ErrorCode.FORBIDDEN, '접근 권한이 없습니다.');
    }

    next();
  };
};

/**
 * 관리자 전용 인증 미들웨어
 */
export const requireAdmin = requireRole(['admin']);

/**
 * 사용자 또는 관리자 인증 미들웨어
 */
export const requireUserOrAdmin = requireRole(['user', 'admin']); 