import { ErrorCode } from '@iitp-dabt/common';
import { findUserByEmail, updateLatestLoginAt } from '../../repositories/openApiUserRepository';
import { createLog } from '../../repositories/sysLogUserAccessRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDecryptedEnv } from '../../utils/decrypt';
import { appLogger } from '../../utils/logger';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt';

export interface LoginResult {
  token: string;
  refreshToken: string;
  userId: number;
  userType: 'U' | 'A';
  loginId?: string;
  name?: string;
}

export interface LogoutResult {
  success: boolean;
  message: string;
}

export interface RefreshResult {
  token: string;
  refreshToken: string;
  userId: number;
  userType: 'U' | 'A';
}

// 사용자 로그인
export const loginUser = async (email: string, password: string, ipAddr?: string, userAgent?: string): Promise<LoginResult> => {
  try {
    // 사용자 계정 조회
    const user = await findUserByEmail(email);
    if (!user) {
      // 로그인 실패 로그 기록
      await createLog({
        userId: 0,
        userType: 'U',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '존재하지 않는 사용자 계정',
        ipAddr,
        userAgent
      });
      throw new Error('USER_NOT_FOUND');
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      // 로그인 실패 로그 기록
      await createLog({
        userId: user.userId,
        userType: 'U',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '비밀번호 불일치',
        ipAddr,
        userAgent
      });
      throw new Error('USER_PASSWORD_INVALID');
    }

    // 계정 상태 확인
    if (user.status !== 'A') {
      // 로그인 실패 로그 기록
      await createLog({
        userId: user.userId,
        userType: 'U',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '비활성화된 계정',
        ipAddr,
        userAgent
      });
      throw new Error('USER_INACTIVE');
    }

    // JWT 토큰 생성
    const jwtSecret = getDecryptedEnv('JWT_SECRET');
    if (!jwtSecret) {
      appLogger.error('JWT_SECRET is not configured');
      throw new Error('JWT_SECRET_NOT_CONFIGURED');
    }

    // Access Token과 Refresh Token 생성
    const tokenPayload = {
      userId: user.userId,
      userType: 'U' as const,
      email: user.loginId
    };

    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 최근 로그인 시간 업데이트
    await updateLatestLoginAt(user.userId);

    // 로그인 성공 로그 기록
    await createLog({
      userId: user.userId,
      userType: 'U',
      logType: 'LOGIN',
      actResult: 'S',
      errMsg: '로그인 성공',
      ipAddr,
      userAgent
    });

    return {
      token,
      refreshToken,
      userId: user.userId,
      userType: 'U',
      loginId: user.loginId,
      name: user.userName
    };
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          throw new Error(ErrorCode.USER_NOT_FOUND.toString());
        case 'USER_PASSWORD_INVALID':
          throw new Error(ErrorCode.USER_PASSWORD_INVALID.toString());
        case 'USER_INACTIVE':
          throw new Error(ErrorCode.USER_INACTIVE.toString());
        case 'JWT_SECRET_NOT_CONFIGURED':
          throw new Error(ErrorCode.UNKNOWN_ERROR.toString());
      }
    }
    throw error;
  }
};

// 토큰 갱신
export const refreshUserToken = async (refreshToken: string, ipAddr?: string, userAgent?: string): Promise<RefreshResult> => {
  try {
    // Refresh Token 검증
    const payload = verifyToken(refreshToken);
    if (!payload || payload.userType !== 'U') {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    // 사용자 계정 조회
    if (!payload.email) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
    const user = await findUserByEmail(payload.email);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    // 새로운 토큰 생성
    const tokenPayload = {
      userId: user.userId,
      userType: 'U' as const,
      email: user.loginId
    };

    const newToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // 토큰 갱신 로그 기록
    await createLog({
      userId: user.userId,
      userType: 'U',
      logType: 'TOKEN_REFRESH',
      actResult: 'S',
      errMsg: '토큰 갱신 성공',
      ipAddr,
      userAgent
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      userId: user.userId,
      userType: 'U'
    };
  } catch (error) {
    appLogger.error('Token refresh error:', error);
    if (error instanceof Error) {
      switch (error.message) {
        case 'INVALID_REFRESH_TOKEN':
          throw new Error(ErrorCode.INVALID_TOKEN.toString());
        case 'USER_NOT_FOUND':
          throw new Error(ErrorCode.USER_NOT_FOUND.toString());
      }
    }
    throw new Error(ErrorCode.UNKNOWN_ERROR.toString());
  }
};

// 로그아웃 (공통)
export const logout = async (userId: number, userType: 'U' | 'A', reason: string = '사용자 로그아웃', ipAddr?: string, userAgent?: string): Promise<LogoutResult> => {
  try {
    // 토큰 만료인지 확인하여 로그 타입 결정
    const logType = reason === '토큰 만료' ? 'LOGOUT-T-EXP' : 'LOGOUT';

    // 로그아웃 로그 기록
    await createLog({
      userId,
      userType,
      logType,
      actResult: 'S',
      errMsg: reason,
      ipAddr,
      userAgent
    });

    return {
      success: true,
      message: '로그아웃 성공'
    };
  } catch (error) {
    appLogger.error('Logout error:', error);
    throw new Error(ErrorCode.LOGOUT_FAILED.toString());
  }
}; 