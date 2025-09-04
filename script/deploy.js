#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';

console.log(`🖥️  OS 감지: ${process.platform} (${isWindows ? 'Windows' : isLinux ? 'Linux' : isMac ? 'macOS' : 'Unknown'})`);

// 배포 설정
const config = {
  backend: {
    host: process.env.BE_HOST || 'localhost',
    user: process.env.BE_USER || 'root',
    path: process.env.BE_PATH || '/var/www/iitp-dabt-admin/be'
  },
  frontend: {
    host: process.env.FE_HOST || 'localhost',
    user: process.env.FE_USER || 'root',
    path: process.env.FE_PATH || '/var/www/iitp-dabt-admin/fe'
  }
};

console.log('이 스크립트는 예시이며, 실제 배포 로직은 프로젝트 요구에 맞게 구현하세요.');
console.log('환경 변수 예시 설정:');
console.log('   export BE_PATH=/var/www/iitp-dabt-admin/be');
console.log('   export FE_PATH=/var/www/iitp-dabt-admin/fe');

// 개별 배포 스크립트 실행 함수
function runDeployScript(scriptName, description, envVars = {}) {
  return new Promise((resolve, reject) => {
    console.log(`🚀 ${description} 시작...`);
    
    const scriptPath = path.join(__dirname, scriptName);
    
    // 스크립트 파일 존재 확인
    if (!fs.existsSync(scriptPath)) {
      reject(new Error(`배포 스크립트 파일을 찾을 수 없습니다: ${scriptPath}`));
      return;
    }
    
    // 환경 변수 병합
    const env = { ...process.env, ...envVars };
    
    const child = spawn('node', [scriptPath], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..'),
      env: env
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} 완료`);
        resolve();
      } else {
        reject(new Error(`${description} 실패 (종료 코드: ${code})`));
      }
    });
    
    child.on('error', (error) => {
      reject(new Error(`${description} 실행 중 오류 발생: ${error.message}`));
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 IITP DABT Admin 통합 배포 시작...');
    
    // 1. Common 패키지 배포 (Backend 서버와 동일한 서버 사용)
    await runDeployScript('deploy-common.js', 'Common 패키지 배포', {
      COMMON_HOST: config.backend.host,
      COMMON_USER: config.backend.user,
      COMMON_PATH: config.backend.path,
      COMMON_PORT: config.backend.port
    });
    
    // 2. Backend 배포
    await runDeployScript('deploy-be.js', 'Backend 배포', {
      BE_HOST: config.backend.host,
      BE_USER: config.backend.user,
      BE_PATH: config.backend.path,
      BE_PORT: config.backend.port
    });
    
    // 3. Frontend 배포
    await runDeployScript('deploy-fe.js', 'Frontend 배포', {
      FE_HOST: config.frontend.host,
      FE_USER: config.frontend.user,
      FE_PATH: config.frontend.path,
      FE_PORT: config.frontend.port
    });
    
    console.log('🎉 통합 배포 완료!');
    console.log('');
    console.log('📋 배포된 서비스:');
    console.log(`   Backend: http://${config.backend.host}:30000`);
    console.log(`   Frontend: http://${config.frontend.host}`);
    console.log('');
    console.log('💡 모든 서비스가 성공적으로 배포되었습니다.');
    
  } catch (error) {
    console.error('❌ 통합 배포 실패:', error.message);
    console.log('');
    console.log('🔧 문제 해결 방법:');
    console.log('   1. 환경 변수가 올바르게 설정되었는지 확인');
    console.log('   2. 서버 연결이 가능한지 확인');
    console.log('   3. 개별 배포 스크립트로 문제 부분만 재배포');
    console.log('      npm run deploy:common  # Common 패키지만');
    console.log('      npm run deploy:be      # Backend만');
    console.log('      npm run deploy:fe      # Frontend만');
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.BE_HOST || !process.env.FE_HOST) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   BE_HOST: Backend 서버 호스트');
  console.log('   BE_USER: Backend 서버 사용자명');
  console.log('   BE_PATH: Backend 서버 경로');
  console.log('   FE_HOST: Frontend 서버 호스트');
  console.log('   FE_USER: Frontend 서버 사용자명');
  console.log('   FE_PATH: Frontend 서버 경로');
  console.log('');
  console.log('💡 예시:');
  console.log('   export BE_HOST=your-backend-server.com');
  console.log('   export BE_USER=your-username');
  console.log('   export BE_PATH=/var/www/iitp-dabt-admin/be');
  console.log('   export FE_HOST=your-frontend-server.com');
  console.log('   export FE_USER=your-username');
  console.log('   export FE_PATH=/var/www/iitp-dabt-admin/fe');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  process.exit(1);
}

main(); 