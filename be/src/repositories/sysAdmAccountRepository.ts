import { SysAdmAccount, SysAdmAccountCreationAttributes } from '../models/sysAdmAccount';
import { Op } from 'sequelize';

/**
 * 로그인 ID로 관리자 조회
 */
export async function findAdminByLoginId(loginId: string): Promise<SysAdmAccount | null> {
  return SysAdmAccount.findOne({ 
    where: { 
      loginId,
      delYn: 'N'
    } 
  });
}

/**
 * 최근 로그인 시간 업데이트
 */
export async function updateLatestLoginAt(admId: number): Promise<boolean> {
  const [affectedRows] = await SysAdmAccount.update({
    latestLoginAt: new Date()
  }, {
    where: { 
      admId,
      delYn: 'N'
    }
  });
  return affectedRows > 0;
}

// /**
//  * 관리자 ID로 관리자 조회
//  */
// export async function findAdminById(admId: number): Promise<SysAdmAccount | null> {
//   return SysAdmAccount.findOne({ 
//     where: { 
//       admId,
//       delYn: 'N'
//     } 
//   });
// }

// /**
//  * 관리자 생성
//  */
// export async function createAdmin(adminData: {
//   loginId: string;
//   password: string;
//   name: string;
//   roles: string;
//   affiliation?: string;
//   description?: string;
//   note?: string;
//   createdBy: string;
// }): Promise<{ admId: number }> {
//   const admin = await SysAdmAccount.create({
//     loginId: adminData.loginId,
//     password: adminData.password,
//     name: adminData.name,
//     roles: adminData.roles,
//     affiliation: adminData.affiliation,
//     description: adminData.description,
//     note: adminData.note,
//     status: 'A',
//     delYn: 'N',
//     createdBy: adminData.createdBy
//   });
//   return { admId: admin.admId };
// }

// /**
//  * 관리자 정보 업데이트
//  */
// export async function updateAdmin(admId: number, updateData: {
//   name?: string;
//   roles?: string;
//   status?: string;
//   affiliation?: string;
//   description?: string;
//   note?: string;
//   updatedBy: string;
// }): Promise<boolean> {
//   const [affectedRows] = await SysAdmAccount.update({
//     name: updateData.name,
//     roles: updateData.roles,
//     status: updateData.status,
//     affiliation: updateData.affiliation,
//     description: updateData.description,
//     note: updateData.note,
//     updatedBy: updateData.updatedBy
//   }, {
//     where: { 
//       admId,
//       delYn: 'N'
//     }
//   });
//   return affectedRows > 0;
// }

// /**
//  * 비밀번호 업데이트
//  */
// export async function updatePassword(admId: number, password: string, updatedBy: string): Promise<boolean> {
//   const [affectedRows] = await SysAdmAccount.update({
//     password,
//     updatedBy
//   }, {
//     where: { 
//       admId,
//       delYn: 'N'
//     }
//   });
//   return affectedRows > 0;
// }

// /**
//  * 관리자 목록 조회 (페이징)
//  */
// export async function findAdmins(options: {
//   page?: number;
//   limit?: number;
//   search?: string;
//   roles?: string;
//   status?: string;
// }): Promise<{
//   admins: SysAdmAccount[];
//   total: number;
// }> {
//   const page = options.page || 1;
//   const limit = options.limit || 10;
//   const offset = (page - 1) * limit;

//   const whereClause: any = {
//     delYn: 'N'
//   };

//   if (options.search) {
//     whereClause[Op.or] = [
//       { loginId: { [Op.iLike]: `%${options.search}%` } },
//       { name: { [Op.iLike]: `%${options.search}%` } },
//       { affiliation: { [Op.iLike]: `%${options.search}%` } }
//     ];
//   }

//   if (options.roles) {
//     whereClause.roles = options.roles;
//   }

//   if (options.status) {
//     whereClause.status = options.status;
//   }

//   const { count, rows } = await SysAdmAccount.findAndCountAll({
//     where: whereClause,
//     limit,
//     offset,
//     order: [['createdAt', 'DESC']]
//   });

//   return {
//     admins: rows,
//     total: count
//   };
// }

// /**
//  * 관리자 논리 삭제
//  */
// export async function deleteAdmin(admId: number, deletedBy: string): Promise<boolean> {
//   const [affectedRows] = await SysAdmAccount.update({
//     delYn: 'Y',
//     deletedBy
//   }, {
//     where: { 
//       admId,
//       delYn: 'N'
//     }
//   });
//   return affectedRows > 0;
// }

// /**
//  * 로그인 ID 중복 확인
//  */
// export async function isLoginIdExists(loginId: string): Promise<boolean> {
//   const admin = await SysAdmAccount.findOne({ 
//     where: { 
//       loginId,
//       delYn: 'N'
//     } 
//   });
//   return !!admin;
// }

// /**
//  * 활성 관리자 수 조회
//  */
// export async function getActiveAdminCount(): Promise<number> {
//   return SysAdmAccount.count({
//     where: {
//       delYn: 'N',
//       status: 'A'
//     }
//   });
// } 