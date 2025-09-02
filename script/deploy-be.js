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
  backend: {
    host: process.env.BE_HOST || 'your-backend-server.com',
    user: process.env.BE_USER || 'your-username',
    path: process.env.BE_PATH || '/var/www/iitp-dabt-adm-be',
    port: process.env.BE_PORT || '22'
  }
};

// Backend 빌드
function buildBackend() {
  console.log('🔧 Backend 빌드 중...');
  
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
          // Backend 빌드 계속
          buildBackendMain().then(resolve).catch(reject);
        } else {
          reject(new Error(`packages/common 빌드 실패 (종료 코드: ${code})`));
        }
      });
    });
  } else {
    return buildBackendMain();
  }
}

function buildBackendMain() {
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    cwd: path.join(__dirname, '../be')
  });
  
  return new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend 빌드 완료');
        resolve();
      } else {
        reject(new Error(`Backend 빌드 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Backend 배포
function deployBackend() {
  console.log('🔧 Backend 배포 중...');
  
  const beDistPath = path.join(__dirname, '../be/dist');
  const bePackagePath = path.join(__dirname, '../be/package.json');
  const bePackageLockPath = path.join(__dirname, '../be/package-lock.json');
  const beBuildInfoPath = path.join(__dirname, '../be/build-info.json');
  
  // 배포할 파일들 확인
  const filesToDeploy = [
    beDistPath,
    bePackagePath,
    bePackageLockPath,
    beBuildInfoPath
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
      '-e', `ssh -p ${deployConfig.backend.port}`,
      `${beDistPath}/`,
      `${bePackagePath}`,
      `${bePackageLockPath}`,
      `${beBuildInfoPath}`,
      `${deployConfig.backend.user}@${deployConfig.backend.host}:${deployConfig.backend.path}/`
    ];
    
    console.log(`📤 rsync 명령어: ${rsyncCmd.join(' ')}`);
    
    const rsyncProcess = spawn('rsync', rsyncCmd.slice(1), {
      stdio: 'inherit'
    });
    
    return new Promise((resolve, reject) => {
      rsyncProcess.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Backend 배포 완료');
          resolve();
        } else {
          reject(new Error(`Backend 배포 실패 (종료 코드: ${code})`));
        }
      });
    });
  } else {
    // Windows에서는 scp 사용 (Git Bash 필요)
    console.log('⚠️  Windows에서는 Git Bash를 사용하여 scp로 배포하세요.');
    console.log('📤 수동 배포 명령어:');
    console.log(`scp -P ${deployConfig.backend.port} -r be/dist/* ${deployConfig.backend.user}@${deployConfig.backend.host}:${deployConfig.backend.path}/`);
    console.log(`scp -P ${deployConfig.backend.port} be/package.json ${deployConfig.backend.user}@${deployConfig.backend.host}:${deployConfig.backend.path}/`);
    console.log(`scp -P ${deployConfig.backend.port} be/package-lock.json ${deployConfig.backend.user}@${deployConfig.backend.host}:${deployConfig.backend.path}/`);
    console.log(`scp -P ${deployConfig.backend.port} be/build-info.json ${deployConfig.backend.user}@${deployConfig.backend.host}:${deployConfig.backend.path}/`);
    return Promise.resolve();
  }
}

// 서버 재시작
function restartServer() {
  console.log('🔄 Backend 서버 재시작 중...');
  
  if (!isWindows) {
    // Backend 서버 재시작
    const restartBackend = spawn('ssh', [
      '-p', deployConfig.backend.port,
      `${deployConfig.backend.user}@${deployConfig.backend.host}`,
      'cd', deployConfig.backend.path, '&&', 'npm', 'install', '&&', 'pm2', 'restart', 'iitp-dabt-adm-be'
    ], { stdio: 'inherit' });
    
    return new Promise((resolve, reject) => {
      restartBackend.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Backend 서버 재시작 완료');
          resolve();
        } else {
          reject(new Error(`Backend 서버 재시작 실패 (종료 코드: ${code})`));
        }
      });
    });
  } else {
    console.log('⚠️  Windows에서는 수동으로 서버를 재시작하세요.');
    console.log('📤 서버 재시작 명령어:');
    console.log(`ssh -p ${deployConfig.backend.port} ${deployConfig.backend.user}@${deployConfig.backend.host} 'cd ${deployConfig.backend.path} && npm install && pm2 restart iitp-dabt-adm-be'`);
    return Promise.resolve();
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Backend 배포 시작...');
    
    // 1. 빌드
    await buildBackend();
    
    // 2. 배포
    await deployBackend();
    
    // 3. 서버 재시작
    await restartServer();
    
    console.log('🎉 Backend 배포 완료!');
    console.log('');
    console.log('📋 배포된 서비스:');
    console.log(`   Backend: http://${deployConfig.backend.host}:30000`);
    
  } catch (error) {
    console.error('❌ Backend 배포 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.BE_HOST) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   BE_HOST: Backend 서버 호스트');
  console.log('   BE_USER: Backend 서버 사용자명');
  console.log('   BE_PATH: Backend 서버 경로');
  console.log('');
  console.log('💡 예시:');
  console.log('   export BE_HOST=your-backend-server.com');
  console.log('   export BE_USER=your-username');
  console.log('   export BE_PATH=/var/www/iitp-dabt-adm-be');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  process.exit(1);
}

main(); 