#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', ...opts });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`));
    });
  });
}

// .env 로드
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
      if (key && valueParts.length > 0) envVars[key.trim()] = valueParts.join('=').trim();
    }
  });
  console.log(`✅ .env 파일 로드됨: ${envPath}`);
  return envVars;
}

const envPath = path.join(__dirname, '.env');
const envVars = loadEnvFile(envPath);
Object.keys(envVars).forEach(k => { if (!process.env[k]) process.env[k] = envVars[k]; });

if (process.platform !== 'linux') {
  console.error('❌ 서버용 배포 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

const config = {
  buildHost: (process.env.BUILD_SERVER_HOST || 'localhost').toLowerCase(),
  buildUser: process.env.BUILD_SERVER_USER || 'root',
  buildPort: process.env.BUILD_SERVER_PORT || '22',
  sourcePath: process.env.SOURCE_PATH || '/home/iitp-adm/iitp-dabt-admin/source',
  prodHost: (process.env.PROD_SERVER_HOST || 'localhost').toLowerCase(),
  prodUser: process.env.PROD_SERVER_USER || 'root',
  prodPort: process.env.PROD_SERVER_PORT || '22',
  opsPath: process.env.OPS_SCRIPT_PATH || '/var/www/iitp-dabt-admin/script'
};

function hostsEqual(a, b) {
  const aliases = new Set(['localhost', '127.0.0.1', '::1']);
  return a === b || (aliases.has(a) && aliases.has(b));
}

const sameHost = hostsEqual(config.buildHost, config.prodHost) && config.buildUser === config.prodUser;

const scriptFiles = [
  'script/start-server-be.js',
  'script/restart-server-be.js',
  'script/stop-server-be.js',
  'script/start-server-fe.js',
  'script/restart-server-fe.js',
  'script/stop-server-fe.js'
];

async function rsyncLocal(src, dest) {
  const args = ['-avz', '--delete', src, dest];
  console.log(`📤 rsync (local): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

async function rsyncRemote(srcUserHost, src, destUserHost, dest, port) {
  const args = ['-avz', '--delete', '-e', `ssh -p ${port}`, `${srcUserHost}:${src}`, `${destUserHost}:${dest}`];
  console.log(`📤 rsync (ssh): rsync ${args.join(' ')}`);
  await run('rsync', args);
}

async function ensureDestDirAndPerms() {
  if (sameHost) {
    if (!fs.existsSync(config.opsPath)) fs.mkdirSync(config.opsPath, { recursive: true });
    return;
  }
  const sshBase = ['-p', `${config.prodPort}`, `${config.prodUser}@${config.prodHost}`];
  await run('ssh', [...sshBase, `mkdir -p ${config.opsPath}`]);
}

async function copyOpsScripts() {
  console.log('🚀 기동/재기동 스크립트 배포 시작...');
  await ensureDestDirAndPerms();

  for (const rel of scriptFiles) {
    const abs = path.posix.join(config.sourcePath, rel);
    const dest = config.opsPath + '/';
    if (sameHost) {
      await rsyncLocal(abs, dest);
    } else {
      await rsyncRemote(`${config.buildUser}@${config.buildHost}`, abs, `${config.prodUser}@${config.prodHost}`, dest, config.buildPort);
    }
  }

  // 실행 권한 부여
  if (sameHost) {
    for (const rel of scriptFiles) {
      const destFile = path.posix.join(config.opsPath, path.posix.basename(rel));
      try { await run('chmod', ['+x', destFile]); } catch (_) {}
    }
  } else {
    const sshBase = ['-p', `${config.prodPort}`, `${config.prodUser}@${config.prodHost}`];
    const chmodCmd = scriptFiles.map(rel => `chmod +x ${path.posix.join(config.opsPath, path.posix.basename(rel))}`).join(' && ');
    await run('ssh', [...sshBase, chmodCmd]);
  }

  console.log('🎉 기동/재기동 스크립트 배포 완료');
  console.log(`📁 대상 경로: ${config.opsPath}`);
}

// 운영 편의성: 런타임 루트(/var/www/iitp-dabt-admin)에 최소 package.json 배포
async function deployRuntimePackageJson() {
  const runtimeRoot = path.posix.dirname(config.opsPath);
  const pkgContent = JSON.stringify({
    name: 'iitp-dabt-admin-runtime',
    private: true,
    scripts: {
      'start:be': 'node script/start-server-be.js',
      'restart:be': 'node script/restart-server-be.js',
      'stop:be': 'node script/stop-server-be.js',
      'start:server:be': 'node script/start-server-be.js',
      'restart:server:be': 'node script/restart-server-be.js',
      'stop:server:be': 'node script/stop-server-be.js',
      'start:fe': 'node script/start-server-fe.js',
      'restart:fe': 'node script/restart-server-fe.js',
      'stop:fe': 'node script/stop-server-fe.js',
      'start:server:fe': 'node script/start-server-fe.js',
      'restart:server:fe': 'node script/restart-server-fe.js',
      'stop:server:fe': 'node script/stop-server-fe.js'
    }
  }, null, 2) + '\n';

  console.log('🧩 운영 루트 package.json 배포 준비...');
  if (sameHost) {
    try {
      if (!fs.existsSync(runtimeRoot)) fs.mkdirSync(runtimeRoot, { recursive: true });
      fs.writeFileSync(path.posix.join(runtimeRoot, 'package.json'), pkgContent, 'utf8');
      console.log(`✅ 로컬에 package.json 배포 완료: ${path.posix.join(runtimeRoot, 'package.json')}`);
    } catch (e) {
      console.error('❌ package.json 생성 실패:', e.message);
      throw e;
    }
  } else {
    // 빌드 서버의 임시 경로에 파일 생성 후 rsync로 원격에 복사
    const tmpLocal = path.posix.join('/tmp', `iitp-runtime-package-${Date.now()}.json`);
    try {
      fs.writeFileSync(tmpLocal, pkgContent, 'utf8');
      const destUserHost = `${config.prodUser}@${config.prodHost}`;
      const destPath = path.posix.join(runtimeRoot, 'package.json');
      await rsyncRemote(`${config.buildUser}@${config.buildHost}`, tmpLocal, destUserHost, destPath, config.buildPort);
      console.log(`✅ 원격에 package.json 배포 완료: ${destPath}`);
    } catch (e) {
      console.error('❌ 원격 package.json 배포 실패:', e.message);
      throw e;
    } finally {
      try { fs.unlinkSync(tmpLocal); } catch (_) {}
    }
  }
}

async function main() {
  try {
    await copyOpsScripts();
    await deployRuntimePackageJson();
    console.log('💡 사용 예:');
    console.log(`   node ${path.posix.join(config.opsPath, 'start-server-be.js')}`);
    console.log(`   node ${path.posix.join(config.opsPath, 'restart-server-be.js')}`);
    console.log(`   node ${path.posix.join(config.opsPath, 'stop-server-be.js')}`);
    const runtimeRoot = path.posix.dirname(config.opsPath);
    console.log('💡 npm 별칭 사용 예:');
    console.log(`   (on ${runtimeRoot}) npm run start:server:be`);
    console.log(`   (on ${runtimeRoot}) npm run restart:server:be`);
    console.log(`   (on ${runtimeRoot}) npm run stop:server:be`);
  } catch (e) {
    console.error('❌ 배포 실패:', e.message);
    process.exit(1);
  }
}

main();
