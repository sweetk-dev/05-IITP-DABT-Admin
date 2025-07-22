import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
      if (err) return res.status(401).json({ result: 'fail', message: '토큰이 유효하지 않거나 만료되었습니다.' });
      req.user = user as TokenPayload;
      next();
    });
  } else {
    res.status(401).json({ result: 'fail', message: '인증 토큰이 필요합니다.' });
  }
}; 