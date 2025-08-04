import { UserType } from '../utils/commonUtils';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        userType: UserType;
      };
    }
  }
} 