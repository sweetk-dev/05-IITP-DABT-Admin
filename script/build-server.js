#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';

console.log(`🖥️  OS 감지: ${process.platform} (${isWindows ? 'Windows' : isLinux ? 'Linux' : isMac ? 'macOS' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 빌드 스크립트는 Linux에서만 실행 가능합니다.');
  console.log('💡 로컬에서는 npm run build를 사용하세요.');
  process.exit(1);
}

// Git 설정
const gitConfig = {
  repoUrl: process.env.GIT_REPO_URL || 'https://github.com/iitp/dabt-admin.git',
  branch: process.env.GIT_BRANCH || 'main',
  sourcePath: process.env.SOURCE_PATH || '/var/www/iitp-dabt-admin',
  deployPath: process.env.DEPLOY_PATH || '/var/www/iitp-dabt-deploy'
};

// Git pull
async function gitPull() {
  console.log('📥 Git 소스 업데이트 중...');
  
  return new Promise((resolve, reject) => {
    const gitProcess = spawn('git', ['pull', 'origin', gitConfig.branch], {
      stdio: 'inherit',
      cwd: gitConfig.sourcePath
    });
    
    gitProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Git 소스 업데이트 완료');
        resolve();
      } else {
        reject(new Error(`Git pull 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// Common 패키지 빌드
async function buildCommon() {
  console.log('📦 packages/common 빌드 중...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:clean'], {
      stdio: 'inherit',
      cwd: path.join(gitConfig.sourcePath, 'packages/common')
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

// Backend 빌드
async function buildBe() {
  console.log('🔧 Backend 빌드 중...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:clean'], {
      stdio: 'inherit',
      cwd: path.join(gitConfig.sourcePath, 'be')
    });
    
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

// Frontend 빌드
async function buildFe() {
  console.log('🎨 Frontend 빌드 중...');
  
  return new Promise((resolve, reject) => {
    const buildProcess = spawn('npm', ['run', 'build:clean'], {
      stdio: 'inherit',
      cwd: path.join(gitConfig.sourcePath, 'fe')
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

// 배포 폴더로 복사
async function copyToDeployFolders() {
  console.log('📁 배포 폴더로 복사 중...');
  
  // 배포 폴더 생성
  const deployCommonPath = path.join(gitConfig.deployPath, 'common');
  const deployBePath = path.join(gitConfig.deployPath, 'backend');
  const deployFePath = path.join(gitConfig.deployPath, 'frontend');
  
  // 디렉토리 생성
  [deployCommonPath, deployBePath, deployFePath].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // 복사 명령어 실행
  const copyCommands = [
    {
      name: 'Common',
      from: path.join(gitConfig.sourcePath, 'packages/common/dist'),
      to: deployCommonPath
    },
    {
      name: 'Backend',
      from: path.join(gitConfig.sourcePath, 'be/dist'),
      to: deployBePath
    },
    {
      name: 'Frontend',
      from: path.join(gitConfig.sourcePath, 'fe/dist'),
      to: deployFePath
    }
  ];
  
  for (const cmd of copyCommands) {
    console.log(`📋 ${cmd.name} 복사 중...`);
    
    const cpProcess = spawn('cp', ['-r', `${cmd.from}/*`, cmd.to], {
      stdio: 'inherit'
    });
    
    await new Promise((resolve, reject) => {
      cpProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`✅ ${cmd.name} 복사 완료`);
          resolve();
        } else {
          reject(new Error(`${cmd.name} 복사 실패 (종료 코드: ${code})`));
        }
      });
    });
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 전체 빌드 시작...');
    
    // 1. Git pull
    await gitPull();
    
    // 2. 빌드 (의존성 순서대로)
    await buildCommon();
    await buildBe();
    await buildFe();
    
    // 3. 배포 폴더로 복사
    await copyToDeployFolders();
    
    console.log('🎉 서버용 전체 빌드 완료!');
    console.log('');
    console.log('📁 빌드 결과물:');
    console.log(`   - ${gitConfig.deployPath}/common/`);
    console.log(`   - ${gitConfig.deployPath}/backend/`);
    console.log(`   - ${gitConfig.deployPath}/frontend/`);
    console.log('');
    console.log('💡 다음 단계: npm run deploy:server');
    
  } catch (error) {
    console.error('❌ 서버용 빌드 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.SOURCE_PATH) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   SOURCE_PATH: 소스 코드 경로 (기본값: /var/www/iitp-dabt-admin)');
  console.log('   DEPLOY_PATH: 배포 폴더 경로 (기본값: /var/www/iitp-dabt-deploy)');
  console.log('   GIT_REPO_URL: Git 저장소 URL');
  console.log('   GIT_BRANCH: Git 브랜치 (기본값: main)');
  console.log('');
  console.log('💡 예시:');
  console.log('   export SOURCE_PATH=/var/www/iitp-dabt-admin');
  console.log('   export DEPLOY_PATH=/var/www/iitp-dabt-deploy');
  console.log('   export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git');
  console.log('   export GIT_BRANCH=main');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
}

main();
