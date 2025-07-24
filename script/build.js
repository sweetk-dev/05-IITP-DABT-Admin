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
const buildScript = isWindows ? 'build-all.ps1' : 'build-all.sh';
const buildPath = path.join(scriptDir, buildScript);

// 스크립트 파일 존재 확인
if (!fs.existsSync(buildPath)) {
    console.error(`❌ 스크립트 파일을 찾을 수 없습니다: ${buildPath}`);
    process.exit(1);
}

console.log(`📜 실행할 스크립트: ${buildScript}`);

// 스크립트 실행
let command, args;

if (isWindows) {
    command = 'powershell';
    args = ['-ExecutionPolicy', 'Bypass', '-File', buildPath];
} else {
    command = 'bash';
    args = [buildPath];
}

const child = spawn(command, args, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
});

child.on('close', (code) => {
    if (code === 0) {
        console.log('✅ 빌드 스크립트 실행 완료');
    } else {
        console.error(`❌ 빌드 스크립트 실행 실패 (종료 코드: ${code})`);
        process.exit(code);
    }
});

child.on('error', (error) => {
    console.error(`❌ 스크립트 실행 중 오류 발생: ${error.message}`);
    process.exit(1);
}); 