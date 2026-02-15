import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD), // 🔑 FORZADO A STRING
  database: process.env.DB_NAME,
  logging: false,
  entities: ['src/modules/**/entities/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
});
