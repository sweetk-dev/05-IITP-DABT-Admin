import { Request, Response } from 'express';
import { ErrorCode } from '@iitp-dabt/common';
import { sendError } from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';

// 헬스 체크
export const healthCheck = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        status: 'OK',
        uptime: process.uptime()
      }
    });
  } catch (error) {
    appLogger.error('Health check error:', error);
    sendError(res, ErrorCode.UNKNOWN_ERROR);
  }
}; 