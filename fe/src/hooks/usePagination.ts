import { useState, useCallback } from 'react';
import { PAGINATION } from '../constants/pagination';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalItems?: number;
  onChange?: (page: number, limit: number) => void;
}

export function usePagination({
  initialPage = PAGINATION.DEFAULT_PAGE,
  initialLimit = PAGINATION.DEFAULT_PAGE_SIZE,
  totalItems = 0,
  onChange
}: UsePaginationOptions = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialLimit);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    onChange?.(page, pageSize);
  }, [onChange, pageSize]);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // 페이지 크기가 변경되면 첫 페이지로 이동
    onChange?.(1, newPageSize);
  }, [onChange]);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setPageSize(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
    paginationParams: {
      page: currentPage,
      limit: pageSize
    }
  };
} 