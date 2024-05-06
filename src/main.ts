import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as dotenv from 'dotenv';
import { ResponseInterceptor } from './response/response.interceptor';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalInterceptors(new ResponseInterceptor());
  // Initialize TypeORM and get the connection status
  const options = new DocumentBuilder()
    .setTitle('Product Historical Change API')
    .setDescription('API documentation for managing product historical changes')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
 
}
bootstrap();
