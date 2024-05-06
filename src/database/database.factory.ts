// database-factory.service.ts
import { Injectable } from '@nestjs/common';
import { DatabaseConfig } from './interfaces/database-config.interface';
import { MysqlModule } from './mysql.module';
import { PostgresModule } from './postgres.module';

@Injectable()
export class DatabaseFactoryService {
  createDatabase(config: DatabaseConfig) {

    console.log(config);
    switch (config.type) {
      case 'mysql':
        const mysql = MysqlModule.forRoot(config);
        console.log('mysql', mysql);
        return;
      case 'postgres':
        return PostgresModule.forRoot(config);
      default:
        throw new Error('Invalid database type');
    }
  }
}
