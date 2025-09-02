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

// Frontend 서버 재시작 (Nginx 재시작)
async function restartFrontend() {
  console.log('🔄 Frontend 서버 재시작 중...');
  
  const restartProcess = spawn('systemctl', ['restart', 'nginx'], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    restartProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Frontend 서버 재시작 완료');
        resolve();
      } else {
        reject(new Error(`Frontend 서버 재시작 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Frontend 서버 재시작...');
    
    // 1. 서버 재시작
    await restartFrontend();
    
    console.log('🎉 Frontend 서버 재시작 완료!');
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   systemctl status nginx        # Nginx 상태 확인');
    console.log('   nginx -t                      # Nginx 설정 테스트');
    console.log('   tail -f /var/log/nginx/error.log # 에러 로그 확인');
    
  } catch (error) {
    console.error('❌ Frontend 서버 재시작 실패:', error.message);
    process.exit(1);
  }
}

main();
