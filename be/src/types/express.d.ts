import { UserType } from '../utils/commonUtils';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        userType: UserType;
        actorTag?: string;
        admRole?: string;  // Admin용 역할 코드
      };
      requestId?: string;
    }
  }
} 