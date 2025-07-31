import { useState, useEffect, useCallback } from 'react';
import type { DataState, ApiResponse } from '../types/api';
import { handleApiResponse } from '../utils/apiResponseHandler';

interface UseDataFetchingOptions<T> {
  fetchFunction: () => Promise<ApiResponse<T>>;
  dependencies?: any[];
  autoFetch?: boolean;
  onError?: (error: string) => void;
}

export function useDataFetching<T>({
  fetchFunction,
  dependencies = [],
  autoFetch = true,
  onError
}: UseDataFetchingOptions<T>) {
  const [state, setState] = useState<DataState<T>>({ status: 'loading' });

  const fetchData = useCallback(async () => {
    try {
      setState({ status: 'loading' });
      const response = await fetchFunction();
      
      // ApiResponse 구조 처리
      if (response.success && response.data) {
        // 빈 배열이거나 빈 객체인 경우 empty 상태로 처리
        if (Array.isArray(response.data) && response.data.length === 0) {
          setState({ status: 'empty' });
        } else if (typeof response.data === 'object' && response.data !== null && Object.keys(response.data).length === 0) {
          setState({ status: 'empty' });
        } else {
          setState({ status: 'success', data: response.data });
        }
      } else {
        // 에러 처리 - handleApiResponse 사용
        handleApiResponse(response, undefined, (error) => {
          setState({ status: 'error', error });
          onError?.(error);
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setState({ status: 'error', error: errorMessage });
      onError?.(errorMessage);
    }
  }, [fetchFunction, onError]);

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