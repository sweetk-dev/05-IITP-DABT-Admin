import { Sequelize } from 'sequelize';
import { getDecryptedEnv } from '../utils/decrypt';
import { appLogger } from '../utils/logger';

// 모델들 import
import { initOpenApiUser } from './openApiUser';
import { initOpenApiAuthKey } from './openApiAuthKey';
import { initSysAdmAccount } from './sysAdmAccount';
import { initSysFaq } from './sysFaq';
import { initSysQna } from './sysQna';
import { initSysLogUserAccess } from './sysLogUserAccess';
import { initSysLogChangeHis } from './sysLogChangeHis';

// 환경 변수에서 데이터베이스 설정 가져오기
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');
const dbName = process.env.DB_NAME || 'iitp_dabt';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = getDecryptedEnv('DB_PASSWORD') || '';

// Sequelize 인스턴스 생성
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? (sql) => appLogger.info(sql) : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 모델들 초기화
initOpenApiUser(sequelize);
initOpenApiAuthKey(sequelize);
initSysAdmAccount(sequelize);
initSysFaq(sequelize);
initSysQna(sequelize);
initSysLogUserAccess(sequelize);
initSysLogChangeHis(sequelize);

export default sequelize; 