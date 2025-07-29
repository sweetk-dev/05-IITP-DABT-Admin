// 공지사항 관련 API 타입 정의

// 사용자용 공지사항 아이템 (제한된 정보만)
export interface UserNoticeItem {
  noticeId: number;
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  postedAt: string;
}

// 관리자용 공지사항 아이템 (전체 정보)
export interface AdminNoticeItem {
  noticeId: number;
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn: 'Y' | 'N';
  publicYn: 'Y' | 'N';
  postedAt: string;
  startDt?: string;
  endDt?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

// 공지사항 목록 조회 요청
export interface NoticeListReq {
  page?: number;
  limit?: number;
  noticeType?: 'G' | 'S' | 'E';
  publicOnly?: boolean;
  includeExpired?: boolean;
  isAdmin?: boolean; // 관리자 여부
}

// 사용자용 공지사항 목록 조회 응답
export interface UserNoticeListRes {
  notices: UserNoticeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 관리자용 공지사항 목록 조회 응답
export interface AdminNoticeListRes {
  notices: AdminNoticeItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 사용자용 공지사항 상세 조회 응답
export interface UserNoticeDetailRes {
  notice: UserNoticeItem;
}

// 관리자용 공지사항 상세 조회 응답
export interface AdminNoticeDetailRes {
  notice: AdminNoticeItem;
}

// 공지사항 생성 요청
export interface NoticeCreateReq {
  title: string;
  content: string;
  noticeType: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
  createdBy?: string;
}

// 공지사항 수정 요청
export interface NoticeUpdateReq {
  title?: string;
  content?: string;
  noticeType?: 'G' | 'S' | 'E';
  pinnedYn?: 'Y' | 'N';
  publicYn?: 'Y' | 'N';
  startDt?: string;
  endDt?: string;
  updatedBy?: string;
}

// 사용자용 홈 화면 공지사항 조회 응답
export interface UserHomeNoticeRes {
  pinnedNotices: UserNoticeItem[];
  recentNotices: UserNoticeItem[];
}

// 관리자용 홈 화면 공지사항 조회 응답
export interface AdminHomeNoticeRes {
  pinnedNotices: AdminNoticeItem[];
  recentNotices: AdminNoticeItem[];
} 