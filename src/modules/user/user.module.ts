// src/user/user.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { ConfigModule } from '@nestjs/config';

// Load environment variables
ConfigModule.forRoot();

/**
 * Module for user-related functionality.
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Import user entity for TypeORM
    JwtModule.register({ // Configure JWT module
      secret: process.env.JWT_KEY, // Secret key for JWT encryption
      signOptions: { expiresIn: '1h' }, // Expiration time for JWT tokens
    }),
  ],
  controllers: [UserController], // Controllers responsible for handling HTTP requests
  providers: [UserService], // Services providing business logic for user-related operations
})
export class UserModule {}
