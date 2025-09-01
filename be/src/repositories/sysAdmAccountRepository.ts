import { SysAdmAccount, SysAdmAccountCreationAttributes } from '../models/sysAdmAccount';
import { Op } from 'sequelize';

export const sysAdmAccountRepository = {

  /**
   * 로그인 ID로 관리자 조회
   */
  async findAdminByLoginId(loginId: string): Promise<SysAdmAccount | null> {
    return SysAdmAccount.findOne({ 
      where: { 
        loginId,
        delYn: 'N'
      } 
    });
  },

  /**
   * 최근 로그인 시간 업데이트
   */
  async updateLatestLoginAt(admId: number): Promise<boolean> {
    const [affectedRows] = await SysAdmAccount.update({
      latestLoginAt: new Date()
    }, {
      where: { 
        admId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 관리자 ID로 관리자 조회
   */
  async findAdminById(admId: number): Promise<SysAdmAccount | null> {
    return SysAdmAccount.findOne({ 
      where: { 
        admId,
        delYn: 'N'
      } 
    });
  },

  /**
   * 관리자 생성
   */
  async createAdmin(adminData: {
    loginId: string;
    password: string;
    name: string;
    role: string;
    affiliation?: string;
    description?: string;
    note?: string;
    createdBy: string;
  }): Promise<{ admId: number }> {
    const admin = await SysAdmAccount.create({
      loginId: adminData.loginId,
      password: adminData.password,
      name: adminData.name,
      roles: adminData.role,
      affiliation: adminData.affiliation,
      description: adminData.description,
      note: adminData.note,
      status: 'A',
      delYn: 'N',
      createdBy: adminData.createdBy
    });
    return { admId: admin.admId };
  },

  /**
   * 관리자 정보 업데이트
   */
  async updateAdmin(admId: number, updateData: {
    name?: string;
    roles?: string;
    status?: string;
    affiliation?: string;
    description?: string;
    note?: string;
    updatedBy: string;
  }): Promise<boolean> {
    const [affectedRows] = await SysAdmAccount.update({
      name: updateData.name,
      roles: updateData.roles,
      status: updateData.status,
      affiliation: updateData.affiliation,
      description: updateData.description,
      note: updateData.note,
      updatedAt: new Date(),
      updatedBy: updateData.updatedBy
    }, {
      where: { 
        admId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 관리자 비밀번호 변경
   */
  async updateAdminPassword(admId: number, newPassword: string, updatedBy: string): Promise<boolean> {
    const [affectedRows] = await SysAdmAccount.update({
      password: newPassword,
      updatedAt: new Date(),
      updatedBy
    }, {
      where: { 
        admId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  // 운영자 계정 관리 관련 메서드들

  /**
   * 운영자 계정 목록 조회 (페이징)
   */
  async findAdminAccounts(options: {
    offset: number;
    limit: number;
    search?: string;
    status?: string;
    role?: string;
    affiliation?: string;
  }): Promise<SysAdmAccount[]> {
    const whereClause: any = {
      delYn: 'N'
    };

    if (options.search) {
      whereClause[Op.or] = [
        { loginId: { [Op.iLike]: `%${options.search}%` } },
        { name: { [Op.iLike]: `%${options.search}%` } },
        { affiliation: { [Op.iLike]: `%${options.search}%` } }
      ];
    }

    if (options.role) {
      whereClause.roles = options.role;
    }

    if (options.status) {
      whereClause.status = options.status;
    }

    if (options.affiliation) {
      whereClause.affiliation = options.affiliation;
    }

    return SysAdmAccount.findAll({
      where: whereClause,
      limit: options.limit,
      offset: options.offset,
      order: [['createdAt', 'DESC']]
    });
  },

  /**
   * 운영자 계정 수 조회
   */
  async countAdminAccounts(options: {
    search?: string;
    status?: string;
    role?: string;
    affiliation?: string;
  }): Promise<number> {
    const whereClause: any = {
      delYn: 'N'
    };

    if (options.search) {
      whereClause[Op.or] = [
        { loginId: { [Op.iLike]: `%${options.search}%` } },
        { name: { [Op.iLike]: `%${options.search}%` } },
        { affiliation: { [Op.iLike]: `%${options.search}%` } }
      ];
    }

    if (options.role) {
      whereClause.roles = options.role;
    }

    if (options.status) {
      whereClause.status = options.status;
    }

    if (options.affiliation) {
      whereClause.affiliation = options.affiliation;
    }

    return SysAdmAccount.count({
      where: whereClause
    });
  },


  /**
   * 운영자 계정 삭제 (논리 삭제)
   */
  async deleteAdmin(adminId: number, actorTag: string): Promise<boolean> {
    const [affectedRows] = await SysAdmAccount.update({
      delYn: 'Y',
      deletedBy: actorTag, 
      deletedAt: new Date()
    }, {
      where: { 
        admId: adminId,
        delYn: 'N'
      }
    });
    return affectedRows > 0;
  },

  /**
   * 운영자 계정 다중 삭제 (논리 삭제)
   */
  async deleteAdminList(adminIds: number[], actorTag: string): Promise<number> {
    const [affectedRows] = await SysAdmAccount.update({
      delYn: 'Y',
      deletedBy: actorTag, 
      deletedAt: new Date()
    }, {
      where: { 
        admId: {
          [Op.in]: adminIds
        },
        delYn: 'N'
      }
    });
    return affectedRows ? affectedRows : 0;
  }

} as const;