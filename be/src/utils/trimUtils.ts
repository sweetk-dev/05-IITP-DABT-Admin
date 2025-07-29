/**
 * 백엔드 공통 trim 처리 유틸리티
 */

/**
 * 객체의 모든 string 필드를 trim 처리
 * @param obj trim할 객체
 * @returns trim된 객체
 */
export function trimStringFields<T extends Record<string, any>>(obj: T): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const trimmed = { ...obj } as T;
  
  Object.keys(trimmed).forEach(key => {
    const value = (trimmed as any)[key];
    
    if (typeof value === 'string') {
      (trimmed as any)[key] = value.trim();
    } else if (Array.isArray(value)) {
      // 배열 내의 객체들도 trim 처리
      (trimmed as any)[key] = value.map((item: any) => 
        typeof item === 'object' ? trimStringFields(item) : item
      );
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      // 중첩 객체도 trim 처리
      (trimmed as any)[key] = trimStringFields(value);
    }
  });
  
  return trimmed;
}

/**
 * 특정 필드만 trim 처리 (비밀번호 등은 제외)
 * @param obj trim할 객체
 * @param excludeFields 제외할 필드명 배열
 * @returns trim된 객체
 */
export function trimStringFieldsExcept<T extends Record<string, any>>(
  obj: T, 
  excludeFields: string[] = []
): T {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  const trimmed = { ...obj } as T;
  
  Object.keys(trimmed).forEach(key => {
    if (excludeFields.includes(key)) {
      return; // 제외 필드는 trim하지 않음
    }
    
    const value = (trimmed as any)[key];
    
    if (typeof value === 'string') {
      (trimmed as any)[key] = value.trim();
    } else if (Array.isArray(value)) {
      (trimmed as any)[key] = value.map((item: any) => 
        typeof item === 'object' ? trimStringFieldsExcept(item, excludeFields) : item
      );
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      (trimmed as any)[key] = trimStringFieldsExcept(value, excludeFields);
    }
  });
  
  return trimmed;
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