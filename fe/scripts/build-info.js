import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

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

fs.writeFileSync(path.join(distPath, 'build-info.json'), JSON.stringify(buildInfo, null, 2));
console.log('build-info.json generated:', buildInfo);
