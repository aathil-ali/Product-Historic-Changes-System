import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet'
import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './response/response.interceptor';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Initialize TypeORM and get the connection status
  await app.listen(3000);
}
bootstrap();
