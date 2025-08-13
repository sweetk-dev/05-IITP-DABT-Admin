import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getDecryptedEnv } from '../utils/decrypt';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../utils/errorHandler';
import { createLog } from '../repositories/sysLogUserAccessRepository';
import { appLogger } from '../utils/logger';

interface JwtPayload {
  userId: number;
  userType: 'U' | 'A';
  iat: number;
  exp: number;
}

export const authMiddleware: RequestHandler<any, any, any, any> = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, ErrorCode.TOKEN_REQUIRED);
    }

    const token = authHeader.substring(7);
    const jwtSecret = getDecryptedEnv('JWT_SECRET');

    if (!jwtSecret) {
      appLogger.error('JWT_SECRET is not configured');
      return sendError(res, ErrorCode.UNKNOWN_ERROR);
    }

    try {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      // 토큰 정보를 request에 추가
      req.user = {
        userId: decoded.userId,
        userType: decoded.userType,
        actorTag: `${decoded.userType}:${decoded.userId}`
      };

      next();
    } catch (jwtError) {
      // JWT 검증 실패 시
      if (jwtError instanceof jwt.TokenExpiredError) {
        // 토큰 만료 시 자동으로 로그아웃 로그 기록
        try {
          const decoded = jwt.decode(token) as JwtPayload;
          if (decoded && decoded.userId && decoded.userType) {
            await createLog({
              userId: decoded.userId,
              userType: decoded.userType,
              logType: 'LOGOUT-T-EXP',
              actResult: 'S',
              errMsg: '토큰 만료',
              ipAddr: req.ip || req.connection.remoteAddress,
              userAgent: req.headers['user-agent']
            });
          }
        } catch (logError) {
          appLogger.error('토큰 만료 로그 기록 실패:', logError);
        }

        return sendError(res, ErrorCode.TOKEN_EXPIRED);
      } else {
        return sendError(res, ErrorCode.TOKEN_INVALID);
      }
    }
  } catch (error) {
    appLogger.error('Auth middleware error:', error);
    return sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// 관리자 전용 미들웨어
export const adminAuthMiddleware: RequestHandler<any, any, any, any> = async (req, res, next) => {
  try {
    await authMiddleware(req, res, (err) => {
      if (err) return next(err);

      // 관리자 권한 확인
      if (req.user?.userType !== 'A') {
        return sendError(res, ErrorCode.FORBIDDEN);
      }

      next();
    });
  } catch (error) {
    appLogger.error('Admin auth middleware error:', error);
    return sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 