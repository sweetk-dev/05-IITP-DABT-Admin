#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 시작 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 설정
const config = {
  bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-backend',
  pm2AppName: process.env.PM2_APP_NAME_BE || 'iitp-dabt-backend'
};

// Backend 서버 시작
async function startBackend() {
  console.log('🔧 Backend 서버 시작 중...');
  
  // 의존성 설치
  console.log('📦 의존성 설치 중...');
  const installProcess = spawn('npm', ['install', '--production'], {
    stdio: 'inherit',
    cwd: config.bePath
  });
  
  await new Promise((resolve, reject) => {
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 의존성 설치 완료');
        resolve();
      } else {
        reject(new Error(`의존성 설치 실패 (종료 코드: ${code})`));
      }
    });
  });
  
  // PM2로 서버 시작
  console.log('🚀 PM2로 Backend 서버 시작 중...');
  const startProcess = spawn('pm2', ['start', 'dist/index.js', '--name', config.pm2AppName], {
    stdio: 'inherit',
    cwd: config.bePath
  });
  
  return new Promise((resolve, reject) => {
    startProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend 서버 시작 완료');
        resolve();
      } else {
        reject(new Error(`Backend 서버 시작 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Backend 서버 시작...');
    
    // 1. 서버 시작
    await startBackend();
    
    console.log('🎉 Backend 서버 시작 완료!');
    console.log('');
    console.log('📋 서버 정보:');
    console.log(`   경로: ${config.bePath}`);
    console.log(`   PM2 앱명: ${config.pm2AppName}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   pm2 status                    # 서버 상태 확인');
    console.log('   pm2 logs iitp-dabt-backend    # 로그 확인');
    console.log('   pm2 restart iitp-dabt-backend # 서버 재시작');
    console.log('   pm2 stop iitp-dabt-backend    # 서버 중지');
    
  } catch (error) {
    console.error('❌ Backend 서버 시작 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.PROD_BE_PATH) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   PROD_BE_PATH: Backend 서버 경로 (기본값: /var/www/iitp-dabt-backend)');
  console.log('   PM2_APP_NAME_BE: PM2 앱 이름 (기본값: iitp-dabt-backend)');
  console.log('');
  console.log('💡 예시:');
  console.log('   export PROD_BE_PATH=/var/www/iitp-dabt-backend');
  console.log('   export PM2_APP_NAME_BE=iitp-dabt-backend');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
}

main();
