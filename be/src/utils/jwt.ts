import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'; // 15분
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'; // 7일
const ISSUER = process.env.JWT_ISSUER || 'iitp-dabt-api';

export interface TokenPayload {
  id: number;         // DB system id
  userId: string;     // 로그인 ID
  role: string;       // 계정 role
  [key: string]: any; // 확장성
}

export function generateAccessToken(payload: TokenPayload) {
  const options: SignOptions = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    issuer: ISSUER,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function generateRefreshToken(payload: TokenPayload) {
  const options: SignOptions = {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: ISSUER,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
} 