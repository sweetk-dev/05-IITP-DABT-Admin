import { useState, useEffect, useCallback } from 'react';
import { DataState } from '../types/api';

interface UseDataFetchingOptions<T> {
  fetchFunction: () => Promise<T>;
  dependencies?: any[];
  autoFetch?: boolean;
}

export function useDataFetching<T>({
  fetchFunction,
  dependencies = [],
  autoFetch = true
}: UseDataFetchingOptions<T>) {
  const [state, setState] = useState<DataState<T>>({ status: 'loading' });

  const fetchData = useCallback(async () => {
    try {
      setState({ status: 'loading' });
      const data = await fetchFunction();
      
      // 빈 배열이거나 빈 객체인 경우 empty 상태로 처리
      if (Array.isArray(data) && data.length === 0) {
        setState({ status: 'empty' });
      } else if (typeof data === 'object' && data !== null && Object.keys(data).length === 0) {
        setState({ status: 'empty' });
      } else {
        setState({ status: 'success', data });
      }
    } catch (error) {
      setState({ 
        status: 'error', 
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' 
      });
    }
  }, [fetchFunction]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    ...state,
    refetch,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isEmpty: state.status === 'empty',
    isError: state.status === 'error',
    data: state.status === 'success' ? state.data : undefined
  };
} 