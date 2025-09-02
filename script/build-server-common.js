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
  console.log('💡 로컬에서는 npm run build:common을 사용하세요.');
  process.exit(1);
}

// 설정
const config = {
  sourcePath: process.env.SOURCE_PATH || '/var/www/iitp-dabt-admin',
  deployPath: process.env.DEPLOY_PATH || '/var/www/iitp-dabt-deploy'
};

// Common 패키지 빌드
async function buildCommon() {
  console.log('📦 packages/common 빌드 중...');
  
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

// Common 배포 폴더로 복사
async function copyCommonToDeploy() {
  console.log('📁 Common 배포 폴더로 복사 중...');
  
  const deployCommonPath = path.join(config.deployPath, 'common');
  
  // 디렉토리 생성
  if (!fs.existsSync(deployCommonPath)) {
    fs.mkdirSync(deployCommonPath, { recursive: true });
  }
  
  // 복사
  const cpProcess = spawn('cp', ['-r', `${path.join(config.sourcePath, 'packages/common/dist')}/*`, deployCommonPath], {
    stdio: 'inherit'
  });
  
  return new Promise((resolve, reject) => {
    cpProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Common 복사 완료');
        resolve();
      } else {
        reject(new Error(`Common 복사 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 Common 빌드 시작...');
    
    // 1. Common 빌드
    await buildCommon();
    
    // 2. 배포 폴더로 복사
    await copyCommonToDeploy();
    
    console.log('🎉 서버용 Common 빌드 완료!');
    console.log('');
    console.log('📁 빌드 결과물:');
    console.log(`   - ${config.deployPath}/common/`);
    console.log('');
    console.log('💡 다음 단계: npm run deploy:server:common');
    
  } catch (error) {
    console.error('❌ 서버용 Common 빌드 실패:', error.message);
    process.exit(1);
  }
}

main();
