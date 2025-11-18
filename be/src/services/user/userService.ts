import { 
  UserCheckEmailRes,
  UserRegisterReq, 
  UserRegisterRes, 
  UserProfileUpdateReq, 
  UserPasswordChangeReq,
  ErrorCode,
  CODE_SYS_WORK_TYPES
} from '@iitp-dabt/common';
import bcrypt from 'bcrypt';
import { appLogger } from '../../utils/logger';
import { ResourceError, ValidationError } from '../../utils/customErrors';
import { openApiUserRepository } from '../../repositories/openApiUserRepository';
import { BCRYPT_SALT_ROUNDS } from '../../constants/security';

export class UserService {

    /**
   * 이메일 중복 확인
   */
  static async checkEmailAvailability(email: string): Promise<UserCheckEmailRes> {
    const exists = await openApiUserRepository.isEmailExists(email);
    return {
      isAvailable: !exists
    };
  }


  /**
   * 사용자 회원가입
   */
  static async registerUser(userData: UserRegisterReq): Promise<UserRegisterRes> {
    const { email, password, name, affiliation } = userData;
    const exists = await openApiUserRepository.isEmailExists(email);
    if (exists) {
      throw new ResourceError(
        ErrorCode.EMAIL_ALREADY_EXISTS,
        '이미 사용 중인 이메일입니다.',
        'email',
        email
      );
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // 사용자 생성
    const newUser = await openApiUserRepository.createUser({
      loginId: email,
      password: hashedPassword,
      userName: name,
      affiliation,
      createdBy: CODE_SYS_WORK_TYPES.USER
    });

    appLogger.info('사용자 회원가입 성공', { userId: newUser.userId, email });

    return {
      userId: newUser.userId,
      email,
      name
    };
  }

  /**
   * 사용자 프로필 조회
   */
  static async getUserProfile(userId: number) {
    const user = await openApiUserRepository.findUserById(userId);
    if (!user) {
      throw new ResourceError(
        ErrorCode.USER_NOT_FOUND,
        '사용자를 찾을 수 없습니다.',
        'user',
        userId
      );
    }

    return {
      userId: user.userId,
      email: user.loginId,
      name: user.userName,
      affiliation: user.affiliation,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateUserProfile(userId: number, profileData: UserProfileUpdateReq): Promise<void> {
    const { name, affiliation } = profileData;
    
    const user = await openApiUserRepository.findUserById(userId);
    if (!user) {
      throw new ResourceError(
        ErrorCode.USER_NOT_FOUND,
        '수정할 사용자를 찾을 수 없습니다.',
        'user',
        userId
      );
    }

    await openApiUserRepository.updateUser(userId, {
      userName: name,
      affiliation,
      updatedBy: CODE_SYS_WORK_TYPES.USER
    });

    appLogger.info('사용자 프로필 업데이트 성공', { userId, name, affiliation });
  }

  /**
   * 사용자 비밀번호 변경
   */
  static async changeUserPassword(userId: number, passwordData: UserPasswordChangeReq): Promise<void> {
    const { currentPassword, newPassword } = passwordData;
    
    const user = await openApiUserRepository.findUserById(userId);
    if (!user) {
      throw new ResourceError(
        ErrorCode.USER_NOT_FOUND,
        '비밀번호를 변경할 사용자를 찾을 수 없습니다.',
        'user',
        userId
      );
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new ValidationError(
        ErrorCode.ACCOUNT_PASSWORD_INVALID,
        '현재 비밀번호가 올바르지 않습니다.',
        'currentPassword'
      );
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    // 비밀번호 업데이트
    await openApiUserRepository.updatePassword(userId, hashedNewPassword, CODE_SYS_WORK_TYPES.USER);

    appLogger.info('사용자 비밀번호 변경 성공', { userId });
  }
} 