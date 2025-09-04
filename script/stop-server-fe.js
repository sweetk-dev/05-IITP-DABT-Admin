#!/usr/bin/env node

const { spawn } = require('child_process');

const isLinux = process.platform === 'linux';
console.log(`🖥️  OS 감지: ${process.platform} (${isLinux ? 'Linux' : 'Unknown'})`);
if (!isLinux) {
  console.error('❌ 서버용 중지 스크립트는 Linux에서만 실행 가능합니다.');
  process.exit(1);
}

const nginxSitePath = process.env.NGINX_CONFIG_PATH || '/etc/nginx/sites-available/iitp-dabt-adm-fe';

async function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit' });
    p.on('close', code => (code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} 실패 (코드: ${code})`))));
  });
}

async function main() {
  try {
    console.log('🛑 Frontend Nginx 비활성화');
    // 비활성화: 심볼릭 링크 제거
    await run('bash', ['-lc', `rm -f /etc/nginx/sites-enabled/$(basename ${nginxSitePath}) || true`]);
    console.log('🔄 Nginx 재시작');
    await run('systemctl', ['restart', 'nginx']);
    console.log('✅ Frontend 중지 완료');
  } catch (e) {
    console.error('❌ Frontend 중지 실패:', e.message);
    process.exit(1);
  }
}

main();
