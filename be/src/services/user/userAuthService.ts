import { ErrorCode } from '@iitp-dabt/common';
import { findUserByEmail, updateLatestLoginAt } from '../../repositories/openApiUserRepository';
import { createLog } from '../../repositories/sysLogUserAccessRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDecryptedEnv } from '../../utils/decrypt';

export interface LoginResult {
  token: string;
  userId: number;
  userType: 'U' | 'A';
  loginId?: string;
  email?: string;
  name?: string;
}

export interface LogoutResult {
  success: boolean;
  message: string;
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
        userId: user.id,
        userType: 'U',
        logType: 'LOGIN',
        actResult: 'F',
        errMsg: '비밀번호 불일치',
        ipAddr,
        userAgent
      });
      throw new Error('USER_PASSWORD_INVALID');
    }

    // JWT 토큰 생성
    const jwtSecret = getDecryptedEnv('JWT_SECRET');
    const token = jwt.sign(
      {
        userId: user.id,
        userType: 'U',
        email: user.email
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

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
      userId: user.userId,
      userType: 'U',
      email: user.loginId,
      name: user.userName
    };
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case 'USER_NOT_FOUND':
          throw new Error(ErrorCode.USER_NOT_FOUND.toString());
        case 'USER_PASSWORD_INVALID':
          throw new Error(ErrorCode.USER_PASSWORD_INVALID.toString());
      }
    }
    throw error;
  }
};

// 로그아웃
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
    console.error('Logout error:', error);
    throw new Error(ErrorCode.LOGOUT_FAILED.toString());
  }
}; 