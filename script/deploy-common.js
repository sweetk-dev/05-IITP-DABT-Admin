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
  common: {
    host: process.env.COMMON_HOST || 'your-common-server.com',
    user: process.env.COMMON_USER || 'your-username',
    path: process.env.COMMON_PATH || '/var/www/iitp-dabt-common',
    port: process.env.COMMON_PORT || '22'
  }
};

// Common 패키지 빌드
function buildCommon() {
  console.log('📦 packages/common 빌드 중...');
  
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../packages/common')
  });
  
  return new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ packages/common 빌드 완료');
        resolve();
      } else {
        reject(new Error(`packages/common 빌드 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Common 패키지 배포
function deployCommon() {
  console.log('📦 packages/common 배포 중...');
  
  const commonDistPath = path.join(__dirname, '../packages/common/dist');
  const commonPackagePath = path.join(__dirname, '../packages/common/package.json');
  const commonPackageLockPath = path.join(__dirname, '../packages/common/package-lock.json');
  
  // 배포할 파일들 확인
  const filesToDeploy = [
    commonDistPath,
    commonPackagePath,
    commonPackageLockPath
  ];
  
  filesToDeploy.forEach(file => {
    if (!fs.existsSync(file)) {
      console.error(`❌ 파일이 없습니다: ${file}`);
      process.exit(1);
    }
  });
  
  // rsync 명령어 생성 (Linux/Mac)
  if (!isWindows) {
    const rsyncCmd = [
      'rsync',
      '-avz',
      '--delete',
      '-e', `ssh -p ${deployConfig.common.port}`,
      `${commonDistPath}/`,
      `${commonPackagePath}`,
      `${commonPackageLockPath}`,
      `${deployConfig.common.user}@${deployConfig.common.host}:${deployConfig.common.path}/`
    ];
    
    console.log(`📤 rsync 명령어: ${rsyncCmd.join(' ')}`);
    
    const rsyncProcess = spawn('rsync', rsyncCmd.slice(1), {
      stdio: 'inherit'
    });
    
    return new Promise((resolve, reject) => {
      rsyncProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ packages/common 배포 완료');
          resolve();
        } else {
          reject(new Error(`packages/common 배포 실패 (종료 코드: ${code})`));
        }
      });
    });
  } else {
    // Windows에서는 scp 사용 (Git Bash 필요)
    console.log('⚠️  Windows에서는 Git Bash를 사용하여 scp로 배포하세요.');
    console.log('📤 수동 배포 명령어:');
    console.log(`scp -P ${deployConfig.common.port} -r packages/common/dist/* ${deployConfig.common.user}@${deployConfig.common.host}:${deployConfig.common.path}/`);
    console.log(`scp -P ${deployConfig.common.port} packages/common/package.json ${deployConfig.common.user}@${deployConfig.common.host}:${deployConfig.common.path}/`);
    console.log(`scp -P ${deployConfig.common.port} packages/common/package-lock.json ${deployConfig.common.user}@${deployConfig.common.host}:${deployConfig.common.path}/`);
    return Promise.resolve();
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 packages/common 배포 시작...');
    
    // 1. 빌드
    await buildCommon();
    
    // 2. 배포
    await deployCommon();
    
    console.log('🎉 packages/common 배포 완료!');
    console.log('');
    console.log('📋 배포된 서비스:');
    console.log(`   Common Package: ${deployConfig.common.host}:${deployConfig.common.path}`);
    
  } catch (error) {
    console.error('❌ packages/common 배포 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.COMMON_HOST) {
    console.log('⚠️  Common 패키지 배포용 환경 변수가 설정되지 않았습니다.');
    console.log('📋 필요한 환경 변수:');
    console.log('   COMMON_HOST: Common 패키지 서버 호스트');
    console.log('   COMMON_USER: Common 패키지 서버 사용자명');
    console.log('   COMMON_PATH: Common 패키지 서버 경로');
    console.log('');
    console.log('💡 예시:');
    console.log('   export COMMON_HOST=your-common-server.com');
    console.log('   export COMMON_USER=your-username');
    console.log('   export COMMON_PATH=/var/www/iitp-dabt-common');
    console.log('');
    console.log('🔧 또는 .env 파일에 설정하세요.');
    console.log('');
    console.log('💡 통합 배포를 사용하려면: npm run deploy');
    process.exit(1);
}

main(); 