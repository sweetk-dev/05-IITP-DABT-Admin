import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { 
  UserRegisterReq, 
  UserRegisterRes, 
  UserCheckEmailReq, 
  UserCheckEmailRes,
  UserProfileRes,
  UserProfileUpdateReq,
  UserPasswordChangeReq,
  ErrorCode,
  isValidEmail, 
  isValidPassword 
} from '@iitp-dabt/common';
import { 
  isEmailExists,
  createUser, 
  findUserByEmail, 
  findUserById, 
  updateUser, 
  updatePassword 
} from '../../repositories/openApiUserRepository';
import { 
  sendSuccess, 
  sendError, 
  sendValidationError, 
  sendDatabaseError 
} from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { trimStringFieldsExcept } from '../../utils/trimUtils';

// 이메일 중복 확인
export const checkEmail = async (req: Request<{}, {}, UserCheckEmailReq>, res: Response) => {
  try {
    // trim 처리 적용
    const { email } = trimStringFieldsExcept(req.body, ['password']);

    if (!email) {
      return sendValidationError(res, 'email', '이메일이 필요합니다.');
    }

    if (!isValidEmail(email)) {
      return sendError(res, ErrorCode.USER_EMAIL_INVALID_FORMAT);
    }

    const exists = await isEmailExists(email);
    const response: UserCheckEmailRes = {
      isAvailable: !exists
    };

    sendSuccess(res, response, exists ? '이미 사용 중인 이메일입니다.' : '사용 가능한 이메일입니다.');
  } catch (error) {
    appLogger.error('이메일 중복 확인 중 오류 발생', { error, email: req.body.email });
    sendDatabaseError(res, '조회', '이메일 중복 확인');
  }
};

// 사용자 회원가입
export const register = async (req: Request<{}, {}, UserRegisterReq>, res: Response) => {
  try {
    // trim 처리 적용 (비밀번호 제외)
    const { email, password, name, affiliation } = trimStringFieldsExcept(req.body, ['password']);

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

// 사용자 프로필 변경
export const updateProfile = async (req: Request<{}, {}, UserProfileUpdateReq>, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // trim 처리 적용
    const { name, affiliation } = trimStringFieldsExcept(req.body, []);

    // 필수 필드 검증
    if (!name) {
      return sendValidationError(res, 'name', '이름이 필요합니다.');
    }

    const user = await findUserById(userId);
    if (!user) {
      return sendError(res, ErrorCode.USER_NOT_FOUND);
    }

    // 프로필 업데이트
    await updateUser(userId, {
      userName: name,
      affiliation: affiliation,
      updatedBy: 'BY-USER'
    });

    appLogger.info('사용자 프로필 업데이트 성공', {
      userId: userId,
      name: name,
      affiliation: affiliation
    });

    sendSuccess(res, { success: true }, '프로필이 성공적으로 업데이트되었습니다.', 'USER_PROFILE_UPDATE', {
      userId: userId,
      name: name,
      affiliation: affiliation
    });
  } catch (error) {
    appLogger.error('사용자 프로필 업데이트 중 오류 발생', { error, userId: req.user?.userId });
    sendDatabaseError(res, '업데이트', '사용자 프로필');
  }
};

// 사용자 비밀번호 변경
export const changePassword = async (req: Request<{}, {}, UserPasswordChangeReq>, res: Response) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const { currentPassword, newPassword } = req.body;

    // 필수 필드 검증
    if (!currentPassword) {
      return sendValidationError(res, 'currentPassword', '현재 비밀번호가 필요합니다.');
    }
    if (!newPassword) {
      return sendValidationError(res, 'newPassword', '새 비밀번호가 필요합니다.');
    }

    // common 패키지의 비밀번호 강도 검증 사용
    if (!isValidPassword(newPassword)) {
      return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
    }

    const user = await findUserById(userId);
    if (!user) {
      return sendError(res, ErrorCode.USER_NOT_FOUND);
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return sendError(res, ErrorCode.USER_PASSWORD_INVALID);
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await updatePassword(userId, hashedNewPassword, 'BY-USER');

    appLogger.info('사용자 비밀번호 변경 성공', {
      userId: userId
    });

    sendSuccess(res, { success: true }, '비밀번호가 성공적으로 변경되었습니다.', 'USER_PASSWORD_CHANGE', {
      userId: userId
    });
  } catch (error) {
    appLogger.error('사용자 비밀번호 변경 중 오류 발생', { error, userId: req.user?.userId });
    sendDatabaseError(res, '변경', '사용자 비밀번호');
  }
}; 