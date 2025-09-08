#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// ------------------------------------------------------------
// .env 로딩 (배포 편의)
// - 기본 위치: /var/www/iitp-dabt-admin/.env
// - 보조 위치: 프로젝트 루트(.env), script/.env 등
// - 이미 설정된 환경변수는 덮어쓰지 않음
// ------------------------------------------------------------
function loadEnvFromFile(filePath) {
  try {
    if (!filePath) return false;
    if (!fs.existsSync(filePath)) return false;

    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;

      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();

      // 따옴표 제거
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\''))) {
        value = value.slice(1, -1);
      }

      // 이미 존재하는 환경변수는 보존
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }

    console.log(`🔧 환경 변수 로드: ${filePath}`);
    return true;
  } catch (error) {
    console.log(`⚠️  .env 로드 실패: ${filePath} (${error.message})`);
    return false;
  }
}

// 우선순위대로 시도 (첫 성공/부분 성공 모두 허용)
const candidateEnvPaths = [
  process.env.SERVER_ENV_FILE, // 수동 지정시 최우선
  path.resolve('/var/www/iitp-dabt-admin/.env'),
  path.resolve(__dirname, '../.env'), // repo 루트에 .env 가 있을 경우
  path.resolve(__dirname, '.env'),
  path.resolve(process.cwd(), '.env')
].filter(Boolean);

for (const p of candidateEnvPaths) {
  // 존재하는 모든 파일을 순서대로 읽되, 기존 env 는 보존
  loadEnvFromFile(p);
}

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 시작 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 설정
const config = {
  bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-admin/be',
  pm2AppName: process.env.PM2_APP_NAME_BE || 'iitp-dabt-adm-be'
};

// 버전 정보 출력
function showVersionInfo() {
  console.log('📋 버전 정보:');
  
  try {
    // Backend 버전 확인
    const bePackageJson = require(path.join(config.bePath, 'package.json'));
    console.log(`   🏗️  Backend: ${bePackageJson.version}`);
    
    // Common 패키지 버전 확인
    const commonPackageJson = require(path.join(config.bePath, 'node_modules/@iitp-dabt/common/package.json'));
    console.log(`   📦 Common: ${commonPackageJson.version}`);
    
    // 빌드 정보 확인
    const buildInfoPath = path.join(config.bePath, 'dist/build-info.json');
    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
      if (buildInfo.buildDate) console.log(`   🔨 빌드 시간: ${buildInfo.buildDate}`);
    }
  } catch (error) {
    console.log('   ⚠️  버전 정보를 가져올 수 없습니다.');
  }
  
  console.log('');
}

// Backend 서버 시작
async function startBackend() {
  console.log('🔧 Backend 서버 시작 중...');
  
  // 버전 정보 출력
  showVersionInfo();
  
  // 의존성 설치
  console.log('📦 의존성 설치 중...');
  const installProcess = spawn('npm', ['install', '--omit=dev'], {
    stdio: 'inherit',
    cwd: config.bePath
  });
  
  await new Promise((resolve, reject) => {
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ 의존성 설치 완료');
        resolve();
      } else {
        reject(new Error(`의존성 설치 실패 (종료 코드: ${code})`));
      }
    });
  });
  
  // PM2로 서버 시작
  console.log('🚀 PM2로 Backend 서버 시작 중...');
  const startProcess = spawn('pm2', ['start', 'dist/index.js', '--name', config.pm2AppName], {
    stdio: 'inherit',
    cwd: config.bePath
  });
  
  return new Promise((resolve, reject) => {
    startProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Backend 서버 시작 완료');
        resolve();
      } else {
        reject(new Error(`Backend 서버 시작 실패 (종료 코드: ${code})`));
      }
    });
  });
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Backend 서버 시작...');
    
    // 1. 서버 시작
    await startBackend();
    
    console.log('🎉 Backend 서버 시작 완료!');
    console.log('');
    console.log('📋 서버 정보:');
    console.log(`   경로: ${config.bePath}`);
    console.log(`   PM2 앱명: ${config.pm2AppName}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   pm2 status                    # 서버 상태 확인');
    console.log(`   pm2 logs ${config.pm2AppName}    # 로그 확인`);
    console.log(`   pm2 restart ${config.pm2AppName} # 서버 재시작`);
    console.log(`   pm2 stop ${config.pm2AppName}    # 서버 중지`);
    
  } catch (error) {
    console.error('❌ Backend 서버 시작 실패:', error.message);
    process.exit(1);
  }
}

// 환경 변수 확인
if (!process.env.PROD_BE_PATH) {
  console.log('⚠️  환경 변수가 설정되지 않았습니다.');
  console.log('📋 필요한 환경 변수:');
  console.log('   PROD_BE_PATH: Backend 서버 경로 (기본값: /var/www/iitp-dabt-admin/be)');
  console.log('   PM2_APP_NAME_BE: PM2 앱 이름 (기본값: iitp-dabt-adm-be)');
  console.log('');
  console.log('💡 예시:');
  console.log('   export PROD_BE_PATH=/var/www/iitp-dabt-admin/be');
  console.log('   export PM2_APP_NAME_BE=iitp-dabt-adm-be');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
}

main();
