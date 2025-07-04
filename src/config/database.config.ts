import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';

export class DatabaseConfig {
  static getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'food_delivery',
      entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
      synchronize: AppConfig.isDevelopment,
      logging: AppConfig.isDevelopment,
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: false,
      ssl: AppConfig.isProduction ? { rejectUnauthorized: false } : false,
    };
  }
}
