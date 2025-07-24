import { appLogger } from '../utils/logger';
import { Sequelize } from 'sequelize';
import { initOpenApiUser } from './openApiUser';
import { initOpenApiAuthKey } from './openApiAuthKey';
import { getDecryptedEnv } from '../utils/decrypt';

const env = process.env.NODE_ENV || 'development';
appLogger.info('현재 NODE_ENV:', env);

const dbPassword = getDecryptedEnv('DB_PASSWORD', process.env.ENC_SECRET || '');

const sequelize = new Sequelize(
  process.env.DB_NAME || '',
  process.env.DB_USER || '',
  dbPassword || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);

initOpenApiUser(sequelize);
initOpenApiAuthKey(sequelize);

// 모델 간 관계 설정
import { OpenApiUser } from './openApiUser';
import { OpenApiAuthKey } from './openApiAuthKey';

OpenApiUser.hasMany(OpenApiAuthKey, {
  foreignKey: 'userId',
  as: 'authKeys'
});

OpenApiAuthKey.belongsTo(OpenApiUser, {
  foreignKey: 'userId',
  as: 'user'
});

export { sequelize }; 