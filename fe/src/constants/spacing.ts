// 전체 애플리케이션에서 사용하는 간격 상수
export const SPACING = {
  // 제목 하단 간격
  TITLE_BOTTOM: 3,
  
  // 입력 필드 간격
  FIELD_BOTTOM: 3,
  
  // 성공 메시지 하단 간격
  SUCCESS_MESSAGE_BOTTOM: 3,
  
  // 에러 Alert 하단 간격
  ERROR_ALERT_BOTTOM: 3,
  
  // 섹션 간격
  SECTION_BOTTOM: 4,
  
  // 작은 간격
  SMALL: 1,
  
  // 중간 간격
  MEDIUM: 2,
  
  // 큰 간격
  LARGE: 3,
  
  // 매우 큰 간격
  EXTRA_LARGE: 4
} as const;

// 특정 페이지별 간격 설정
export const PAGE_SPACING = {
  REGISTER: {
    TITLE_BOTTOM: SPACING.TITLE_BOTTOM,
    FIELD_BOTTOM: SPACING.FIELD_BOTTOM,
    SUCCESS_MESSAGE_BOTTOM: SPACING.SUCCESS_MESSAGE_BOTTOM
  },
  PROFILE: {
    ERROR_ALERT_BOTTOM: SPACING.ERROR_ALERT_BOTTOM,
    FIELD_BOTTOM: SPACING.FIELD_BOTTOM
  }
} as const; 