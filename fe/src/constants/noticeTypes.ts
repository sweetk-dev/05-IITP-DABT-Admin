// 공지사항 타입 상수 정의

export const NOTICE_TYPES = {
  GENERAL: 'G',
  SYSTEM: 'S', 
  EVENT: 'E'
} as const;

// 타입 정의를 더 명확하게
export type NoticeType = 'G' | 'S' | 'E';

// 공지사항 타입별 라벨
export const getNoticeTypeLabel = (type: string): string => {
  switch (type) {
    case NOTICE_TYPES.GENERAL: return '공지';
    case NOTICE_TYPES.SYSTEM: return '중요';
    case NOTICE_TYPES.EVENT: return '긴급';
    default: return type;
  }
};

// 공지사항 타입별 색상
export const getNoticeTypeColor = (type: string): 'default' | 'warning' | 'error' => {
  switch (type) {
    case NOTICE_TYPES.GENERAL: return 'default';
    case NOTICE_TYPES.SYSTEM: return 'warning';
    case NOTICE_TYPES.EVENT: return 'error';
    default: return 'default';
  }
};

// 공지사항 타입 옵션 (Select 컴포넌트용)
export const NOTICE_TYPE_OPTIONS = [
  { value: NOTICE_TYPES.GENERAL, label: '공지 (G)' },
  { value: NOTICE_TYPES.SYSTEM, label: '중요 (S)' },
  { value: NOTICE_TYPES.EVENT, label: '긴급 (E)' }
];

// 공지사항 타입 필터 옵션 (전체 포함)
export const NOTICE_TYPE_FILTER_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: NOTICE_TYPES.GENERAL, label: '공지' },
  { value: NOTICE_TYPES.SYSTEM, label: '중요' },
  { value: NOTICE_TYPES.EVENT, label: '긴급' }
];
