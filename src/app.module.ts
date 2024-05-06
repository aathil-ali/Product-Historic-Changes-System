import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { UserProvider } from './modules/user/providers/user.provider';
@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Note: Sync should be disabled in production
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ProductModule,
    UserModule,

    // Other modules...
  ],
  controllers: [AppController],
  providers: [AppService, UserProvider],
})
export class AppModule {}
