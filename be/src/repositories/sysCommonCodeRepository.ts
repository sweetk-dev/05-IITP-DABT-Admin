import { SysCommonCode, SysCommonCodeAttributes } from '../models/sysCommonCode';
import { Op } from 'sequelize';
import { toIsoString } from '../utils/timeUtils';

import { CodeGroupData } from '../services/common/commonCodeService';





export const commonCodeRepository = {

  /**
   * 그룹 ID로 공통 코드 목록 조회
   */
  async findCommonCodesByGroupId(grpId: string): Promise<SysCommonCode[]> {
    return SysCommonCode.findAll({
      where: {
        grpId,
        useYn: 'Y',
        delYn: 'N'
      },
      order: [
        ['codeLvl', 'ASC'],
        ['sortOrder', 'ASC'],
        ['codeId', 'ASC']
      ]
    });
  },

  /**
   * 그룹 ID와 코드 ID로 특정 공통 코드 조회
   */
  async findCommonCodeById(grpId: string, codeId: string): Promise<SysCommonCode | null> {
    return SysCommonCode.findOne({
      where: {
        grpId,
        codeId,
        useYn: 'Y',
        delYn: 'N'
      }
    });
  },

  /**
   * 코드 타입별로 공통 코드 목록 조회
   */
  async findCommonCodesByType(codeType: 'B' | 'A' | 'S'): Promise<SysCommonCode[]> {
    return SysCommonCode.findAll({
      where: {
        codeType,
        useYn: 'Y',
        delYn: 'N'
      },
      order: [
        ['grpId', 'ASC'],
        ['codeLvl', 'ASC'],
        ['sortOrder', 'ASC']
      ]
    });
  },

  /**
   * 계층형 구조의 공통 코드 조회 (parent_code_id 기준)
   */
  async findCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<SysCommonCode[]> {
    const whereCondition: any = {
      grpId,
      useYn: 'Y',
      delYn: 'N'
    };

    if (parentCodeId) {
      whereCondition.parentCodeId = parentCodeId;
    } else {
      whereCondition.parentCodeId = { [Op.is]: null };
    }

    return SysCommonCode.findAll({
      where: whereCondition,
      order: [
        ['codeLvl', 'ASC'],
        ['sortOrder', 'ASC'],
        ['codeId', 'ASC']
      ]
    });
  },

  /**
   * 공통 코드 생성
   */
  async createCommonCode(codeData: SysCommonCodeAttributes): Promise<SysCommonCode> {
    return SysCommonCode.create(codeData);
  },

  /**
   * 공통 코드 일괄 생성
   */
  async createCommonCodes(codeDataList: SysCommonCodeAttributes[]): Promise<SysCommonCode[]> {
    return SysCommonCode.bulkCreate(codeDataList);
  },

  /**
   * 공통 코드 수정
   */
  async updateCommonCode(grpId: string, codeId: string, updateData: Partial<SysCommonCodeAttributes>): Promise<number> {
    const [affectedCount] = await SysCommonCode.update(updateData, {
      where: {
        grpId,
        codeId,
        delYn: 'N'
      }
    });
    return affectedCount;
  },

  /**
   * 공통 코드 논리 삭제
   */
  async deleteCommonCode(grpId: string, codeId: string, deletedBy?: string): Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      delYn: 'Y',
      deletedBy,
      deletedAt: new Date()  // ✅ Sequelize 모델 속성명 사용
    }, {
      where: {
        grpId,
        codeId,
        delYn: 'N'
      }
    });
    return affectedCount;
  },


  async deleteCommonCodesByGroupId(grpId: string, codeIds: string[], deletedBy?: string) : Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      delYn: 'Y',
      deletedBy,
      deletedAt: new Date()  // ✅ Sequelize 모델 속성명 사용
    }, {
      where: {
        grpId,
        codeId: {
          [Op.in]: codeIds
        },
      }
    });
    return affectedCount;
  },


  /**
   * 그룹별 공통 코드 통계 조회
   */
  async getCommonCodeStats(): Promise<Array<{ grpId: string; grpNm: string; count: number }>> {
    const result = await SysCommonCode.findAll({
      attributes: [
        'grpId',
        'grpNm',
        [SysCommonCode.sequelize!.fn('COUNT', SysCommonCode.sequelize!.col('code_id')), 'count']  // ✅ 'codeId' → 'code_id'로 수정
      ],
      where: {
        useYn: 'Y',
        delYn: 'N'
      },
      group: ['grpId', 'grpNm'],
      order: [['grpId', 'ASC']]
    });

    return result.map(item => ({
      grpId: item.grpId,
      grpNm: item.grpNm,
      count: parseInt(item.get('count') as string)
    }));
  },


  /**
   * 공통 코드 그룹 목록 조회
   */
  async getCommonCodeGroups(filters?: { search?: string; useYn?: string; sort?: string }): Promise<CodeGroupData[]> {
    // ✅ 기본 where 조건
    const whereCondition: any = {
      delYn: 'N'
    };

    // ✅ useYn 필터링
    if (filters?.useYn && filters.useYn !== '') {
      whereCondition.useYn = filters.useYn;
    } else {
      whereCondition.useYn = 'Y'; // 기본값: 활성화된 그룹만
    }

    // ✅ 검색 필터링
    if (filters?.search) {
      whereCondition[Op.or] = [
        { grpId: { [Op.like]: `%${filters.search}%` } },
        { grpNm: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    // ✅ 정렬 조건
    let orderCondition: any = [['grpId', 'ASC']]; // 기본 정렬
    if (filters?.sort) {
      const [key, order] = filters.sort.split('-');
      if (key === 'grpNm') {
        orderCondition = [['grpNm', order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
      } else if (key === 'createdAt') {
        orderCondition = [['createdAt', order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC']];
      }
    }

    const result = await SysCommonCode.findAll({
      attributes: [
        'grpId',
        'grpNm',
        'codeType',  // ✅ 추가: 코드 타입 정보 (선택적)
        [SysCommonCode.sequelize!.fn('COUNT', SysCommonCode.sequelize!.col('code_id')), 'codeCount'],  // ✅ 'codeId' → 'code_id'로 수정
        [SysCommonCode.sequelize!.fn('MIN', SysCommonCode.sequelize!.col('created_at')), 'createdAt'],  // ✅ 'createdAt' → 'created_at'으로 수정
        [SysCommonCode.sequelize!.fn('MAX', SysCommonCode.sequelize!.col('updated_at')), 'updatedAt']   // ✅ 'updatedAt' → 'updated_at'으로 수정
      ],
      where: whereCondition,
      group: ['grpId', 'grpNm', 'codeType'],  // ✅ 추가: codeType 그룹핑
      order: orderCondition
    });

    return result.map(item => ({
      grpId: item.grpId,
      grpNm: item.grpNm,
      codeType: item.codeType || undefined,  // ✅ codeType이 없으면 undefined로 처리
      codeCount: parseInt(item.get('codeCount') as string),
      createdAt: item.get('createdAt') ? toIsoString(item.get('createdAt') as Date) : undefined,  
      updatedAt: item.get('updatedAt') ? toIsoString(item.get('updatedAt') as Date) : undefined
    }));
  },

  /**
   * 그룹 ID로 모든 코드의 그룹명 일괄 수정
   */
  async updateCommonCodeWithGroupByGroup(grpId: string, grpNm: string, updateBy?: string): Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      grpNm,
      updatedBy: updateBy,
      updatedAt: new Date()  // ✅ Sequelize 모델 속성명 사용
    }, {
      where: { 
        grpId,
        delYn: 'N'  // 삭제되지 않은 코드만 수정
      }
    });

    return affectedCount;
  },


  /**
   * 그룹 ID 리스트로 모든 코드 일관  delete 상태 수정
   */
  async deleteCommonCodesByGroupIdes( grpIds: string[], deletedBy?:string ):  Promise<number> {
    const [affectedCount] = await SysCommonCode.update({
      delYn: 'Y',
      deletedBy,
      deletedAt: new Date()  // ✅ Sequelize 모델 속성명 사용
    }, {
      where: {
        grpId : { [Op.in] : grpIds }
      }
    });
    return affectedCount;
  }




} as const;
