// database-config.interface.ts
export interface DatabaseConfig {
  type: 'mysql' | 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  entities: string[];
}
