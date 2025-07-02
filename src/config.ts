import * as dotenv from 'dotenv';

dotenv.config();

function getEnv(key: string, required = true): string {
  const value = process.env[key];
  if (!value && required) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value || '';
}

export const Config = {
  port: parseInt(getEnv('PORT', false)) || 3000,
  mongoUri: getEnv('MONGO_URI'),
  jwtSecret: getEnv('JWT_SECRET', false),
};
