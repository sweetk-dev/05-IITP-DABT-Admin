import { useState, useCallback } from 'react';

/**
 * 입력 필드의 trim 처리를 위한 공통 Hook
 * 
 * @param initialValue 초기값
 * @returns 입력 필드 상태와 trim된 값
 */
export function useInputWithTrim(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  const [displayValue, setDisplayValue] = useState(initialValue);
  
  const handleChange = useCallback((newValue: string) => {
    setDisplayValue(newValue); // 화면에는 그대로 표시
    setValue(newValue); // 내부 상태는 그대로 저장
  }, []);
  
  const getTrimmedValue = useCallback(() => value.trim(), [value]);
  
  const reset = useCallback(() => {
    setValue('');
    setDisplayValue('');
  }, []);
  
  return {
    value: displayValue,
    onChange: handleChange,
    getTrimmedValue,
    reset,
    // 편의를 위한 props 객체
    inputProps: {
      value: displayValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)
    }
  };
}

/**
 * 여러 입력 필드를 한번에 관리하는 Hook
 * 
 * @param fields 필드명 배열
 * @returns 각 필드별 상태와 전체 trim된 값
 */
export function useMultipleInputsWithTrim(fields: string[]) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [displayValues, setDisplayValues] = useState<Record<string, string>>({});
  
  const handleChange = useCallback((fieldName: string, newValue: string) => {
    setDisplayValues(prev => ({ ...prev, [fieldName]: newValue }));
    setValues(prev => ({ ...prev, [fieldName]: newValue }));
  }, []);
  
  const getTrimmedValues = useCallback(() => {
    const trimmed: Record<string, string> = {};
    Object.keys(values).forEach(key => {
      trimmed[key] = values[key].trim();
    });
    return trimmed;
  }, [values]);
  
  const reset = useCallback(() => {
    const emptyValues = fields.reduce((acc, field) => {
      acc[field] = '';
      return acc;
    }, {} as Record<string, string>);
    
    setValues(emptyValues);
    setDisplayValues(emptyValues);
  }, [fields]);
  
  return {
    values: displayValues,
    handleChange,
    getTrimmedValues,
    reset
  };
} 