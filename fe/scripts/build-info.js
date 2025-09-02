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

fs.writeFileSync(path.join(__dirname, '../build-info.json'), JSON.stringify(buildInfo, null, 2));
console.log('build-info.json generated:', buildInfo);
