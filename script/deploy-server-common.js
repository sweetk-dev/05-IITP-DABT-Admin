#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// .env 파일 로드 함수
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) {
    console.log(`⚠️  .env 파일이 없습니다: ${envPath}`);
    return {};
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    line = line.trim();
    if (line && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
  
  console.log(`✅ .env 파일 로드됨: ${envPath}`);
  return envVars;
}

// .env 파일 로드
const envPath = path.join(__dirname, '.env');
const envVars = loadEnvFile(envPath);

// 환경 변수 적용
Object.keys(envVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envVars[key];
  }
});

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
  // 실행 서버 설정
  productionServer: {
    host: process.env.PROD_SERVER_HOST || 'localhost',
    user: process.env.PROD_SERVER_USER || 'root',
    bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-admin/be',
    port: process.env.PROD_SERVER_PORT || '22'
  }
};

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`));
    });
  });
}

function hostsEqual(a, b) {
  const norm = (h) => (h || '').toLowerCase();
  const na = norm(a), nb = norm(b);
  if (na === nb) return true;
  const aliases = new Set(['localhost', '127.0.0.1', '::1']);
  return aliases.has(na) && aliases.has(nb);
}

const sameHost = hostsEqual(deployConfig.buildServer.host, deployConfig.productionServer.host) &&
                 deployConfig.buildServer.user === deployConfig.productionServer.user;

async function rsyncLocal(src, dest) {
  const args = ['-avz', '--delete', '--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r', `${src}`, `${dest}`];
  console.log(`📤 rsync (local): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

async function rsyncRemote(srcUserHost, srcPath, destUserHost, destPath, port) {
  // 퍼미션 기본값: 디렉터리 755, 파일 644
  const baseArgs = ['-avz', '--delete', '--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r'];
  // 필요 시 소유자 지정(옵션)
  if (process.env.RSYNC_CHOWN) baseArgs.push(`--chown=${process.env.RSYNC_CHOWN}`);
  const args = [...baseArgs, '-e', `ssh -p ${port}`, `${srcUserHost}:${srcPath}`, `${destUserHost}:${destPath}`];
  console.log(`📤 rsync (ssh): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

// Common 배포 (BE의 packages/common으로 동기화)
async function deployCommon() {
  console.log('📦 Common 패키지 배포 중...');
  const src = path.posix.join(deployConfig.buildServer.path, 'common/');
  const dest = path.posix.join('/var/www/iitp-dabt-admin', 'packages/common/');
  
  if (sameHost) {
    // 로컬 배포
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    await rsyncLocal(src, dest);
  } else {
    // 원격 배포
    await rsyncRemote(
      `${deployConfig.buildServer.user}@${deployConfig.buildServer.host}`,
      src,
      `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`,
      dest,
      deployConfig.buildServer.port
    );
  }
  console.log('✅ Common 패키지 배포 완료');
  await fixPermissionsCommon();
}

// 권한 정리: Common
async function fixPermissionsCommon() {
  const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
  const commonPath = '/var/www/iitp-dabt-admin/packages/common';
  const cmd = `find ${commonPath} -type d -exec chmod 755 {} \\; && find ${commonPath} -type f -exec chmod 644 {} \\;`;
  
  if (sameHost) {
    await run('bash', ['-c', cmd]);
  } else {
    await run('ssh', [...sshBase, cmd]);
  }
  console.log('🔐 Common 퍼미션 정리 완료 (755/644)');
}

// 버전 정보 출력
async function showVersionInfo() {
  const commonPath = '/var/www/iitp-dabt-admin/packages/common';
  
  if (sameHost) {
    try {
      const pkgPath = path.join(commonPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        console.log('📋 배포된 Common 버전:');
        console.log(`   📦 Common: ${pkg.version}`);
      }
    } catch (_) {
      console.log('⚠️  버전 정보를 읽을 수 없습니다.');
    }
  } else {
    const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
    const cmd = `cat ${commonPath}/package.json | grep '"version"' || echo '⚠️  버전 정보를 읽을 수 없습니다.'`;
    console.log('📋 배포된 Common 버전:');
    await run('ssh', [...sshBase, cmd]);
  }
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 Common 패키지 배포 시작...');
    console.log('');
    
    await deployCommon();
    await showVersionInfo();
    
    console.log('');
    console.log('🎉 Common 패키지 배포 완료!');
    console.log('');
    console.log('📋 배포 정보:');
    console.log(`   대상: /var/www/iitp-dabt-admin/packages/common/`);
    console.log('');
    console.log('⚠️  다음 단계:');
    console.log('   Backend 재시작 필요: npm run restart:server:be');
    console.log('   Frontend는 재시작 불필요 (정적 파일, 빌드에 이미 포함됨)');
    console.log('');
    console.log('💡 BE/FE도 함께 업데이트하려면:');
    console.log('   npm run deploy:server  # 전체 배포');
    
  } catch (error) {
    console.error('❌ Common 패키지 배포 실패:', error.message);
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
  console.log('   PROD_SERVER_HOST: 실행 서버 호스트');
  console.log('   PROD_SERVER_USER: 실행 서버 사용자명');
  console.log('   PROD_BE_PATH: 실행 서버 BE 경로');
  console.log('');
  console.log('💡 예시:');
  console.log('   export BUILD_SERVER_HOST=build-server.com');
  console.log('   export BUILD_SERVER_USER=builduser');
  console.log('   export BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy');
  console.log('   export PROD_SERVER_HOST=prod-server.com');
  console.log('   export PROD_SERVER_USER=produser');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  process.exit(1);
}

main();

