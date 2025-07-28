const bcrypt = require('bcrypt');

/**
 * 비밀번호 해싱 테스트 스크립트
 * 관리자 계정 초기 비밀번호 설정을 위한 도구
 * 
 * 사용법:
 * node scripts/test-password-hash.js [비밀번호]
 * 
 * 예시:
 * node scripts/test-password-hash.js admin123
 */

async function testPasswordHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.log('사용법: node scripts/test-password-hash.js [비밀번호]');
    console.log('예시: node scripts/test-password-hash.js admin123');
    process.exit(1);
  }

  try {
    console.log('=== 비밀번호 해싱 테스트 ===\n');
    
    // 1. 비밀번호 해싱
    console.log('1. 비밀번호 해싱 중...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`   평문 비밀번호: ${password} (길이: ${password.length})`);
    console.log(`   해싱된 비밀번호: ${hashedPassword} (길이: ${hashedPassword.length})`);
    console.log(`   Salt Rounds: 10\n`);

    // 2. SQL INSERT 문 생성
    console.log('2. SQL INSERT 문 생성:');
    const sql = `-- 관리자 계정 초기 설정 SQL
-- 비밀번호: ${password}
INSERT INTO open_api_client (clientId, name, affiliation, password, isAdmin, createdAt, updatedAt) 
VALUES ('admin@example.com', '관리자', '시스템관리자', '${hashedPassword}', true, NOW(), NOW());`;
    
    console.log(sql);
    console.log('');

    // 3. 비밀번호 검증 테스트
    console.log('3. 비밀번호 검증 테스트:');
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log(`   검증 결과: ${isValid ? '✅ 성공' : '❌ 실패'}`);
    
    // 4. 잘못된 비밀번호로 검증 테스트
    const wrongPassword = password + 'wrong';
    const isWrongValid = await bcrypt.compare(wrongPassword, hashedPassword);
    console.log(`   잘못된 비밀번호 검증: ${isWrongValid ? '❌ 실패 (올바른 비밀번호가 아님)' : '✅ 성공 (올바르게 거부됨)'}`);
    
    console.log('\n=== 테스트 완료 ===');
    console.log('\n💡 생성된 SQL을 데이터베이스에 실행하여 관리자 계정을 생성하세요.');
    console.log('💡 관리자가 최초 로그인 후 반드시 비밀번호를 변경하도록 안내하세요.');

  } catch (error) {
    console.error('오류 발생:', error.message);
    process.exit(1);
  }
}

// 스크립트 실행
testPasswordHash(); 