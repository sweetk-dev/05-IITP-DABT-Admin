#!/usr/bin/env node
/**
 * 크로스 플랫폼 개발 서버 실행 스크립트
 * Windows와 Linux 모두에서 작동
 */

const { spawn } = require('child_process');
const path = require('path');

// OS 감지
const isWindows = process.platform === 'win32';

console.log(`🚀 [${isWindows ? 'Windows' : 'Linux'}] 개발 서버 시작...`);

// TypeScript 컴파일러 감시 모드
const tscProcess = spawn('npx', ['tsc', '--watch'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname + '/..'
});

// Nodemon 서버 실행 (설정 파일 명시)
const nodemonProcess = spawn('npx', ['nodemon', '--config', 'nodemon.json'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname + '/..',
  env: { ...process.env, NODE_ENV: 'development' }
});

// 프로세스 종료 처리
const cleanup = () => {
  console.log('\n🛑 서버 종료 중...');
  tscProcess.kill();
  nodemonProcess.kill();
  process.exit(0);
};

// 시그널 처리
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// 에러 처리
tscProcess.on('error', (err) => {
  console.error('❌ TypeScript 컴파일러 오류:', err);
  cleanup();
});

nodemonProcess.on('error', (err) => {
  console.error('❌ Nodemon 오류:', err);
  cleanup();
});

console.log('✅ 개발 서버가 시작되었습니다. Ctrl+C로 종료하세요.'); 