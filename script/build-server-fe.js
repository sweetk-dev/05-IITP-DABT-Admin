#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 빌드 스크립트는 Linux에서만 실행 가능합니다.');
  console.log('💡 로컬에서는 npm run build:fe를 사용하세요.');
  process.exit(1);
}

// 설정
const config = {
  sourcePath: process.env.SOURCE_PATH || '/var/www/iitp-dabt-admin',
  deployPath: process.env.DEPLOY_PATH || '/var/www/iitp-dabt-deploy'
};

// Common 패키지 빌드 (의존성)
async function buildCommon() {
  console.log('📦 packages/common 빌드 중... (의존성)');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:clean'], {
      stdio: 'inherit',
      cwd: path.join(config.sourcePath, 'packages/common')
    });
    
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

// Frontend 빌드
async function buildFe() {
  console.log('🎨 Frontend 빌드 중...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:clean'], {
      stdio: 'inherit',
      cwd: path.join(config.sourcePath, 'fe')
    });
    
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

// Frontend 배포 폴더로 복사
async function copyFeToDeploy() {
  console.log('📁 Frontend 배포 폴더로 복사 중...');
  
  const deployFePath = path.join(config.deployPath, 'frontend');
  
  // 디렉토리 생성
  if (!fs.existsSync(deployFePath)) {
    fs.mkdirSync(deployFePath, { recursive: true });
  }
  
  // 복사
  const cpProcess = spawn('cp', ['-r', `${path.join(config.sourcePath, 'fe/dist')}/*`, deployFePath], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    cpProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Frontend 복사 완료');
        resolve();
      } else {
        reject(new Error(`Frontend 복사 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 Frontend 빌드 시작...');
    
    // 1. Common 빌드 (의존성)
    await buildCommon();
    
    // 2. Frontend 빌드
    await buildFe();
    
    // 3. 배포 폴더로 복사
    await copyFeToDeploy();
    
    console.log('🎉 서버용 Frontend 빌드 완료!');
    console.log('');
    console.log('📁 빌드 결과물:');
    console.log(`   - ${config.deployPath}/frontend/`);
    console.log('');
    console.log('💡 다음 단계: npm run deploy:server:fe');
    
  } catch (error) {
    console.error('❌ 서버용 Frontend 빌드 실패:', error.message);
    process.exit(1);
  }
}

main();
