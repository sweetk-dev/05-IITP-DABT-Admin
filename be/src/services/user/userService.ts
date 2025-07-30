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
import { appLogger } from '../../utils/logger';

export class UserService {
  /**
   * 이메일 중복 확인
   */
  static async checkEmailAvailability(email: string): Promise<UserCheckEmailRes> {
    const exists = await isEmailExists(email);
    return {
      isAvailable: !exists
    };
  }

  /**
   * 사용자 회원가입
   */
  static async registerUser(userData: UserRegisterReq): Promise<UserRegisterRes> {
    const { email, password, name, affiliation } = userData;

    // 이메일 중복 체크
    const exists = await isEmailExists(email);
    if (exists) {
      throw new Error('이미 사용 중인 이메일입니다.');
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

    appLogger.info('사용자 회원가입 성공', {
      userId: newUser.userId,
      email: email,
      name: name,
      affiliation: affiliation
    });

    return {
      userId: newUser.userId,
      email: email,
      name: name,
      affiliation: affiliation
    };
  }

  /**
   * 사용자 프로필 조회
   */
  static async getUserProfile(userId: number): Promise<UserProfileRes> {
    const user = await findUserById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    return {
      userId: user.userId,
      email: user.loginId,
      name: user.userName,
      affiliation: user.affiliation,
      createdAt: user.createdAt.toISOString()
    };
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateUserProfile(userId: number, profileData: UserProfileUpdateReq): Promise<void> {
    const { name, affiliation } = profileData;

    const user = await findUserById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
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
  }

  /**
   * 사용자 비밀번호 변경
   */
  static async changeUserPassword(userId: number, passwordData: UserPasswordChangeReq): Promise<void> {
    const { currentPassword, newPassword } = passwordData;

    const user = await findUserById(userId);
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    // 현재 비밀번호 확인
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('현재 비밀번호가 올바르지 않습니다.');
    }

    // 새 비밀번호 해시화
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 비밀번호 업데이트
    await updatePassword(userId, hashedNewPassword, 'BY-USER');

    appLogger.info('사용자 비밀번호 변경 성공', {
      userId: userId
    });
  }
} 