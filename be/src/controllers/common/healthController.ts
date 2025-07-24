import { Request, Response } from 'express';

// 헬스체크
export const healthCheck = async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: {
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      }
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
}; 