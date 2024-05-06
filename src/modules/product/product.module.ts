import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductChangeController } from './controllers/product-change.controller';
import { Product } from './entities/product.entity';
import { ProductChange } from './entities/product-change.entity';
import { User } from '../user/entities/user.entity';
import { ProductChangeService } from './services/product-change.service';
import { JwtMiddleware } from '../../middlewares/jwt.middleware'; // Import the JWT middleware
import { UserProvider } from '../user/providers/user.provider';
import { ProductChangeInterceptor } from './interceptors/product-change.interceptor';
import { ProductChangeFacade } from './facades/product-change.facade';

/**
 * Module responsible for managing product-related features.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductChange, User])],
  controllers: [ProductController, ProductChangeController],
  providers: [
    ProductService,
    ProductChangeService,
    UserProvider,
    JwtMiddleware,
    ProductChangeInterceptor,
    ProductChangeFacade,
  ],
})
export class ProductModule {
  /**
   * Configures middleware for the module.
   * @param consumer Middleware consumer.
   */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('products');
  }
}
