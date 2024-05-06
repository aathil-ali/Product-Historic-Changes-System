// user.controller.ts

import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Controller responsible for handling user authentication endpoints.
 */
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Endpoint for user registration.
   * @param createUserDto DTO containing user registration data.
   * @returns The result of user registration.
   */
  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.userService.register(createUserDto);
  }

  /**
   * Endpoint for user login.
   * @param loginDto DTO containing user login data.
   * @returns The result of user login.
   */
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }
}
