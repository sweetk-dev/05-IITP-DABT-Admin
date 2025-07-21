const crypto = require('crypto');
const prompt = require('prompt-sync')({ sigint: true });

function encryptAes256(plainText, secret) {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(secret).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(plainText, 'utf8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return Buffer.concat([iv, encrypted]).toString('base64');
}

const plain = prompt('암호화할 값을 입력하세요: ');
const secret = process.env.ENC_SECRET || prompt('복호화 키(SECRET)를 입력하세요: ', { echo: '*' });

if (!plain || !secret) {
  console.error('입력이 필요합니다.');
  process.exit(1);
}
const enc = encryptAes256(plain, secret);
console.log(`ENC(${enc})`); 