import { useState, useEffect, useCallback, useRef } from 'react';
import type { DataState, ApiResponse } from '../types/api';
import { handleApiResponse } from '../utils/apiResponseHandler';

interface UseDataFetchingOptions<T> {
  fetchFunction: () => Promise<ApiResponse<T>>;
  dependencies?: any[];
  autoFetch?: boolean;
  onError?: (error: string) => void;
  retry?: false | { attempts: number; delayMs?: number };
}

export function useDataFetching<T>({
  fetchFunction,
  dependencies = [],
  autoFetch = true,
  onError
}: UseDataFetchingOptions<T>) {
  const [state, setState] = useState<DataState<T>>({ status: 'loading' });
  const fetchFnRef = useRef(fetchFunction);
  const onErrorRef = useRef(onError);
  const hasErrorRef = useRef(false);
  // const retryRef = useRef(0);

  // Keep latest fetch function without changing stable callbacks
  useEffect(() => {
    fetchFnRef.current = fetchFunction;
  }, [fetchFunction]);
  
  // Keep latest onError without changing stable callbacks
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  const fetchData = useCallback(async (allowAfterError: boolean = false) => {
    // If an error occurred previously, block further auto-fetches until hard refresh
    if (hasErrorRef.current && !allowAfterError) {
      return;
    }
    try {
      setState({ status: 'loading' });
      const response = await fetchFnRef.current();
      
      // ApiResponse 구조 처리
      if (response.success && response.data) {
        // 페이징 응답 구조 확인 (items, total, page, limit, totalPages 필드가 있는 경우)
        if (response.data && typeof response.data === 'object' && 'items' in response.data) {
          const paginationData = response.data as any;
          
          // items가 배열이고 total이 0보다 크면 데이터가 있는 것으로 간주
          if (Array.isArray(paginationData.items) && paginationData.total > 0) {
            setState({ status: 'success', data: response.data });
          } else if (Array.isArray(paginationData.items) && paginationData.total === 0) {
            setState({ status: 'empty' });
          } else {
            setState({ status: 'success', data: response.data });
          }
        }
        // 일반 배열 응답 처리
        else if (Array.isArray(response.data)) {
          if (response.data.length === 0) {
            setState({ status: 'empty' });
          } else {
            setState({ status: 'success', data: response.data });
          }
        }
        // 일반 객체 응답 처리
        else if (typeof response.data === 'object' && response.data !== null) {
          const values = Object.values(response.data as any);
          const arrayValues = values.filter(v => Array.isArray(v)) as any[];
          const allArraysEmpty = arrayValues.length > 0 && arrayValues.every(arr => arr.length === 0);
          if (Object.keys(response.data as any).length === 0 || allArraysEmpty) {
            setState({ status: 'empty' });
          } else {
            setState({ status: 'success', data: response.data });
          }
        } else {
          setState({ status: 'success', data: response.data });
        }
      } else {
        // 에러 처리 - handleApiResponse 사용
        handleApiResponse(response, undefined, (error) => {
          setState({ status: 'error', error });
          onErrorRef.current?.(error);
          hasErrorRef.current = true;
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      // optional limited retries
      setState(prev => prev.status === 'success' ? prev : { status: 'error', error: errorMessage });
      onErrorRef.current?.(errorMessage);
      hasErrorRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!autoFetch) return;
    // let cancelled = false;
    const run = async () => {
      await fetchData();
    };
    run();
    return () => { /* noop */ };
  }, [autoFetch, fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    // explicit refetch can bypass the error lock if needed
    fetchData(true);
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