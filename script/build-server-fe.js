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
Object.keys(envVars).forEach(key => {
  if (!process.env[key]) {
    process.env[key] = envVars[key];
  }
});

// OS 감지
const isLinux = process.platform === 'linux';
console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);
if (!isLinux) {
  console.error('❌ 서버용 빌드 스크립트는 Linux에서만 실행 가능합니다.');
  console.log('💡 로컬에서는 npm run build:fe를 사용하세요.');
  process.exit(1);
}

// 설정
const config = {
  sourcePath: process.env.SOURCE_PATH || '/home/iitp-adm/iitp-dabt-admin/source',
  deployPath: process.env.DEPLOY_PATH || '/home/iitp-adm/iitp-dabt-admin/deploy'
};

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', cwd });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`))));
  });
}

function pathExists(p) { try { return fs.existsSync(p); } catch { return false; } }
function isDirEmpty(dir) { try { return fs.readdirSync(dir).length === 0; } catch { return true; } }

async function installToolchainAtRoot() {
  console.log('🧰 루트 도구체인 설치 (dev 포함) 중...');
  await run('npm', ['ci', '--include=dev'], config.sourcePath);
  console.log('✅ 루트 도구체인 설치 완료');
}

// Common 패키지 빌드 (의존성)
async function buildCommon() {
  console.log('📦 packages/common 빌드 중... (의존성)');
  await run('npm', ['run', 'build:clean'], path.join(config.sourcePath, 'packages/common'));
  console.log('✅ packages/common 빌드 완료');
}

// Frontend 빌드
async function buildFe() {
  console.log('🎨 Frontend 빌드 중...');
  await run('npm', ['run', 'build:clean'], path.join(config.sourcePath, 'fe'));
  console.log('✅ Frontend 빌드 완료');
}

async function ensureBuilt(name, pkgRelPath, distRelPath) {
  const pkgPath = path.join(config.sourcePath, pkgRelPath);
  const distPath = path.join(config.sourcePath, distRelPath);
  if (!pathExists(distPath) || isDirEmpty(distPath)) {
    console.log(`⚙️  ${name} dist가 없어 빌드 수행: ${pkgPath}`);
    await run('npm', ['run', 'build:clean'], pkgPath);
  }
  if (!pathExists(distPath)) {
    throw new Error(`${name} dist 경로가 존재하지 않습니다: ${distPath}`);
  }
  console.log(`✅ ${name} dist 확인: ${distPath}`);
}

function readBuildDateSafe(baseDir) {
  try {
    const distPath = path.join(baseDir, 'dist', 'build-info.json');
    if (fs.existsSync(distPath)) {
      const info = JSON.parse(fs.readFileSync(distPath, 'utf8'));
      return info.buildDate || undefined;
    }
  } catch (_) {}
  return undefined;
}

function showBuildSummary() {
  try {
    const feVer = require(path.join(config.sourcePath, 'fe/package.json')).version;
    const commonVer = require(path.join(config.sourcePath, 'packages/common/package.json')).version;
    const feBuild = readBuildDateSafe(path.join(config.sourcePath, 'fe'));
    console.log('📦 빌드 산출물 버전/시간:');
    console.log(`   🎨 Frontend v${feVer}${feBuild ? ` | 🔨 ${feBuild}` : ''}`);
    console.log(`   📦 Common v${commonVer}`);
    console.log('');
  } catch (e) {
    console.log('⚠️  빌드 산출물 버전/시간 정보를 읽을 수 없습니다.');
  }
}

// Frontend 배포 폴더로 복사
async function copyFeToDeploy() {
  console.log('📁 Frontend 배포 폴더로 복사 중...');
  const deployFePath = path.join(config.deployPath, 'frontend');
  if (!fs.existsSync(deployFePath)) fs.mkdirSync(deployFePath, { recursive: true });
  const feDist = path.join(config.sourcePath, 'fe/dist');
  await ensureBuilt('Frontend', 'fe', 'fe/dist');
  await run('cp', ['-a', path.join(feDist, '.'), deployFePath], undefined);
  console.log('✅ Frontend 복사 완료');
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 Frontend 빌드 시작...');
    await installToolchainAtRoot();
    await buildCommon();
    await buildFe();
    await copyFeToDeploy();
    showBuildSummary();
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
