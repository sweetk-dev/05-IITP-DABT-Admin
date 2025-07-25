import fs from 'fs';
import path from 'path';

interface AccessLogEntry {
  requestId: string;
  timestamp: string;
  method: string;
  url: string;
  ip: string;
  userId: string | number;
  userType: string;
  statusCode: number;
  responseTime: string;
  success: boolean;
}

/**
 * Access Log에서 모든 API 호출 기록을 반환
 * @param date 날짜 (YYYY-MM-DD)
 * @returns API 호출 기록 배열
 */
export const getAccessLogs = (date: string): AccessLogEntry[] => {
  const logFile = path.join(process.cwd(), 'logs', `access-${date}.log`);
  
  if (!fs.existsSync(logFile)) {
    return [];
  }

  const logContent = fs.readFileSync(logFile, 'utf-8');
  const lines = logContent.split('\n').filter(line => line.trim());
  
  const logs: AccessLogEntry[] = [];

  // 로그 라인 파싱
  lines.forEach(line => {
    try {
      const logEntry = JSON.parse(line);
      if (logEntry.requestId && logEntry.method && logEntry.url) {
        logs.push(logEntry);
      }
    } catch (error) {
      // JSON 파싱 실패 시 무시
    }
  });

  return logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

/**
 * 특정 사용자의 API 사용 패턴 분석
 * @param date 날짜
 * @param userId 사용자 ID
 * @returns 사용자별 API 사용 통계
 */
export const analyzeUserActivity = (date: string, userId: string | number) => {
  const logs = getAccessLogs(date);
  
  const userLogs = logs.filter(log => log.userId === userId);

  const apiUsage = new Map<string, { count: number; totalTime: number; errors: number }>();

  userLogs.forEach(log => {
    const url = log.url;
    const current = apiUsage.get(url) || { count: 0, totalTime: 0, errors: 0 };
    const responseTime = parseInt(log.responseTime.replace('ms', ''));
    
    current.count++;
    current.totalTime += responseTime;
    if (!log.success) {
      current.errors++;
    }
    
    apiUsage.set(url, current);
  });

  return {
    userId,
    date,
    totalRequests: userLogs.length,
    apiUsage: Array.from(apiUsage.entries()).map(([url, stats]) => ({
      url,
      ...stats,
      avgTime: stats.totalTime / stats.count
    }))
  };
};

/**
 * 성능 분석 (응답 시간 기준)
 * @param date 날짜
 * @param threshold 임계값 (ms)
 * @returns 느린 API 호출 목록
 */
export const analyzePerformance = (date: string, threshold: number = 1000) => {
  const logs = getAccessLogs(date);
  
  return logs
    .filter(log => {
      const responseTime = parseInt(log.responseTime.replace('ms', ''));
      return responseTime > threshold;
    })
    .map(log => ({
      requestId: log.requestId,
      url: log.url,
      method: log.method,
      userId: log.userId,
      responseTime: parseInt(log.responseTime.replace('ms', '')),
      statusCode: log.statusCode,
      success: log.success
    }))
    .sort((a, b) => b.responseTime - a.responseTime);
};

/**
 * API 사용 통계
 * @param date 날짜
 * @returns API별 사용 통계
 */
export const getApiStats = (date: string) => {
  const logs = getAccessLogs(date);
  
  const apiStats = new Map<string, { 
    count: number; 
    totalTime: number; 
    errors: number; 
    avgTime: number;
    successRate: number;
  }>();

  logs.forEach(log => {
    const url = log.url;
    const current = apiStats.get(url) || { 
      count: 0, 
      totalTime: 0, 
      errors: 0, 
      avgTime: 0, 
      successRate: 0 
    };
    const responseTime = parseInt(log.responseTime.replace('ms', ''));
    
    current.count++;
    current.totalTime += responseTime;
    if (!log.success) {
      current.errors++;
    }
    
    current.avgTime = current.totalTime / current.count;
    current.successRate = ((current.count - current.errors) / current.count) * 100;
    
    apiStats.set(url, current);
  });

  return Array.from(apiStats.entries()).map(([url, stats]) => ({
    url,
    ...stats
  })).sort((a, b) => b.count - a.count);
}; 