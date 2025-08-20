import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { getDecryptedEnv } from '../utils/decrypt';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../utils/errorHandler';
import { createLog } from '../repositories/sysLogUserAccessRepository';
import { appLogger } from '../utils/logger';
import { generateAccessToken } from '../utils/jwt';

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

      // Sliding-session: Access Token 만료 임박 시 신규 토큰 발급 후 헤더로 전달
      try {
        const nowSec = Math.floor(Date.now() / 1000);
        const timeLeft = (decoded.exp || 0) - nowSec;
        const REFRESH_THRESHOLD_SEC = 120; // 2분 미만 남으면 재발급
        if (timeLeft > 0 && timeLeft <= REFRESH_THRESHOLD_SEC) {
          const newAccess = generateAccessToken({ userId: decoded.userId, userType: decoded.userType });
          res.setHeader('X-New-Access-Token', newAccess);
          res.setHeader('X-Token-Refreshed', 'true');
          // FE가 읽을 수 있도록 CORS 노출 헤더 설정
          const expose = (res.getHeader('Access-Control-Expose-Headers') as string | undefined) || '';
          const merged = Array.from(new Set([...expose.split(',').map(s=>s.trim()).filter(Boolean), 'X-New-Access-Token', 'X-Token-Refreshed']));
          res.setHeader('Access-Control-Expose-Headers', merged.join(', '));
        }
      } catch (e) {
        appLogger.warn('Sliding token refresh failed', { error: e });
      }

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