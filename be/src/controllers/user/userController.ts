import { Request, Response } from 'express';

// 회원가입 처리
export const register = async (req: Request, res: Response) => {
  // TODO: 회원가입 로직 구현
  res.status(501).json({ message: '회원가입 기능 준비 중' });
};

// 로그인 처리
export const login = async (req: Request, res: Response) => {
  // TODO: 로그인 로직 구현
  res.status(501).json({ message: '로그인 기능 준비 중' });
};

// 프로필 조회 (로그인 필요)
export const profile = async (req: Request, res: Response) => {
  // authenticateJWT 미들웨어에서 user 정보가 req.user에 할당됨
  res.status(200).json({ message: '프로필 조회', user: (req as any).user });
}; 