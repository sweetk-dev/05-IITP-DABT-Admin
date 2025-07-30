declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        userType: 'U' | 'A';
      };
    }
  }
} 