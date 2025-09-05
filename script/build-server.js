#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
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
  sourcePath: process.env.SOURCE_PATH || '/home/iitp-adm/iitp-dabt-admin/source',
  deployPath: process.env.DEPLOY_PATH || '/home/iitp-adm/iitp-dabt-admin/deploy'
};

// 버전 정보 출력 (소스 package.json 기준)
function showVersionInfo() {
  console.log('📋 빌드할 프로젝트 버전 정보:');
  try {
    const bePackageJson = require(path.join(gitConfig.sourcePath, 'be/package.json'));
    console.log(`   🏗️  Backend: ${bePackageJson.version}`);
    const fePackageJson = require(path.join(gitConfig.sourcePath, 'fe/package.json'));
    console.log(`   🎨 Frontend: ${fePackageJson.version}`);
    const commonPackageJson = require(path.join(gitConfig.sourcePath, 'packages/common/package.json'));
    console.log(`   📦 Common: ${commonPackageJson.version}`);
    try {
      const gitTag = execSync('git describe --tags', { cwd: gitConfig.sourcePath, encoding: 'utf8' }).trim();
      console.log(`   🏷️  Git 태그: ${gitTag}`);
    } catch (error) {
      console.log('   🏷️  Git 태그: 없음');
    }
  } catch (error) {
    console.log('   ⚠️  버전 정보를 가져올 수 없습니다.');
  }
  console.log('');
}

function readBuildDateSafe(baseDir, preferDist = true) {
  try {
    const distPath = path.join(baseDir, 'dist', 'build-info.json');
    const rootPath = path.join(baseDir, 'build-info.json');
    const infoPath = preferDist && fs.existsSync(distPath) ? distPath : (fs.existsSync(rootPath) ? rootPath : distPath);
    if (fs.existsSync(infoPath)) {
      const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
      return info.buildDate || undefined;
    }
  } catch (_) {}
  return undefined;
}

function showBuildSummary() {
  try {
    const beVer = require(path.join(gitConfig.sourcePath, 'be/package.json')).version;
    const feVer = require(path.join(gitConfig.sourcePath, 'fe/package.json')).version;
    const commonVer = require(path.join(gitConfig.sourcePath, 'packages/common/package.json')).version;
    const beBuild = readBuildDateSafe(path.join(gitConfig.sourcePath, 'be'));
    const feBuild = readBuildDateSafe(path.join(gitConfig.sourcePath, 'fe'));
    console.log('📦 빌드 산출물 버전/시간:');
    console.log(`   🏗️  Backend v${beVer}${beBuild ? ` | 🔨 ${beBuild}` : ''}`);
    console.log(`   🎨 Frontend v${feVer}${feBuild ? ` | 🔨 ${feBuild}` : ''}`);
    console.log(`   📦 Common v${commonVer}`);
    console.log('');
  } catch (e) {
    console.log('⚠️  빌드 산출물 버전/시간 정보를 읽을 수 없습니다.');
  }
}

// 유틸: 프로세스 실행 (Promise)
function run(cmd, args, cwd, inherit = true) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: inherit ? 'inherit' : 'pipe', cwd });
    p.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} 실패 (종료 코드: ${code})`));
    });
  });
}

function pathExists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function isDirEmpty(dir) {
  try { return fs.readdirSync(dir).length === 0; } catch { return true; }
}

async function ensureBuilt(name, pkgRelPath, distRelPath) {
  const pkgPath = path.join(gitConfig.sourcePath, pkgRelPath);
  const distPath = path.join(gitConfig.sourcePath, distRelPath);
  if (!pathExists(distPath) || isDirEmpty(distPath)) {
    console.log(`⚙️  ${name} dist가 없어 빌드 수행: ${pkgPath}`);
    // prebuild (빌드 정보 생성) 실행 후 빌드
    if (name === 'Backend' || name === 'Frontend') {
      await run('npm', ['run', 'prebuild'], pkgPath);
    }
    await run('npm', ['run', 'build:clean'], pkgPath);
  }
  if (!pathExists(distPath)) {
    throw new Error(`${name} dist 경로가 존재하지 않습니다: ${distPath}`);
  }
  console.log(`✅ ${name} dist 확인: ${distPath}`);
}

// Git pull
async function gitPull() {
  console.log('📥 Git 소스 업데이트 중...');
  return run('git', ['pull', 'origin', gitConfig.branch], gitConfig.sourcePath);
}

// 루트에서 도구체인 설치 (rimraf/tsc/vite 등)
async function installToolchainAtRoot() {
  console.log('🧰 루트 도구체인 설치 (dev 포함) 중...');
  await run('npm', ['ci', '--include=dev'], gitConfig.sourcePath);
  console.log('✅ 루트 도구체인 설치 완료');
}

// Common 패키지 빌드
async function buildCommon() {
  console.log('📦 packages/common 빌드 중...');
  await run('npm', ['run', 'build:clean'], path.join(gitConfig.sourcePath, 'packages/common'));
  console.log('✅ packages/common 빌드 완료');
}

// Backend 빌드
async function buildBe() {
  console.log('🔧 Backend 빌드 중...');
  // prebuild 실행(빌드 정보 생성)
  await run('npm', ['run', 'prebuild'], path.join(gitConfig.sourcePath, 'be'));
  await run('npm', ['run', 'build:clean'], path.join(gitConfig.sourcePath, 'be'));
  console.log('✅ Backend 빌드 완료');
}

// Frontend 빌드
async function buildFe() {
  console.log('🎨 Frontend 빌드 중...');
  // prebuild 실행(빌드 정보 생성)
  await run('npm', ['run', 'prebuild'], path.join(gitConfig.sourcePath, 'fe'));
  await run('npm', ['run', 'build:clean'], path.join(gitConfig.sourcePath, 'fe'));
  console.log('✅ Frontend 빌드 완료');
}

// 배포 폴더로 복사 (디렉터리 안전 복사)
async function copyDirSafe(name, fromDir, toDir) {
  console.log(`📋 ${name} 복사 중...`);
  if (!pathExists(fromDir)) {
    throw new Error(`${name} dist 경로가 없습니다: ${fromDir}`);
  }
  if (!pathExists(toDir)) {
    fs.mkdirSync(toDir, { recursive: true });
  }
  // cp -a from/. toDir
  await run('cp', ['-a', path.join(fromDir, '.'), toDir], undefined);
  console.log(`✅ ${name} 복사 완료`);
}

// 배포 폴더로 복사
async function copyToDeployFolders() {
  console.log('📁 배포 폴더로 복사 중...');
  const deployCommonPath = path.join(gitConfig.deployPath, 'common');
  const deployBePath = path.join(gitConfig.deployPath, 'backend');
  const deployFePath = path.join(gitConfig.deployPath, 'frontend');
  [deployCommonPath, deployBePath, deployFePath].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  const commonDist = path.join(gitConfig.sourcePath, 'packages/common/dist');
  const commonPkgJson = path.join(gitConfig.sourcePath, 'packages/common/package.json');
  const beDist = path.join(gitConfig.sourcePath, 'be/dist');
  const feDist = path.join(gitConfig.sourcePath, 'fe/dist');
  const bePkgJson = path.join(gitConfig.sourcePath, 'be/package.json');
  const bePkgLock = path.join(gitConfig.sourcePath, 'be/package-lock.json');
  const beBuildInfo = path.join(gitConfig.sourcePath, 'be/build-info.json');

  // dist 검증 및 필요 시 빌드 보강
  await ensureBuilt('Common', 'packages/common', 'packages/common/dist');
  await ensureBuilt('Backend', 'be', 'be/dist');
  await ensureBuilt('Frontend', 'fe', 'fe/dist');

  // 안전 복사
  await copyDirSafe('Common', commonDist, deployCommonPath);
  // Common 패키지 식별/엔트리 해석을 위해 package.json 포함
  if (!fs.existsSync(commonPkgJson)) {
    throw new Error(`Common package.json이 없습니다: ${commonPkgJson}`);
  }
  fs.copyFileSync(commonPkgJson, path.join(deployCommonPath, 'package.json'));
  await copyDirSafe('Backend', beDist, deployBePath);
  // Backend 실행에 필요한 메타 파일 포함 (의존성 설치를 위해 필요)
  if (!fs.existsSync(bePkgJson)) {
    throw new Error(`Backend package.json이 없습니다: ${bePkgJson}`);
  }
  fs.copyFileSync(bePkgJson, path.join(deployBePath, 'package.json'));
  if (fs.existsSync(bePkgLock)) {
    fs.copyFileSync(bePkgLock, path.join(deployBePath, 'package-lock.json'));
  }
  if (fs.existsSync(beBuildInfo)) {
    fs.copyFileSync(beBuildInfo, path.join(deployBePath, 'build-info.json'));
  }
  await copyDirSafe('Frontend', feDist, deployFePath);
}

// 메인 실행 함수
async function main() {
  try {
    console.log('🚀 서버용 전체 빌드 시작...');
    showVersionInfo();
    await gitPull();
    await installToolchainAtRoot();
    await buildCommon();
    await buildBe();
    await buildFe();
    await copyToDeployFolders();
    // 빌드 요약 출력
    showBuildSummary();
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
  console.log('   SOURCE_PATH: 소스 코드 경로 (기본값: /home/iitp-adm/iitp-dabt-admin/source)');
  console.log('   DEPLOY_PATH: 배포 폴더 경로 (기본값: /home/iitp-adm/iitp-dabt-admin/deploy)');
  console.log('   GIT_REPO_URL: Git 저장소 URL');
  console.log('   GIT_BRANCH: Git 브랜치 (기본값: main)');
  console.log('');
  console.log('💡 예시:');
  console.log('   export SOURCE_PATH=/home/iitp-adm/iitp-dabt-admin/source');
  console.log('   export DEPLOY_PATH=/home/iitp-adm/iitp-dabt-admin/deploy');
  console.log('   export GIT_REPO_URL=https://github.com/iitp/dabt-admin.git');
  console.log('   export GIT_BRANCH=main');
  console.log('');
  console.log('🔧 또는 .env 파일에 설정하세요.');
}

main();
