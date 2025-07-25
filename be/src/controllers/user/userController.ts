import { Request, Response } from 'express';
import { ErrorCode, isValidEmail, isValidPassword } from '@iitp-dabt/common';
import { sendError, sendValidationError, sendDatabaseError, sendSuccess } from '../../utils/errorHandler';
import { isEmailExists, createUser, findUserById } from '../../repositories/openApiUserRepository';
import { appLogger } from '../../utils/logger';
import bcrypt from 'bcrypt';
import { 
  UserCheckEmailReq, 
  UserCheckEmailRes,
  UserRegisterReq, 
  UserRegisterRes,
  UserProfileRes 
} from '@iitp-dabt/common';

// 이메일 중복 체크
export const checkEmail = async (req: Request<{}, {}, UserCheckEmailReq>, res: Response) => {
  try {
    const { email } = req.body;

    // 필수 필드 검증
    if (!email) {
      return sendValidationError(res, 'email', '이메일이 필요합니다.');
    }

    // common 패키지의 이메일 형식 검증 사용
    if (!isValidEmail(email)) {
      return sendError(res, ErrorCode.USER_EMAIL_INVALID_FORMAT);
    }

    const exists = await isEmailExists(email);
    
    const response: UserCheckEmailRes = {
      isAvailable: !exists
    };
    
    sendSuccess(res, response, undefined, 'EMAIL_CHECK', { 
      email, 
      isAvailable: !exists 
    });
  } catch (error) {
    appLogger.error('이메일 중복 확인 중 오류 발생', { error, email: req.body.email });
    sendDatabaseError(res, '조회', '이메일 중복 확인');
  }
};

// 사용자 회원가입
export const register = async (req: Request<{}, {}, UserRegisterReq>, res: Response) => {
  try {
    const { email, password, name, affiliation } = req.body;

    // 필수 필드 검증
    if (!email) {
      return sendValidationError(res, 'email', '이메일이 필요합니다.');
    }
    if (!password) {
      return sendValidationError(res, 'password', '비밀번호가 필요합니다.');
    }
    if (!name) {
      return sendValidationError(res, 'name', '이름이 필요합니다.');
    }

    // common 패키지의 이메일 형식 검증 사용
    if (!isValidEmail(email)) {
      return sendError(res, ErrorCode.USER_EMAIL_INVALID_FORMAT);
    }

    // common 패키지의 비밀번호 강도 검증 사용
    if (!isValidPassword(password)) {
      return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
    }

    // 이메일 중복 체크
    const exists = await isEmailExists(email);
    if (exists) {
      return sendError(res, ErrorCode.USER_EMAIL_DUPLICATE);
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await createUser({
      loginId: email,
      password: hashedPassword,
      userName: name,
      affiliation: affiliation,
      createdBy: 'BY-USER'
    });

    const response: UserRegisterRes = {
      userId: newUser.userId,
      email: email,
      name: name,
      affiliation: affiliation
    };

    appLogger.info('사용자 회원가입 성공', {
      userId: newUser.userId,
      email: email,
      name: name,
      affiliation: affiliation
    });

    sendSuccess(res, response, '회원가입이 완료되었습니다.', 'USER_REGISTRATION', {
      userId: newUser.userId,
      email: email,
      name: name,
      affiliation: affiliation
    });
  } catch (error) {
    appLogger.error('사용자 회원가입 중 오류 발생', { 
      error, 
      email: req.body.email, 
      name: req.body.name 
    });
    sendDatabaseError(res, '생성', '사용자');
  }
};

// 사용자 프로필 조회
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const user = await findUserById(userId);
    if (!user) {
      return sendError(res, ErrorCode.USER_NOT_FOUND);
    }

    const response: UserProfileRes = {
      userId: user.userId,
      email: user.loginId,
      name: user.userName,
      affiliation: user.affiliation,
      createdAt: user.createdAt.toISOString()
    };

    sendSuccess(res, response, undefined, 'USER_PROFILE_VIEW', {
      userId: user.userId,
      email: user.loginId
    });
  } catch (error) {
    appLogger.error('사용자 프로필 조회 중 오류 발생', { error, userId: req.user?.userId });
    sendDatabaseError(res, '조회', '사용자 프로필');
  }
}; 