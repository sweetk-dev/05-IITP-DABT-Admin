import { Response } from 'express';
import { ErrorCode, ErrorMetaMap } from '../types/errorCodes';
import { ApiResponse } from '../types/common';

export function sendError(res: Response, errorCode: ErrorCode, detail?: string) {
  const meta = ErrorMetaMap[errorCode] || ErrorMetaMap[ErrorCode.UNKNOWN_ERROR];
  const response: ApiResponse = {
    success: false,
    errorCode,
    errorMessage: meta.message + (detail ? `: ${detail}` : ''),
  };
  res.status(meta.statusCode).json(response);
} 