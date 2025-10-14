#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isLinux = process.platform === 'linux';

console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);

// Linux에서만 실행 가능
if (!isLinux) {
  console.error('❌ 서버용 재시작 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

// 설정
const config = {
  fePath: process.env.PROD_FE_PATH || '/var/www/iitp-dabt-admin/fe'
};

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} 실패 (종료 코드: ${code})`));
    });
  });
}

// 버전 정보 출력
function showVersionInfo() {
  console.log('📋 버전 정보:');
  
  try {
    // Frontend 버전 확인
    const fePackageJson = require(path.join(config.fePath, 'package.json'));
    console.log(`   🎨 Frontend: ${fePackageJson.version}`);
    
    // 빌드 정보 확인
    const buildInfoPath = path.join(config.fePath, 'dist/build-info.json');
    if (fs.existsSync(buildInfoPath)) {
      const buildInfo = JSON.parse(fs.readFileSync(buildInfoPath, 'utf8'));
      if (buildInfo.buildDate) console.log(`   🔨 빌드 시간: ${buildInfo.buildDate}`);
    }
  } catch (error) {
    console.log('   ⚠️  버전 정보를 가져올 수 없습니다.');
  }
  
  console.log('');
}

// Frontend 서버 재시작 (Nginx reload)
async function restartFrontend() {
  console.log('🎨 Frontend 서버 재시작 중...');
  
  // 버전 정보 출력
  showVersionInfo();
  
  // Nginx 설정 테스트
  console.log('🧪 Nginx 설정 테스트 중...');
  await run('nginx', ['-t']);
  console.log('✅ Nginx 설정 테스트 통과');
  
  // Nginx reload
  console.log('🔄 Nginx 재시작 중...');
  await run('systemctl', ['reload', 'nginx']);
  console.log('✅ Nginx 재시작 완료');
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Frontend 서버 재시작...');
    console.log('');
    console.log('📌 Nginx 설정은 사전에 수동으로 구성되어 있어야 합니다.');
    console.log('   상세: README-SERVER-DEPLOYMENT.md 또는 README-ONE-SERVER-BUILD-DEPLOY.md 참조');
    console.log('');
    
    await restartFrontend();
    
    console.log('');
    console.log('🎉 Frontend 서버 재시작 완료!');
    console.log('');
    console.log('📋 서버 정보:');
    console.log(`   경로: ${config.fePath}`);
    console.log('');
    console.log('💡 유용한 명령어:');
    console.log('   systemctl status nginx              # Nginx 상태 확인');
    console.log('   nginx -t                            # Nginx 설정 테스트');
    console.log('   tail -f /var/log/nginx/error.log    # 에러 로그 확인');
    console.log('   tail -f /var/log/nginx/access.log   # 액세스 로그 확인');
    
  } catch (error) {
    console.error('❌ Frontend 서버 재시작 실패:', error.message);
    console.error('');
    console.error('💡 문제 해결:');
    console.error('   1. Nginx가 설치되어 있는지 확인: nginx -v');
    console.error('   2. Nginx 설정 파일 확인: nginx -t');
    console.error('   3. Nginx 상태 확인: systemctl status nginx');
    process.exit(1);
  }
}

main();
