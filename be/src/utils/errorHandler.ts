import { Response } from 'express';
import { ErrorCode, ErrorMetaMap } from '@iitp-dabt/common';

export const sendError = (res: Response, errorCode: ErrorCode, customMessage?: string) => {
  const errorMeta: ErrorMeta = ErrorMetaMap[errorCode];
  
  res.status(errorMeta.statusCode).json({
    success: false,
    errorCode,
    errorMessage: customMessage || errorMeta.message
  });
};

export const sendSuccess = (res: Response, data: any) => {
  res.json({
    success: true,
    data
  });
}; 