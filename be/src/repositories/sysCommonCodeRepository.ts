import { SysCommonCode, SysCommonCodeAttributes } from '../models/sysCommonCode';
import { Op } from 'sequelize';

/**
 * 그룹 ID로 공통 코드 목록 조회
 */
export async function findCommonCodesByGroupId(grpId: string): Promise<SysCommonCode[]> {
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
}

/**
 * 그룹 ID와 코드 ID로 특정 공통 코드 조회
 */
export async function findCommonCodeById(grpId: string, codeId: string): Promise<SysCommonCode | null> {
  return SysCommonCode.findOne({
    where: {
      grpId,
      codeId,
      useYn: 'Y',
      delYn: 'N'
    }
  });
}

/**
 * 코드 타입별로 공통 코드 목록 조회
 */
export async function findCommonCodesByType(codeType: 'B' | 'A' | 'S'): Promise<SysCommonCode[]> {
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
}

/**
 * 계층형 구조의 공통 코드 조회 (parent_code_id 기준)
 */
export async function findCommonCodesByParent(grpId: string, parentCodeId?: string): Promise<SysCommonCode[]> {
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
}

/**
 * 공통 코드 생성
 */
export async function createCommonCode(codeData: SysCommonCodeAttributes): Promise<SysCommonCode> {
  return SysCommonCode.create(codeData);
}

/**
 * 공통 코드 수정
 */
export async function updateCommonCode(grpId: string, codeId: string, updateData: Partial<SysCommonCodeAttributes>): Promise<number> {
  const [affectedCount] = await SysCommonCode.update(updateData, {
    where: {
      grpId,
      codeId,
      delYn: 'N'
    }
  });
  return affectedCount;
}

/**
 * 공통 코드 논리 삭제
 */
export async function deleteCommonCode(grpId: string, codeId: string, deletedBy?: string): Promise<number> {
  const [affectedCount] = await SysCommonCode.update({
    delYn: 'Y',
    deletedBy,
    deletedAt: new Date()
  }, {
    where: {
      grpId,
      codeId,
      delYn: 'N'
    }
  });
  return affectedCount;
}

/**
 * 그룹별 공통 코드 통계 조회
 */
export async function getCommonCodeStats(): Promise<Array<{ grpId: string; grpNm: string; count: number }>> {
  const result = await SysCommonCode.findAll({
    attributes: [
      'grpId',
      'grpNm',
      [SysCommonCode.sequelize!.fn('COUNT', SysCommonCode.sequelize!.col('codeId')), 'count']
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
} 