import { OpenApiUser, OpenApiUserCreationAttributes } from '../models/openApiUser';
import { Op } from 'sequelize';

export const openApiUserRepository = {

  /**
   * 이메일 중복 확인
   */
  async isEmailExists(email: string): Promise<boolean> {
    const user = await OpenApiUser.findOne({ 
      where: { 
        loginId: email,
        delYn: 'N'
      } 
    });
    return !!user;
  },

  /**
   * 이메일로 사용자 조회
   */
  async findUserByEmail(email: string): Promise<OpenApiUser | null> {
    return OpenApiUser.findOne({ 
      where: { 
        loginId: email,
        delYn: 'N'
      } 
    });
  },

  /**
   * 사용자 ID로 사용자 조회
   */
  async findUserById(userId: number): Promise<OpenApiUser | null> {
    return OpenApiUser.findOne({ 
      where: { 
        userId,
        delYn: 'N'
      } 
    });
  },

  /**
   * 사용자 생성
   */
  async createUser(userData: {
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
  },

  /**
   * 사용자 정보 업데이트
   */
  async updateUser(userId: number, updateData: {
    userName?: string;
    affiliation?: string;
    note?: string;
    updatedBy: string;
  }): Promise<boolean> {
    const [affectedRows] = await OpenApiUser.update({
      userName: updateData.userName,
      affiliation: updateData.affiliation,
      note: updateData.note,
      updatedAt: new Date(),
      updatedBy: updateData.updatedBy
    }, {
      where: { 
        userId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 비밀번호 변경
   */
  async updatePassword(userId: number, newPassword: string, updatedBy: string): Promise<boolean> {
    const [affectedRows] = await OpenApiUser.update({
      password: newPassword,
      updatedAt: new Date(),
      updatedBy
    }, {
      where: { 
        userId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 최근 로그인 시간 업데이트
   */
  async updateLatestLoginAt(userId: number): Promise<boolean> {
    const [affectedRows] = await OpenApiUser.update({
      latestLoginAt: new Date()
    }, {
      where: { 
        userId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 최근 키 생성 시간 업데이트
   */
  async updateLatestKeyCreatedAt(userId: number): Promise<boolean> {
    const [affectedRows] = await OpenApiUser.update({
      latestKeyCreatedAt: new Date()
    }, {
      where: { 
        userId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 사용자 목록 조회 (페이징)
   */
  async findUsers(options: {
    offset?: number;
    limit?: number;
    search?: string;
    status?: string;
    email?: string;
  }): Promise<OpenApiUser[]> {
    const offset = options.offset || 0;
    const limit = options.limit || 10;

    const whereClause: any = {
      delYn: 'N'
    };

    if (options.search) {
      whereClause[Op.or] = [
        { userName: { [Op.iLike]: `%${options.search}%` } }
      ];
    }

    if (options.status) {
      whereClause.status = options.status;
    }

    if (options.email) {
      whereClause.loginId = { [Op.iLike]: `%${options.email}%` };
    }

    const users = await OpenApiUser.findAll({
      where: whereClause,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return users;
  },

  /**
   * 사용자별 OpenAPI 키 개수를 한 번에 조회 (성능 최적화)
   */
  async getUserOpenApiKeyCounts(userIds: number[]): Promise<Map<number, number>> {
    if (userIds.length === 0) {
      return new Map();
    }

    try {
      // TODO: 실제 OpenAPI 키 테이블과 조인하여 키 개수 조회
      // 현재는 임시로 모든 사용자에 대해 0 반환
      const keyCounts = new Map<number, number>();
      userIds.forEach(userId => {
        keyCounts.set(userId, 0);
      });
      
      return keyCounts;
    } catch (error) {
      // 에러 발생 시 모든 사용자에 대해 0 반환
      const keyCounts = new Map<number, number>();
      userIds.forEach(userId => {
        keyCounts.set(userId, 0);
      });
      
      return keyCounts;
    }
  },

  /**
   * 사용자 계정 수 조회
   */
  async countUserAccounts(options: {
    search?: string;
    status?: string;
    email?: string;
  }): Promise<number> {
    const whereClause: any = {
      delYn: 'N'
    };

    if (options.search) {
      whereClause[Op.or] = [
        { userName: { [Op.iLike]: `%${options.search}%` } }
      ];
    }

    if (options.status) {
      whereClause.status = options.status;
    }

    if (options.email) {
      whereClause.loginId = { [Op.iLike]: `%${options.email}%` };
    }

    return OpenApiUser.count({
      where: whereClause
    });
  },

  /**
   * 사용자 계정 ID로 조회
   */
  async findUserAccountById(userId: number): Promise<OpenApiUser | null> {
    return OpenApiUser.findOne({ 
      where: { 
        userId,
        delYn: 'N'
      } 
    });
  },

  /**
   * 사용자 계정 생성
   */
  async createUserAccount(userData: {
    loginId: string;
    password: string;
    name: string;
    status?: string;
    affiliation?: string;
    note?: string;
    createdBy: string;
  }): Promise<{ userId: number }> {
    const user = await OpenApiUser.create({
      loginId: userData.loginId,
      password: userData.password,
      userName: userData.name,
      status: userData.status || 'A',
      affiliation: userData.affiliation,
      note: userData.note,
      delYn: 'N',
      createdBy: userData.createdBy
    });
    return { userId: user.userId };
  },

  /**
   * 사용자 계정 수정
   */
  async updateUserAccount(userId: number, updateData: {
    name?: string;
    status?: string;
    affiliation?: string;
    note?: string;
    updatedBy: string;
  }): Promise<boolean> {
    const updateFields: any = {
      updatedBy: updateData.updatedBy
    };

    if (updateData.name !== undefined) updateFields.userName = updateData.name;
    if (updateData.status !== undefined) updateFields.status = updateData.status;
    if (updateData.affiliation !== undefined) updateFields.affiliation = updateData.affiliation;
    if (updateData.note !== undefined) updateFields.note = updateData.note;

    const [affectedRows] = await OpenApiUser.update(updateFields, {
      where: { 
        userId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 사용자 계정 삭제 (논리 삭제)
   */
  async deleteUserAccount(userId: number, deletedBy: string): Promise<boolean> {
    const [affectedRows] = await OpenApiUser.update({
      delYn: 'Y',
      deletedAt: new Date(),
      deletedBy
    }, {
      where: { 
        userId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 사용자의 OpenAPI 키 개수 조회
   */
  async countUserOpenApiKeys(userId: number): Promise<number> {
    // TODO: OpenAPI 키 테이블과 조인하여 실제 키 개수 조회
    // 현재는 임시로 0 반환
    return 0;
  }
} as const; 