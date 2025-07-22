import { Request, Response } from 'express';
import { sendError } from '../../utils/response';
import { ErrorCode } from '../../types/errorCodes';
import { generateAccessToken, generateRefreshToken, verifyToken } from '../../utils/jwt';

// 관리자 로그인 (샘플)
export const login = async (req: Request, res: Response) => {
  // TODO: 실제 admin 인증 로직 구현
  // 예시: id, password로 인증 후 토큰 발급
  res.status(501).json({ message: '관리자 로그인 기능 준비 중' });
};

// 관리자 refresh
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