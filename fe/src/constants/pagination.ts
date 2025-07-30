// 페이지네이션 관련 공통 상수
export const PAGINATION = {
  // 기본 페이지 크기 (모든 리스트 화면)
  DEFAULT_PAGE_SIZE: 30,
  // 홈 화면용 페이지 크기
  HOME_PAGE_SIZE: 5,
  // 최대 페이지 크기
  MAX_PAGE_SIZE: 100,
  // 기본 페이지 번호
  DEFAULT_PAGE: 1
} as const;

// 페이지네이션 유틸리티 함수
export const getPaginationParams = (page?: number, limit?: number) => ({
  page: page || PAGINATION.DEFAULT_PAGE,
  limit: limit || PAGINATION.DEFAULT_PAGE_SIZE
});

export const getHomePaginationParams = () => ({
  page: PAGINATION.DEFAULT_PAGE,
  limit: PAGINATION.HOME_PAGE_SIZE
}); 