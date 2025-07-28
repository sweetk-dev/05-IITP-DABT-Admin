import { ErrorCode } from '@iitp-dabt/common';
import { findAdminByLoginId, updateLatestLoginAt } from '../../repositories/sysAdmAccountRepository';
import { createLog } from '../../repositories/sysLogUserAccessRepository';
import bcrypt from 'bcrypt';
import { appLogger } from '../../utils/logger';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt';

export interface LoginResult {
  token: string;
  refreshToken: string;
  userId: number;
  userType: 'U' | 'A';
  loginId?: string;
  name?: string;
  roleCode?: string;
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

// 관리자 로그인
export const loginAdmin = async (loginId: string, password: string, ipAddr?: string, userAgent?: string): Promise<LoginResult> => {
  try {
    // 관리자 계정 조회
    const admin = await findAdminByLoginId(loginId);
    if (!admin) {
      // 로그인 실패 로그 기록
      await createLog({
        userId: 0,
        userType: 'A',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '존재하지 않는 관리자 계정',
        ipAddr,
        userAgent
      });
      throw new Error('ADMIN_NOT_FOUND');
    }

    // 비밀번호 검증
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      // 로그인 실패 로그 기록
      await createLog({
        userId: admin.admId,
        userType: 'A',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '비밀번호 불일치',
        ipAddr,
        userAgent
      });
      throw new Error('ADMIN_PASSWORD_INVALID');
    }

    // 계정 상태 확인
    if (admin.status !== 'A') {
      // 로그인 실패 로그 기록
      await createLog({
        userId: admin.admId,
        userType: 'A',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '비활성화된 계정',
        ipAddr,
        userAgent
      });
      throw new Error('ADMIN_INACTIVE');
    }

    // Access Token과 Refresh Token 생성
    const tokenPayload = {
      userId: admin.admId,
      userType: 'A' as const,
      loginId: admin.loginId
    };

    const token = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 최근 로그인 시간 업데이트
    await updateLatestLoginAt(admin.admId);

    // 로그인 성공 로그 기록
    await createLog({
      userId: admin.admId,
      userType: 'A',
      logType: 'LOGIN',
      actResult: 'S',
      errMsg: '로그인 성공',
      ipAddr,
      userAgent
    });

    return {
      token,
      refreshToken,
      userId: admin.admId,
      userType: 'A',
      loginId: admin.loginId,
      name: admin.name,
      roleCode: admin.roles
    };
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'ADMIN_NOT_FOUND':
          throw new Error(ErrorCode.ADMIN_NOT_FOUND.toString());
        case 'ADMIN_PASSWORD_INVALID':
          throw new Error(ErrorCode.ADMIN_PASSWORD_INVALID.toString());
        case 'ADMIN_INACTIVE':
          throw new Error(ErrorCode.ADMIN_INACTIVE.toString());
        case 'JWT_SECRET_NOT_CONFIGURED':
          throw new Error(ErrorCode.UNKNOWN_ERROR.toString());
      }
    }
    throw error;
  }
};

// 관리자 토큰 갱신
export const refreshAdminToken = async (refreshToken: string, ipAddr?: string, userAgent?: string): Promise<RefreshResult> => {
  try {
    // Refresh Token 검증
    const payload = verifyToken(refreshToken);
    if (!payload || payload.userType !== 'A') {
      throw new Error('INVALID_REFRESH_TOKEN');
    }

    // 관리자 계정 조회
    if (!payload.loginId) {
      throw new Error('INVALID_REFRESH_TOKEN');
    }
    const admin = await findAdminByLoginId(payload.loginId);
    if (!admin) {
      throw new Error('ADMIN_NOT_FOUND');
    }

    // 새로운 토큰 생성
    const tokenPayload = {
      userId: admin.admId,
      userType: 'A' as const,
      loginId: admin.loginId
    };

    const newToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // 토큰 갱신 로그 기록
    await createLog({
      userId: admin.admId,
      userType: 'A',
      logType: 'TOKEN_REFRESH',
      actResult: 'S',
      errMsg: '토큰 갱신 성공',
      ipAddr,
      userAgent
    });

    return {
      token: newToken,
      refreshToken: newRefreshToken,
      userId: admin.admId,
      userType: 'A'
    };
  } catch (error) {
    appLogger.error('Admin token refresh error:', error);
    if (error instanceof Error) {
      switch (error.message) {
        case 'INVALID_REFRESH_TOKEN':
          throw new Error(ErrorCode.INVALID_TOKEN.toString());
        case 'ADMIN_NOT_FOUND':
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