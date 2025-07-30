import { OpenApiUser, OpenApiUserCreationAttributes } from '../models/openApiUser';
import { Op } from 'sequelize';

/**
 * 이메일 중복 확인
 */
export async function isEmailExists(email: string): Promise<boolean> {
  const user = await OpenApiUser.findOne({ 
    where: { 
      loginId: email,
      delYn: 'N'
    } 
  });
  return !!user;
}

/**
 * 이메일로 사용자 조회
 */
export async function findUserByEmail(email: string): Promise<OpenApiUser | null> {
  return OpenApiUser.findOne({ 
    where: { 
      loginId: email,
      delYn: 'N'
    } 
  });
}

/**
 * 사용자 ID로 사용자 조회
 */
export async function findUserById(userId: number): Promise<OpenApiUser | null> {
  return OpenApiUser.findOne({ 
    where: { 
      userId,
      delYn: 'N'
    } 
  });
}

/**
 * 사용자 생성
 */
export async function createUser(userData: {
  loginId: string;
  password: string;
  userName: string;
  affiliation?: string;
  note?: string;
  createdBy: string;
}): Promise<{ userId: number }> {
  const user = await OpenApiUser.create({
    loginId: userData.loginId,
    password: userData.password,
    userName: userData.userName,
    affiliation: userData.affiliation,
    note: userData.note,
    status: 'A',
    delYn: 'N',
    createdBy: userData.createdBy
  });
  return { userId: user.userId };
}

/**
 * 사용자 정보 업데이트
 */
export async function updateUser(userId: number, updateData: {
  userName?: string;
  affiliation?: string;
  note?: string;
  updatedBy: string;
}): Promise<boolean> {
  const [affectedRows] = await OpenApiUser.update({
    userName: updateData.userName,
    affiliation: updateData.affiliation,
    note: updateData.note,
    updatedBy: updateData.updatedBy
  }, {
    where: { 
      userId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 비밀번호 변경
 */
export async function updatePassword(userId: number, newPassword: string, updatedBy: string): Promise<boolean> {
  const [affectedRows] = await OpenApiUser.update({
    password: newPassword,
    updatedBy
  }, {
    where: { 
      userId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 최근 로그인 시간 업데이트
 */
export async function updateLatestLoginAt(userId: number): Promise<boolean> {
  const [affectedRows] = await OpenApiUser.update({
    latestLoginAt: new Date()
  }, {
    where: { 
      userId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 최근 키 생성 시간 업데이트
 */
export async function updateLatestKeyCreatedAt(userId: number): Promise<boolean> {
  const [affectedRows] = await OpenApiUser.update({
    latestKeyCreatedAt: new Date()
  }, {
    where: { 
      userId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

/**
 * 사용자 목록 조회 (페이징)
 */
export async function findUsers(options: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{
  users: OpenApiUser[];
  total: number;
}> {
  const page = options.page || 1;
  const limit = options.limit || 10;
  const offset = (page - 1) * limit;

  const whereClause: any = {
    delYn: 'N'
  };

  if (options.search) {
    whereClause[Op.or] = [
      { loginId: { [Op.iLike]: `%${options.search}%` } },
      { userName: { [Op.iLike]: `%${options.search}%` } },
      { affiliation: { [Op.iLike]: `%${options.search}%` } }
    ];
  }

  const { count, rows } = await OpenApiUser.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  });

  return {
    users: rows,
    total: count
  };
}

/**
 * 사용자 논리 삭제
 */
export async function deleteUser(userId: number, deletedBy: string): Promise<boolean> {
  const [affectedRows] = await OpenApiUser.update({
    delYn: 'Y',
    deletedBy
  }, {
    where: { 
      userId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
} 