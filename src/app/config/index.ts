import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

interface IConfig {
  NODE_ENV: string;
  PORT: number;
  DB_URL?: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  GMAIL?: string;
  GMAIL_PASS?: string;
  SUPER_ADMIN_EMAIL?: string;
  SUPER_ADMIN_PASS?: string;
  SUPER_ADMIN_PHONE?: string;
}

const config: IConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000', 10),
  DB_URL: process.env.DB_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '30d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS || '12', 10),
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '365d',
  GMAIL: process.env.GMAIL,
  GMAIL_PASS: process.env.GMAIL_PASS,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASS: process.env.SUPER_ADMIN_PASS,
  SUPER_ADMIN_PHONE: process.env.SUPER_ADMIN_PHONE,
};

export default config;
