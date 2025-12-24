import type { Config } from '../types/index.js';
import path from 'path';

export const config: Config = {
  port: 3000,
  host: '0.0.0.0',
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'glampling',
  },
  sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
  projectRoot: path.resolve(__dirname, '..'),
};
