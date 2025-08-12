import { Request, Response } from 'express';
import { 
  UserRegisterReq, 
  UserRegisterRes, 
  UserCheckEmailReq, 
  UserCheckEmailRes,
  UserProfileRes,
  UserProfileUpdateReq,
  UserPasswordChangeReq,
  ErrorCode,
  USER_API_MAPPING,
  API_URLS,
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidAffiliation
} from '@iitp-dabt/common';
import { UserService } from '../../services/user/userService';
import { 
  sendSuccess, 
  sendError, 
  sendValidationError, 
  sendDatabaseError 
} from '../../utils/errorHandler';
import { appLogger } from '../../utils/logger';
import { logApiCall } from '../../utils/apiLogger';
import { 
  extractUserIdFromRequest,
  normalizeErrorMessage 
} from '../../utils/commonUtils';

/**
 * 사용자 이메일 중복 확인
 * API: POST /api/user/email/check
 * 매핑: USER_API_MAPPING[`POST ${API_URLS.USER.CHECK_EMAIL}`]
 */
export const checkEmail = async (req: Request<{}, {}, UserCheckEmailReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.USER.CHECK_EMAIL, USER_API_MAPPING as any, '사용자 이메일 중복 확인');
    
    // 기본 파라미터 검증
    const { email } = req.body;

    if (!email) {
      return sendValidationError(res, 'email', '이메일이 필요합니다.');
    }

    // 이메일 형식 검증
    if (!isValidEmail(email)) {
      return sendError(res, ErrorCode.EMAIL_INVALID_FORMAT);
    }

    const response = await UserService.checkEmailAvailability(email);
    
    const result: UserCheckEmailRes = {
      isAvailable: response.isAvailable
    };

    sendSuccess(res, result);
  } catch (error) {
    appLogger.error('이메일 중복 확인 중 오류 발생', { error, email: req.body.email });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('이메일 형식')) {
        return sendError(res, ErrorCode.EMAIL_INVALID_FORMAT);
      }
      return sendValidationError(res, 'email', errorMsg);
    }
    
    sendDatabaseError(res, '조회', '이메일 중복 확인');
  }
};

/**
 * 사용자 회원가입
 * API: POST /api/user/register
 * 매핑: USER_API_MAPPING[`POST ${API_URLS.USER.REGISTER}`]
 */
export const register = async (req: Request<{}, {}, UserRegisterReq>, res: Response) => {
  try {
    logApiCall('POST', API_URLS.USER.REGISTER, USER_API_MAPPING as any, '사용자 회원가입');
    
    // 기본 파라미터 검증
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

    // 이메일 형식 검증
    if (!isValidEmail(email)) {
      return sendError(res, ErrorCode.EMAIL_INVALID_FORMAT);
    }

    // 비밀번호 강도 검증
    if (!isValidPassword(password)) {
      return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
    }

    // 이름 형식 검증
    if (!isValidName(name)) {
      return sendValidationError(res, 'name', '유효한 이름을 입력해주세요. (2-50자, 한글/영문/숫자/공백)');
    }

    // 소속 형식 검증 (선택적)
    if (affiliation && !isValidAffiliation(affiliation)) {
      return sendValidationError(res, 'affiliation', '유효한 소속을 입력해주세요. (2-100자, 한글/영문/숫자/공백/특수문자)');
    }

    const response = await UserService.registerUser({ email, password, name, affiliation });

    const result: UserRegisterRes = {
      userId: response.userId,
      email: response.email,
      name: response.name,
      affiliation: response.affiliation
    };

    sendSuccess(res, result, undefined, 'USER_REGISTRATION', {
      userId: response.userId,
      email: response.email,
      name: response.name,
      affiliation: response.affiliation
    });
  } catch (error) {
    appLogger.error('사용자 회원가입 중 오류 발생', { 
      error, 
      email: req.body.email, 
      name: req.body.name 
    });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('이메일 형식')) {
        return sendError(res, ErrorCode.EMAIL_INVALID_FORMAT);
      }
      if (errorMsg.includes('이미 사용 중인 이메일')) {
        return sendError(res, ErrorCode.USER_EMAIL_DUPLICATE);
      }
      if (errorMsg.includes('비밀번호가 너무 약')) {
        return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '생성', '사용자');
  }
};

/**
 * 사용자 프로필 조회
 * API: GET /api/user/profile
 * 매핑: USER_API_MAPPING[`GET ${API_URLS.USER.PROFILE}`]
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    logApiCall('GET', API_URLS.USER.PROFILE, USER_API_MAPPING as any, '사용자 프로필 조회');
    
    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    const response = await UserService.getUserProfile(userId);

    const result: UserProfileRes = {
      userId: response.userId,
      email: response.email,
      name: response.name,
      affiliation: response.affiliation,
      createdAt: response.createdAt
    };

    sendSuccess(res, result, undefined, 'USER_PROFILE_VIEW', {
      userId: response.userId,
      email: response.email
    });
  } catch (error) {
    appLogger.error('사용자 프로필 조회 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('사용자를 찾을 수 없습니다')) {
        return sendError(res, ErrorCode.USER_NOT_FOUND);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '조회', '사용자 프로필');
  }
};

// 사용자 프로필 변경
export const updateProfile = async (req: Request<{}, {}, UserProfileUpdateReq>, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { name, affiliation } = req.body;

    // 필수 필드 검증
    if (!name) {
      return sendValidationError(res, 'name', '이름이 필요합니다.');
    }

    // 이름 형식 검증
    if (!isValidName(name)) {
      return sendValidationError(res, 'name', '유효한 이름을 입력해주세요. (2-50자, 한글/영문/숫자/공백)');
    }

    // 소속 형식 검증 (선택적)
    if (affiliation && !isValidAffiliation(affiliation)) {
      return sendValidationError(res, 'affiliation', '유효한 소속을 입력해주세요. (2-100자, 한글/영문/숫자/공백/특수문자)');
    }

    await UserService.updateUserProfile(userId, { name, affiliation });

    sendSuccess(res, undefined, undefined, 'USER_PROFILE_UPDATE', {
      userId: userId,
      name: name,
      affiliation: affiliation
    });
  } catch (error) {
    appLogger.error('사용자 프로필 업데이트 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('사용자를 찾을 수 없습니다')) {
        return sendError(res, ErrorCode.USER_NOT_FOUND);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '업데이트', '사용자 프로필');
  }
};

// 사용자 비밀번호 변경
export const changePassword = async (req: Request<{}, {}, UserPasswordChangeReq>, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req);
    
    if (!userId) {
      return sendError(res, ErrorCode.UNAUTHORIZED);
    }

    // 기본 파라미터 검증
    const { currentPassword, newPassword } = req.body;

    // 필수 필드 검증
    if (!currentPassword) {
      return sendValidationError(res, 'currentPassword', '현재 비밀번호가 필요합니다.');
    }
    if (!newPassword) {
      return sendValidationError(res, 'newPassword', '새 비밀번호가 필요합니다.');
    }

    // 새 비밀번호 강도 검증
    if (!isValidPassword(newPassword)) {
      return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
    }

    // 새 비밀번호가 현재 비밀번호와 같은지 확인
    if (currentPassword === newPassword) {
      return sendValidationError(res, 'newPassword', '새 비밀번호는 현재 비밀번호와 달라야 합니다.');
    }

    await UserService.changeUserPassword(userId, { currentPassword, newPassword });

    sendSuccess(res, undefined, undefined, 'USER_PASSWORD_CHANGE', {
      userId: userId
    });
  } catch (error) {
    appLogger.error('사용자 비밀번호 변경 중 오류 발생', { error, userId: extractUserIdFromRequest(req) });
    
    if (error instanceof Error) {
      const errorMsg = normalizeErrorMessage(error);
      if (errorMsg.includes('사용자를 찾을 수 없습니다')) {
        return sendError(res, ErrorCode.USER_NOT_FOUND);
      }
      if (errorMsg.includes('현재 비밀번호가 올바르지 않습니다')) {
        return sendError(res, ErrorCode.USER_PASSWORD_INVALID);
      }
      if (errorMsg.includes('새 비밀번호가 너무 약')) {
        return sendError(res, ErrorCode.USER_PASSWORD_TOO_WEAK);
      }
      return sendValidationError(res, 'general', errorMsg);
    }
    
    sendDatabaseError(res, '변경', '사용자 비밀번호');
  }
}; 