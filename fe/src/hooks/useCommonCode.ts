import { useState, useCallback } from 'react';
import { 
  getCommonCodesByGroupId, 
  getCommonCodesByGroupIdDetail
} from '../api';
import { COMMON_CODE_GROUPS } from '@iitp-dabt/common';
import type { 
  CommonCode, 
  CommonCodeDetail
} from '@iitp-dabt/common';

/**
 * 공통 코드를 관리하는 React Hook (사용자용)
 */
export function useCommonCode() {
  const [codes, setCodes] = useState<Record<string, CommonCode[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  /**
   * 그룹 ID로 공통 코드 조회 (사용자용)
   */
  const fetchCodesByGroup = useCallback(async (grpId: string) => {
    if (codes[grpId]) {
      return codes[grpId]; // 이미 로드된 경우 캐시된 데이터 반환
    }

    setLoading(prev => ({ ...prev, [grpId]: true }));
    setError(prev => ({ ...prev, [grpId]: '' }));

    try {
      const response = await getCommonCodesByGroupId(grpId);
      if (response.success && response.data) {
        setCodes(prev => ({ ...prev, [grpId]: response.data!.codes }));
        return response.data.codes;
      } else {
        throw new Error(response.errorMessage || 'Failed to fetch common codes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(prev => ({ ...prev, [grpId]: errorMessage }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [grpId]: false }));
    }
  }, [codes]);

  /**
   * 특정 코드 조회 (사용자용)
   */
  const getCodeById = useCallback((grpId: string, codeId: string): CommonCode | undefined => {
    return codes[grpId]?.find(code => code.codeId === codeId);
  }, [codes]);

  /**
   * 코드 이름으로 코드 ID 찾기
   */
  const getCodeIdByName = useCallback((grpId: string, codeNm: string): string | undefined => {
    return codes[grpId]?.find(code => code.codeNm === codeNm)?.codeId;
  }, [codes]);

  /**
   * 코드 ID로 코드 이름 찾기
   */
  const getCodeNameById = useCallback((grpId: string, codeId: string): string | undefined => {
    return codes[grpId]?.find(code => code.codeId === codeId)?.codeNm;
  }, [codes]);

  /**
   * 그룹의 모든 코드 이름 목록
   */
  const getCodeNames = useCallback((grpId: string): string[] => {
    return codes[grpId]?.map(code => code.codeNm) || [];
  }, [codes]);

  /**
   * 그룹의 모든 코드 ID 목록
   */
  const getCodeIds = useCallback((grpId: string): string[] => {
    return codes[grpId]?.map(code => code.codeId) || [];
  }, [codes]);

  /**
   * 특정 그룹의 로딩 상태
   */
  const isLoading = useCallback((grpId: string): boolean => {
    return loading[grpId] || false;
  }, [loading]);

  /**
   * 특정 그룹의 에러 상태
   */
  const getError = useCallback((grpId: string): string => {
    return error[grpId] || '';
  }, [error]);

  return {
    codes,
    fetchCodesByGroup,
    getCodeById,
    getCodeIdByName,
    getCodeNameById,
    getCodeNames,
    getCodeIds,
    isLoading,
    getError,
  };
}

/**
 * 공통 코드를 관리하는 React Hook (관리자용)
 */
export function useCommonCodeDetail() {
  const [codes, setCodes] = useState<Record<string, CommonCodeDetail[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string>>({});

  /**
   * 그룹 ID로 공통 코드 조회 (관리자용)
   */
  const fetchCodesByGroup = useCallback(async (grpId: string) => {
    if (codes[grpId]) {
      return codes[grpId]; // 이미 로드된 경우 캐시된 데이터 반환
    }

    setLoading(prev => ({ ...prev, [grpId]: true }));
    setError(prev => ({ ...prev, [grpId]: '' }));

    try {
      const response = await getCommonCodesByGroupIdDetail(grpId);
      if (response.success && response.data) {
        setCodes(prev => ({ ...prev, [grpId]: response.data!.codes }));
        return response.data.codes;
      } else {
        throw new Error(response.errorMessage || 'Failed to fetch common codes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(prev => ({ ...prev, [grpId]: errorMessage }));
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, [grpId]: false }));
    }
  }, [codes]);

  /**
   * 특정 코드 조회 (관리자용)
   */
  const getCodeById = useCallback((grpId: string, codeId: string): CommonCodeDetail | undefined => {
    return codes[grpId]?.find(code => code.codeId === codeId);
  }, [codes]);

  /**
   * 코드 이름으로 코드 ID 찾기
   */
  const getCodeIdByName = useCallback((grpId: string, codeNm: string): string | undefined => {
    return codes[grpId]?.find(code => code.codeNm === codeNm)?.codeId;
  }, [codes]);

  /**
   * 코드 ID로 코드 이름 찾기
   */
  const getCodeNameById = useCallback((grpId: string, codeId: string): string | undefined => {
    return codes[grpId]?.find(code => code.codeId === codeId)?.codeNm;
  }, [codes]);

  /**
   * 그룹의 모든 코드 이름 목록
   */
  const getCodeNames = useCallback((grpId: string): string[] => {
    return codes[grpId]?.map(code => code.codeNm) || [];
  }, [codes]);

  /**
   * 그룹의 모든 코드 ID 목록
   */
  const getCodeIds = useCallback((grpId: string): string[] => {
    return codes[grpId]?.map(code => code.codeId) || [];
  }, [codes]);

  /**
   * 특정 그룹의 로딩 상태
   */
  const isLoading = useCallback((grpId: string): boolean => {
    return loading[grpId] || false;
  }, [loading]);

  /**
   * 특정 그룹의 에러 상태
   */
  const getError = useCallback((grpId: string): string => {
    return error[grpId] || '';
  }, [error]);

  return {
    codes,
    fetchCodesByGroup,
    getCodeById,
    getCodeIdByName,
    getCodeNameById,
    getCodeNames,
    getCodeIds,
    isLoading,
    getError,
  };
}

// 사용 예시를 위한 유틸리티 함수들
export const CommonCodeUtils = {
  // 관리자 역할 관련
  async getAdminRoles() {
    const { fetchCodesByGroup } = useCommonCode();
    return await fetchCodesByGroup(COMMON_CODE_GROUPS.SYS_ADMIN_ROLES);
  },

  // FAQ 관련
  async getFaqTypes() {
    const { fetchCodesByGroup } = useCommonCode();
    return await fetchCodesByGroup(COMMON_CODE_GROUPS.FAQ_TYPE);
  },

  async getFaqStatuses() {
    const { fetchCodesByGroup } = useCommonCode();
    return await fetchCodesByGroup(COMMON_CODE_GROUPS.FAQ_STATUS);
  },

  // QNA 관련
  async getQnaTypes() {
    const { fetchCodesByGroup } = useCommonCode();
    return await fetchCodesByGroup(COMMON_CODE_GROUPS.QNA_TYPE);
  },

  async getQnaStatuses() {
    const { fetchCodesByGroup } = useCommonCode();
    return await fetchCodesByGroup(COMMON_CODE_GROUPS.QNA_STATUS);
  },

  // 데이터 상태 관련
  async getDataStatuses() {
    const { fetchCodesByGroup } = useCommonCode();
    return await fetchCodesByGroup(COMMON_CODE_GROUPS.SYS_DATA_STATUS);
  },
}; 