import { Request, Response } from 'express';
import { UserRegisterRequest, UserRegisterResult, UserCheckEmailRequest, UserCheckEmailResult } from '../../types/user';
import { ErrorCode } from '../../types/errorCodes';
import * as userService from '../../services/userService';
import { sendError } from '../../utils/response';
import { ApiResponse } from '../../types/common';
import { isValidEmail, isValidPassword } from '@iitp/common';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt';

// 이메일 중복 체크
export const checkEmail = async (req: Request, res: Response) => {
  const { email } = req.body as UserCheckEmailRequest;
  if (!email) {
    return sendError(res, ErrorCode.USER_EMAIL_REQUIRED);
  }
  if (!isValidEmail(email)) {
    return sendError(res, ErrorCode.INVALID_REQUEST, '이메일 형식이 올바르지 않습니다.');
  }
  try {
    const result: UserCheckEmailResult = await userService.checkEmail({ email });
    const response: ApiResponse<UserCheckEmailResult> = {
      success: true,
      data: result,
      errorCode: ErrorCode.SUCCESS,
    };
    res.status(200).json(response);
  } catch (err: any) {
    sendError(res, ErrorCode.UNKNOWN_ERROR, err.message);
  }
};

// 회원가입 처리
export const register = async (req: Request, res: Response) => {
  const { email, password, name, affiliation } = req.body as UserRegisterRequest;

  if (!email) {
    return sendError(res, ErrorCode.USER_EMAIL_REQUIRED);
  }
  if (!isValidEmail(email)) {
    return sendError(res, ErrorCode.INVALID_REQUEST, '이메일 형식이 올바르지 않습니다.');
  }
  if (!password) {
    return sendError(res, ErrorCode.USER_PASSWORD_REQUIRED);
  }
  if (!isValidPassword(password)) {
    return sendError(res, ErrorCode.INVALID_REQUEST, '비밀번호 패턴이 올바르지 않습니다.');
  }
  if (!name) {
    return sendError(res, ErrorCode.USER_NAME_REQUIRED);
  }

  try {
    const result: UserRegisterResult = await userService.register({ email, password, name, affiliation });
    const response: ApiResponse<UserRegisterResult> = {
      success: true,
      data: result,
      errorCode: ErrorCode.SUCCESS,
    };
    res.status(201).json(response);
  } catch (err: any) {
    if (err.code === ErrorCode.USER_EMAIL_DUPLICATE) {
      return sendError(res, ErrorCode.USER_EMAIL_DUPLICATE);
    }
    sendError(res, ErrorCode.UNKNOWN_ERROR, err.message);
  }
};

// 로그인 처리
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    return sendError(res, ErrorCode.INVALID_REQUEST, '이메일과 비밀번호를 모두 입력해 주세요.');
  }
  try {
    const user = await userService.loginUser(email, password);
    // 토큰 payload: id, userId, role
    const payload = {
      id: user.id,
      userId: user.userId,
      role: user.role,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    res.status(200).json({
      result: 'ok',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        userId: user.userId,
        name: user.name,
        role: user.role,
        affiliation: user.affiliation,
        status: user.status,
      },
    });
  } catch (err: any) {
    sendError(res, err.code || ErrorCode.UNKNOWN_ERROR, err.message);
  }
};

// refresh token으로 access token 재발급
export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body as { refreshToken: string };
  if (!refreshToken) {
    return sendError(res, ErrorCode.INVALID_REQUEST, 'refresh token이 필요합니다.');
  }
  const payload = verifyToken(refreshToken);
  if (!payload) {
    return sendError(res, ErrorCode.UNAUTHORIZED, 'refresh token이 유효하지 않습니다.');
  }
  // access token 재발급
  const accessToken = generateAccessToken({
    id: payload.id,
    userId: payload.userId,
    role: payload.role,
  });
  res.status(200).json({
    result: 'ok',
    accessToken,
  });
};


// 공지사항 조회
export const getNotice = async (req: Request, res: Response) => {
  // TODO: 공지사항 조회 로직 구현
  res.status(501).json({ message: '공지사항 조회 기능 준비 중' });
};



// 프로필 조회 (로그인 필요)
export const profile = async (req: Request, res: Response) => {
  // authenticateJWT 미들웨어에서 user 정보가 req.user에 할당됨
  res.status(200).json({ message: '프로필 조회', user: (req as any).user });
}; 