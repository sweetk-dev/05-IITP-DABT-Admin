import { Request, Response } from 'express';

// OpenAPI 신청
export const requestOpenApi = async (req: Request, res: Response) => {
  // TODO: 신청 로직 구현
  res.status(501).json({ message: 'OpenAPI 신청 기능 준비 중' });
};

// OpenAPI 상태 조회
export const getOpenApiStatus = async (req: Request, res: Response) => {
  // TODO: 상태 조회 로직 구현
  res.status(501).json({ message: 'OpenAPI 상태 조회 기능 준비 중' });
}; 