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
  // 기동 서버 설정
  productionServer: {
    host: process.env.PROD_SERVER_HOST || 'localhost',
    user: process.env.PROD_SERVER_USER || 'root',
    bePath: process.env.PROD_BE_PATH || '/var/www/iitp-dabt-admin/be',
    fePath: process.env.PROD_FE_PATH || '/var/www/iitp-dabt-admin/fe',
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

async function showRemoteVersionSummary() {
  if (sameHost) {
    try {
      console.log('🔎 로컬 배포 버전/빌드 요약:');
      // Backend
      const bePkg = JSON.parse(fs.readFileSync(path.join(deployConfig.productionServer.bePath, 'package.json'), 'utf8'));
      console.log(`📋 BE 버전/빌드:`);
      console.log(JSON.stringify({ version: bePkg.version }));
      const beInfo = path.join(deployConfig.productionServer.bePath, 'dist', 'build-info.json');
      if (fs.existsSync(beInfo)) {
        const info = JSON.parse(fs.readFileSync(beInfo, 'utf8'));
        if (info.buildDate) console.log(`buildDate: ${info.buildDate}`);
      }
      // Frontend
      const fePkg = JSON.parse(fs.readFileSync(path.join(deployConfig.productionServer.fePath, 'package.json'), 'utf8'));
      console.log(`📋 FE 버전/빌드:`);
      console.log(JSON.stringify({ version: fePkg.version }));
      const feInfo = path.join(deployConfig.productionServer.fePath, 'dist', 'build-info.json');
      if (fs.existsSync(feInfo)) {
        const info = JSON.parse(fs.readFileSync(feInfo, 'utf8'));
        if (info.buildDate) console.log(`buildDate: ${info.buildDate}`);
      }
    } catch (_) {
      console.log('⚠️  로컬 버전/빌드 정보를 읽을 수 없습니다.');
    }
    return;
  }

  const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
  const beCmd = `echo '📋 BE 버전/빌드:'; cd ${deployConfig.productionServer.bePath}; cat package.json | grep \"\\\"version\\\"\" || true; if [ -f dist/build-info.json ]; then cat dist/build-info.json | grep buildDate || true; fi`;
  const feCmd = `echo '📋 FE 버전/빌드:'; cd ${deployConfig.productionServer.fePath}; cat package.json | grep \"\\\"version\\\"\" || true; if [ -f dist/build-info.json ]; then cat dist/build-info.json | grep buildDate || true; fi`;
  console.log('🔎 원격 서버 배포 버전/빌드 요약:');
  await run('ssh', [...sshBase, beCmd]);
  await run('ssh', [...sshBase, feCmd]);
}

async function rsyncLocal(src, dest) {
  const args = [
    '-avz',
    '--delete',
    '--exclude', 'node_modules/',
    '--exclude', '.env',
    '--exclude', '.env*',
    '--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r',
    `${src}`,
    `${dest}`
  ];
  console.log(`📤 rsync (local): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

async function rsyncRemote(srcUserHost, srcPath, destUserHost, destPath, port) {
  // 퍼미션 기본값: 디렉터리 755, 파일 644
  const baseArgs = [
    '-avz',
    '--delete',
    '--exclude', 'node_modules/',
    '--exclude', '.env',
    '--exclude', '.env*',
    '--chmod=Du=rwx,Dgo=rx,Fu=rw,Fgo=r'
  ];
  // 필요 시 소유자 지정(옵션)
  if (process.env.RSYNC_CHOWN) baseArgs.push(`--chown=${process.env.RSYNC_CHOWN}`);
  const args = [...baseArgs, '-e', `ssh -p ${port}`, `${srcUserHost}:${srcPath}`, `${destUserHost}:${destPath}`];
  console.log(`📤 rsync (ssh): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

// Backend 배포
async function deployBackend() {
  console.log('🔧 Backend 배포 중...');
  const src = path.posix.join(deployConfig.buildServer.path, 'backend/')
  const dest = deployConfig.productionServer.bePath + '/';
  if (sameHost) {
    await rsyncLocal(src, dest);
  } else {
    await rsyncRemote(`${deployConfig.buildServer.user}@${deployConfig.buildServer.host}`, src, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`, dest, deployConfig.buildServer.port);
  }
  console.log('✅ Backend 배포 완료');
  await fixPermissionsBackend();
}

// Frontend 배포
async function deployFrontend() {
  console.log('🎨 Frontend 배포 중...');
  const src = path.posix.join(deployConfig.buildServer.path, 'frontend/')
  const dest = deployConfig.productionServer.fePath + '/';
  if (sameHost) {
    await rsyncLocal(src, dest);
  } else {
    await rsyncRemote(`${deployConfig.buildServer.user}@${deployConfig.buildServer.host}`, src, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`, dest, deployConfig.buildServer.port);
  }
  console.log('✅ Frontend 배포 완료');
  await fixPermissionsFrontend();
}

// Common 배포 (BE의 node_modules 내 common으로 동기화)
async function deployCommon() {
  console.log('📦 Common 배포 중...');
  const src = path.posix.join(deployConfig.buildServer.path, 'common/')
  const destNodeModules = path.posix.join(deployConfig.productionServer.bePath, 'node_modules/@iitp-dabt/common/');
  const destWorkspaceCommon = path.posix.join(deployConfig.productionServer.bePath, '..', 'packages/common/');
  console.log(`   ▶︎ 배포 모드: ${sameHost ? 'local' : 'ssh'}`);
  console.log(`   ▶︎ dest(node_modules): ${destNodeModules}`);
  console.log(`   ▶︎ dest(workspace common): ${destWorkspaceCommon}`);
  if (sameHost) {
    // 대상 경로 보장 (bePath, node_modules, scope 포함)
    const bePath = deployConfig.productionServer.bePath;
    const baseDirs = [
      bePath,
      path.posix.join(bePath, 'node_modules'),
      path.posix.join(bePath, 'node_modules/@iitp-dabt'),
      destWorkspaceCommon
    ];
    for (const d of baseDirs) {
      try { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); } catch (e) {
        console.error(`   ❌ 디렉터리 생성 실패: ${d} (${e.code || e.message})`);
        throw e;
      }
    }
    // node_modules/@iitp-dabt/common 은 npm이 만든 symlink일 수 있으므로 mkdir/rsync 생략
    await rsyncLocal(src, destWorkspaceCommon);
  } else {
    // 원격 경로 보장 후 rsync
    const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
    const bePath = deployConfig.productionServer.bePath;
    const mkdirCmd = `mkdir -p ${bePath} ${bePath}/node_modules ${bePath}/node_modules/@iitp-dabt ${destWorkspaceCommon}`;
    await run('ssh', [...sshBase, mkdirCmd]);
    // node_modules/@iitp-dabt/common 은 npm이 만든 symlink일 수 있으므로 rsync는 워크스페이스 경로에만 수행
    await rsyncRemote(`${deployConfig.buildServer.user}@${deployConfig.buildServer.host}`, src, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`, destWorkspaceCommon, deployConfig.buildServer.port);
  }
  console.log('✅ Common 배포 완료');
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
    
    // 4. 버전/빌드 요약 출력
    await showRemoteVersionSummary();
    
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

// 권한 정리: Frontend (실행 서버에서 수행)
async function fixPermissionsFrontend() {
  const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
  const fePath = deployConfig.productionServer.fePath;
  const cmd = `find ${fePath} -type d -exec chmod 755 {} \\; && find ${fePath} -type f -exec chmod 644 {} \\;`;
  if (sameHost) {
    await run('bash', ['-lc', cmd]);
  } else {
    await run('ssh', [...sshBase, cmd]);
  }
  console.log('🔐 Frontend 퍼미션 정리 완료 (755/644)');
}

// 권한 정리: Backend (logs 등 쓰기 경로 포함)
async function fixPermissionsBackend() {
  const sshBase = ['-p', `${deployConfig.productionServer.port}`, `${deployConfig.productionServer.user}@${deployConfig.productionServer.host}`];
  const bePath = deployConfig.productionServer.bePath;
  const ensureLogs = `mkdir -p ${bePath}/logs`;
  const chmodAll = `find ${bePath} -type d -exec chmod 755 {} \\; && find ${bePath} -type f -exec chmod 644 {} \\;`;
  const relaxLogs = `chmod 755 ${bePath}/logs || true`;
  const cmd = `${ensureLogs} && ${chmodAll} && ${relaxLogs}`;
  if (sameHost) {
    await run('bash', ['-lc', cmd]);
  } else {
    await run('ssh', [...sshBase, cmd]);
  }
  console.log('🔐 Backend 퍼미션 정리 완료 (755/644, logs 디렉터리 보장)');
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
  console.log('   export PROD_BE_PATH=/var/www/iitp-dabt-admin/be');
  console.log('   export PROD_FE_PATH=/var/www/iitp-dabt-admin/fe');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
  process.exit(1);
}

main();
