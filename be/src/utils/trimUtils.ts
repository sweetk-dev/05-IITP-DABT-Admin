/**
 * 백엔드 공통 trim 처리 유틸리티 (성능 최적화 버전)
 */

/**
 * 객체의 모든 string 필드를 trim 처리 (성능 최적화)
 * @param obj trim할 객체
 * @returns trim된 객체
 */
export function trimStringFields<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  // 성능 최적화: 변경이 필요한지 먼저 확인
  let hasChanges = false;
  const changes: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== value) {
          changes[key] = trimmed;
          hasChanges = true;
        }
      } else if (Array.isArray(value)) {
        // 배열 처리 최적화: 변경이 있는 경우만 처리
        const trimmedArray = value.map((item: any) => 
          typeof item === 'object' && item !== null ? trimStringFields(item) : item
        );
        
        // 배열 내용이 변경되었는지 확인
        if (JSON.stringify(trimmedArray) !== JSON.stringify(value)) {
          changes[key] = trimmedArray;
          hasChanges = true;
        }
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // 중첩 객체 처리 최적화
        const trimmedObj = trimStringFields(value);
        if (trimmedObj !== value) {
          changes[key] = trimmedObj;
          hasChanges = true;
        }
      }
    }
  }
  
  // 변경사항이 없으면 원본 객체 반환 (메모리 절약)
  if (!hasChanges) {
    return obj;
  }
  
  // 변경사항만 병합하여 새 객체 생성
  return { ...obj, ...changes };
}

/**
 * 특정 필드만 trim 처리 (비밀번호 등은 제외) - 성능 최적화
 * @param obj trim할 객체
 * @param excludeFields 제외할 필드명 배열
 * @returns trim된 객체
 */
export function trimStringFieldsExcept<T extends Record<string, any>>(
  obj: T, 
  excludeFields: string[] = []
): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  // 제외 필드 Set으로 변환 (검색 성능 향상)
  const excludeSet = new Set(excludeFields);
  
  // 성능 최적화: 변경이 필요한지 먼저 확인
  let hasChanges = false;
  const changes: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && !excludeSet.has(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== value) {
          changes[key] = trimmed;
          hasChanges = true;
        }
      } else if (Array.isArray(value)) {
        // 배열 처리 최적화
        const trimmedArray = value.map((item: any) => 
          typeof item === 'object' && item !== null ? trimStringFieldsExcept(item, excludeFields) : item
        );
        
        // 배열 내용이 변경되었는지 확인
        if (JSON.stringify(trimmedArray) !== JSON.stringify(value)) {
          changes[key] = trimmedArray;
          hasChanges = true;
        }
      } else if (value && typeof value === 'object' && !Array.isArray(value)) {
        // 중첩 객체 처리 최적화
        const trimmedObj = trimStringFieldsExcept(value, excludeFields);
        if (trimmedObj !== value) {
          changes[key] = trimmedObj;
          hasChanges = true;
        }
      }
    }
  }
  
  // 변경사항이 없으면 원본 객체 반환 (메모리 절약)
  if (!hasChanges) {
    return obj;
  }
  
  // 변경사항만 병합하여 새 객체 생성
  return { ...obj, ...changes };
}

/**
 * 단일 문자열 trim 처리 (가장 빠른 방법)
 * @param str trim할 문자열
 * @returns trim된 문자열
 */
export function trimString(str: string): string {
  return typeof str === 'string' ? str.trim() : str;
}

/**
 * 객체의 특정 필드만 trim 처리 (선택적 처리)
 * @param obj trim할 객체
 * @param fields trim할 필드명 배열
 * @returns trim된 객체
 */
export function trimSpecificFields<T extends Record<string, any>>(
  obj: T, 
  fields: string[]
): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const fieldSet = new Set(fields);
  let hasChanges = false;
  const changes: Record<string, any> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && fieldSet.has(key)) {
      const value = obj[key];
      
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed !== value) {
          changes[key] = trimmed;
          hasChanges = true;
        }
      }
    }
  }
  
  return hasChanges ? { ...obj, ...changes } : obj;
}

/**
 * DTO 클래스용 데코레이터 (향후 확장 가능)
 */
export function AutoTrim(excludeFields: string[] = []) {
  return function (target: any) {
    const originalConstructor = target;
    
    const newConstructor: any = function (...args: any[]) {
      const instance = new originalConstructor(...args);
      
      // 인스턴스 생성 시 자동 trim
      const trimmedData = trimStringFieldsExcept(instance, excludeFields);
      Object.assign(instance, trimmedData);
      
      return instance;
    };
    
    newConstructor.prototype = originalConstructor.prototype;
    return newConstructor;
  };
} 