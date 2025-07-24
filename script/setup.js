#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// OS 감지
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';

console.log(`🖥️  OS 감지: ${process.platform} (${isWindows ? 'Windows' : isLinux ? 'Linux' : isMac ? 'macOS' : 'Unknown'})`);

// 스크립트 파일 경로
const scriptDir = path.join(__dirname);
const setupScript = isWindows ? 'setup-all.ps1' : 'setup-all.sh';
const setupPath = path.join(scriptDir, setupScript);

// 스크립트 파일 존재 확인
if (!fs.existsSync(setupPath)) {
    console.error(`❌ 스크립트 파일을 찾을 수 없습니다: ${setupPath}`);
    process.exit(1);
}

console.log(`📜 실행할 스크립트: ${setupScript}`);

// 스크립트 실행
let command, args;

if (isWindows) {
    command = 'powershell';
    args = ['-ExecutionPolicy', 'Bypass', '-File', setupPath];
} else {
    command = 'bash';
    args = [setupPath];
}

const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

child.on('close', (code) => {
    if (code === 0) {
        console.log('✅ 설정 스크립트 실행 완료');
    } else {
        console.error(`❌ 설정 스크립트 실행 실패 (종료 코드: ${code})`);
        process.exit(code);
    }
});

child.on('error', (error) => {
    console.error(`❌ 스크립트 실행 중 오류 발생: ${error.message}`);
    process.exit(1);
}); 