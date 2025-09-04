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
const deployConfig = {
  frontend: {
    host: process.env.FE_HOST || 'your-frontend-server.com',
    user: process.env.FE_USER || 'your-username',
    path: process.env.FE_PATH || '/var/www/iitp-dabt-admin/fe',
    port: process.env.FE_PORT || '22'
  }
};

// Frontend 빌드
function buildFrontend() {
  console.log('🎨 Frontend 빌드 중...');
  
  // packages/common 의존성 확인 및 빌드
  const commonDistPath = path.join(__dirname, '../packages/common/dist');
  if (!fs.existsSync(commonDistPath)) {
    console.log('⚠️  packages/common이 빌드되지 않았습니다. 빌드 중...');
    const commonBuildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '../packages/common')
    });
    
    return new Promise((resolve, reject) => {
      commonBuildProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ packages/common 빌드 완료');
          // Frontend 빌드 계속
          buildFrontendMain().then(resolve).catch(reject);
        } else {
          reject(new Error(`packages/common 빌드 실패 (종료 코드: ${code})`));
        }
      });
    });
  } else {
    return buildFrontendMain();
  }
}

function buildFrontendMain() {
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../fe')
  });
  
  return new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Frontend 빌드 완료');
        resolve();
      } else {
        reject(new Error(`Frontend 빌드 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Frontend 배포
function deployFrontend() {
  console.log('🎨 Frontend 배포 중...');
  
  const feDistPath = path.join(__dirname, '../fe/dist');
  
  if (!fs.existsSync(feDistPath)) {
    console.error(`❌ Frontend 빌드 결과물이 없습니다: ${feDistPath}`);
    process.exit(1);
  }
  
  // rsync 명령어 생성 (Linux/Mac)
  if (!isWindows) {
    const rsyncCmd = [
      'rsync',
      '-avz',
      '--delete',
      '-e', `ssh -p ${deployConfig.frontend.port}`,
      `${feDistPath}/`,
      `${deployConfig.frontend.user}@${deployConfig.frontend.host}:${deployConfig.frontend.path}/`
    ];
    
    console.log(`📤 rsync 명령어: ${rsyncCmd.join(' ')}`);
    
    const rsyncProcess = spawn('rsync', rsyncCmd.slice(1), {
      stdio: 'inherit'
    });
    
    return new Promise((resolve, reject) => {
      rsyncProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Frontend 배포 완료');
          resolve();
        } else {
          reject(new Error(`Frontend 배포 실패 (종료 코드: ${code})`));
        }
      });
    });
  } else {
    // Windows에서는 scp 사용 (Git Bash 필요)
    console.log('⚠️  Windows에서는 Git Bash를 사용하여 scp로 배포하세요.');
    console.log('📤 수동 배포 명령어:');
    console.log(`scp -P ${deployConfig.frontend.port} -r fe/dist/* ${deployConfig.frontend.user}@${deployConfig.frontend.host}:${deployConfig.frontend.path}/`);
    return Promise.resolve();
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Frontend 배포 시작...');
    
    // 1. 빌드
    await buildFrontend();
    
    // 2. 배포
    await deployFrontend();
    
    console.log('🎉 Frontend 배포 완료!');
    console.log('');
    console.log('📋 배포된 서비스:');
    console.log(`   Frontend: http://${deployConfig.frontend.host}`);
    console.log('');
    console.log('💡 Nginx/Apache 설정이 필요할 수 있습니다.');
    
  } catch (error) {
    console.error('❌ Frontend 배포 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.FE_HOST) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   FE_HOST: Frontend 서버 호스트');
  console.log('   FE_USER: Frontend 서버 사용자명');
  console.log('   FE_PATH: Frontend 서버 경로');
  console.log('');
  console.log('💡 예시:');
  console.log('   export FE_HOST=your-frontend-server.com');
  console.log('   export FE_USER=your-username');
  console.log('   export FE_PATH=/var/www/iitp-dabt-admin/fe');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  process.exit(1);
}

main(); 