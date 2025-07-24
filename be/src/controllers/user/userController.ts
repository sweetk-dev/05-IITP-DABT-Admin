import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { isEmailExists, createUser, findUserByEmail } from '../../repositories/openApiUserRepository';
import bcrypt from 'bcrypt';

// 이메일 중복 체크
export const checkEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, ErrorCode.USER_EMAIL_REQUIRED);
    }

    const exists = await isEmailExists(email);
    
    res.json({
      success: true,
      data: {
        isAvailable: !exists
      }
    });
  } catch (error) {
    console.error('Email check error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// 사용자 회원가입
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    // 필수 필드 검증
    if (!email) {
      return sendError(res, ErrorCode.USER_EMAIL_REQUIRED);
    }
    if (!password) {
      return sendError(res, ErrorCode.USER_PASSWORD_REQUIRED);
    }
    if (!name) {
      return sendError(res, ErrorCode.USER_NAME_REQUIRED);
    }

    // 이메일 중복 체크
    const exists = await isEmailExists(email);
    if (exists) {
      return sendError(res, ErrorCode.USER_EMAIL_DUPLICATE);
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await createUser({
      loginId: email,
      password: hashedPassword,
      userName: name,
      createdBy: 'BY-USER'
    });

    res.json({
      success: true,
      data: {
        userId: newUser.userId,
        email: newUser.loginId,
        name: newUser.userName
      }
    });
  } catch (error) {
    console.error('User registration error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
};

// 사용자 프로필 조회
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const user = await findUserByEmail(userId.toString());
    if (!user) {
      return sendError(res, ErrorCode.USER_NOT_FOUND);
    }

    res.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.loginId,
        name: user.userName,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 