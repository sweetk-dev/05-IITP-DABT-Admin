#!/usr/bin/env node

const { spawn } = require('child_process');

const isLinux = process.platform === 'linux';
console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);
if (!isLinux) {
  console.error('❌ 서버용 중지 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

const pm2AppName = process.env.PM2_APP_NAME_BE || 'iitp-dabt-adm-be';

async function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} 실패 (코드: ${code})`))));
  });
}

async function main() {
  try {
    console.log(`🛑 PM2 앱 중지: ${pm2AppName}`);
    await run('pm2', ['stop', pm2AppName]);
    console.log('✅ Backend 중지 완료');
  } catch (e) {
    console.error('❌ Backend 중지 실패:', e.message);
    process.exit(1);
  }
}

main();
