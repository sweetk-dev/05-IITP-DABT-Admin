const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

function getLocalDateTimeString() {
  const now = new Date();
  const pad = (n, z = 2) => n.toString().padStart(z, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
         `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.${pad(now.getMilliseconds(), 3)}`;
}

const buildInfo = {
  version: pkg.version,
  buildDate: getLocalDateTimeString()
};

// dist 폴더가 없으면 생성
const distPath = path.join(__dirname, '../dist');
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath, { recursive: true });
}

// dist/build-info.json에 기록
fs.writeFileSync(path.join(distPath, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
console.log('build-info.json generated:', buildInfo); 