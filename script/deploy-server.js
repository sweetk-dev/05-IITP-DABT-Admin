#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 배포 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 배포 설정
const deployConfig = {
  // 빌드 서버 설정
  buildServer: {
    host: process.env.BUILD_SERVER_HOST || 'localhost',
    user: process.env.BUILD_SERVER_USER || 'root',
    path: process.env.BUILD_SERVER_PATH || '/home/iitp-adm/iitp-dabt-admin/deploy',
    port: process.env.BUILD_SERVER_PORT || '22'
  },
  // 기동 서버 설정
  productionServer: {
    host: process.env.PROD_SERVER_HOST || 'localhost',
    user: process.env.PROD_SERVER_USER || 'root',
    bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-adm-be',
    fePath: process.env.PROD_FE_PATH || '/var/www/iitp-dabt-adm-fe',
    port: process.env.PROD_SERVER_PORT || '22'
  }
};

// Backend 배포
async function deployBackend() {
  console.log('🔧 Backend 배포 중...');
  
  const rsyncCmd = [
    'rsync',
    '-avz',
    '--delete',
    '-e', `ssh -p ${deployConfig.buildServer.port}`,
    `${deployConfig.buildServer.user}@${deployConfig.buildServer.host}:${deployConfig.buildServer.path}/backend/`,
    `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}:${deployConfig.productionServer.bePath}/`
  ];
  
  console.log(`📤 Backend rsync: ${rsyncCmd.join(' ')}`);
  
  return new Promise((resolve, reject) => {
    const rsyncProcess = spawn('rsync', rsyncCmd.slice(1), {
      stdio: 'inherit'
    });
    
    rsyncProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend 배포 완료');
        resolve();
      } else {
        reject(new Error(`Backend 배포 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Frontend 배포
async function deployFrontend() {
  console.log('🎨 Frontend 배포 중...');
  
  const rsyncCmd = [
    'rsync',
    '-avz',
    '--delete',
    '-e', `ssh -p ${deployConfig.buildServer.port}`,
    `${deployConfig.buildServer.user}@${deployConfig.buildServer.host}:${deployConfig.buildServer.path}/frontend/`,
    `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}:${deployConfig.productionServer.fePath}/`
  ];
  
  console.log(`📤 Frontend rsync: ${rsyncCmd.join(' ')}`);
  
  return new Promise((resolve, reject) => {
    const rsyncProcess = spawn('rsync', rsyncCmd.slice(1), {
      stdio: 'inherit'
    });
    
    rsyncProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Frontend 배포 완료');
        resolve();
      } else {
        reject(new Error(`Frontend 배포 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Common 배포
async function deployCommon() {
  console.log('📦 Common 배포 중...');
  
  const rsyncCmd = [
    'rsync',
    '-avz',
    '--delete',
    '-e', `ssh -p ${deployConfig.buildServer.port}`,
    `${deployConfig.buildServer.user}@${deployConfig.buildServer.host}:${deployConfig.buildServer.path}/common/`,
    `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}:${deployConfig.productionServer.bePath}/node_modules/@iitp-dabt/common/`
  ];
  
  console.log(`📤 Common rsync: ${rsyncCmd.join(' ')}`);
  
  return new Promise((resolve, reject) => {
    const rsyncProcess = spawn('rsync', rsyncCmd.slice(1), {
      stdio: 'inherit'
    });
    
    rsyncProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Common 배포 완료');
        resolve();
      } else {
        reject(new Error(`Common 배포 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 전체 배포 시작...');
    
    // 1. Common 배포
    await deployCommon();
    
    // 2. Backend 배포
    await deployBackend();
    
    // 3. Frontend 배포
    await deployFrontend();
    
    console.log('🎉 서버용 전체 배포 완료!');
    console.log('');
    console.log('📋 배포된 서비스:');
    console.log(`   Backend: ${deployConfig.productionServer.host}:${deployConfig.productionServer.bePath}`);
    console.log(`   Frontend: ${deployConfig.productionServer.host}:${deployConfig.productionServer.fePath}`);
    console.log('');
    console.log('💡 다음 단계: npm run start:server');
    
  } catch (error) {
    console.error('❌ 서버용 배포 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.BUILD_SERVER_HOST || !process.env.PROD_SERVER_HOST) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   BUILD_SERVER_HOST: 빌드 서버 호스트');
  console.log('   BUILD_SERVER_USER: 빌드 서버 사용자명');
  console.log('   BUILD_SERVER_PATH: 빌드 서버 배포 경로');
  console.log('   PROD_SERVER_HOST: 기동 서버 호스트');
  console.log('   PROD_SERVER_USER: 기동 서버 사용자명');
  console.log('   PROD_BE_PATH: 기동 서버 BE 경로');
  console.log('   PROD_FE_PATH: 기동 서버 FE 경로');
  console.log('');
  console.log('💡 예시:');
  console.log('   export BUILD_SERVER_HOST=build-server.com');
  console.log('   export BUILD_SERVER_USER=builduser');
  console.log('   export BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy');
  console.log('   export PROD_SERVER_HOST=prod-server.com');
  console.log('   export PROD_SERVER_USER=produser');
  console.log('   export PROD_BE_PATH=/var/www/iitp-dabt-adm-be');
  console.log('   export PROD_FE_PATH=/var/www/iitp-dabt-adm-fe');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  process.exit(1);
}

main();
