// Common API Request/Response 타입 정의

// 버전 정보 조회
export interface CommonVersionReq {
  // 현재는 파라미터 없음
}

export interface CommonVersionRes {
  version: string;
  buildDate: string;
  environment: string;
}

// JWT 설정 정보 조회
export interface CommonJwtConfigReq {
  // 현재는 파라미터 없음
}

export interface CommonJwtConfigRes {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
  algorithm: string;
}

// 헬스 체크
export interface CommonHealthReq {
  // 현재는 파라미터 없음
}

export interface CommonHealthRes {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  database: {
    status: 'connected' | 'disconnected';
  };
} 