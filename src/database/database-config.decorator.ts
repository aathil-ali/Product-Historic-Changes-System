// database-config.decorator.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot(); // Load environment variables
export function DatabaseConfig(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true, // Note: Sync should be disabled in production
  };
}
