#!/usr/bin/env node

const { spawn } = require('child_process');

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 재시작 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 설정
const config = {
  pm2AppName: process.env.PM2_APP_NAME_BE || 'iitp-dabt-adm-be'
};

// Backend 서버 재시작
async function restartBackend() {
  console.log('🔄 Backend 서버 재시작 중...');
  
  const restartProcess = spawn('pm2', ['restart', config.pm2AppName], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    restartProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend 서버 재시작 완료');
        resolve();
      } else {
        reject(new Error(`Backend 서버 재시작 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Backend 서버 재시작...');
    
    // 1. 서버 재시작
    await restartBackend();
    
    console.log('🎉 Backend 서버 재시작 완료!');
    console.log('');
    console.log('📋 서버 정보:');
    console.log(`   PM2 앱명: ${config.pm2AppName}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   pm2 status                    # 서버 상태 확인');
    console.log('   pm2 logs iitp-dabt-adm-be    # 로그 확인');
    console.log('   pm2 stop iitp-dabt-adm-be    # 서버 중지');
    
  } catch (error) {
    console.error('❌ Backend 서버 재시작 실패:', error.message);
    process.exit(1);
  }
}

main();
