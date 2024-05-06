// postgres.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './interfaces/database-config.interface';

@Module({})
export class PostgresModule {
  static forRoot(config: DatabaseConfig) {
    return {
      module: PostgresModule,
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          synchronize: config.synchronize,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
        }),
      ],
    };
  }
}
