import { UserRegisterRequest, UserRegisterResult, UserCheckEmailRequest, UserCheckEmailResult } from '../types/user';
import { isEmailExists, createUser, findUserByEmail } from '../repositories/openApiUserRepository';
import bcrypt from 'bcryptjs';
import { ErrorCode } from '../types/errorCodes';

export const register = async (dto: UserRegisterRequest): Promise<UserRegisterResult> => {
  // 1. 이메일 중복 체크
  const exists = await isEmailExists(dto.email);
  if (exists) {
    // throw로 컨트롤러에서 sendError 처리
    const err: any = new Error('이미 가입된 이메일입니다.');
    err.code = ErrorCode.USER_EMAIL_DUPLICATE;
    throw err;
  }
  // 2. 비밀번호 해시
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  // 3. DB 저장
  const { userId } = await createUser({
    loginId: dto.email,
    password: hashedPassword,
    userName: dto.name,
    affiliation: dto.affiliation,
    createdBy: 'BY-USER'
  });
  // 4. 결과 반환
  return { userId };
};

export const checkEmail = async (dto: UserCheckEmailRequest): Promise<UserCheckEmailResult> => {
  const exists = await isEmailExists(dto.email);
  return { exists };
};

export async function loginUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) {
    const err: any = new Error('존재하지 않는 계정입니다.');
    err.code = ErrorCode.USER_NOT_FOUND;
    throw err;
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err: any = new Error('비밀번호가 일치하지 않습니다.');
    err.code = ErrorCode.USER_PASSWORD_INVALID;
    throw err;
  }
  // 로그인 성공: 필요한 정보만 반환
  return {
    id: user.userId,
    userId: user.loginId,
    name: user.userName,
    role: 'user', // 추후 확장 가능
    affiliation: user.affiliation,
    status: user.status,
  };
} 