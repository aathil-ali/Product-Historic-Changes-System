// src/user/user.service.ts

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginDto } from '../dto/login.dto';

/**
 * Service responsible for user-related operations such as registration, login, and user validation.
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, // Inject repository for user entity
    private readonly jwtService: JwtService, // Inject JWT service for token generation
  ) {}

  /**
   * Registers a new user with the provided information.
   * @param createUserDto DTO containing user registration details.
   * @returns A promise that resolves to an object containing the JWT token.
   */
  async register(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { username, email, password } = createUserDto;

    // Check if a user with the same email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // If no user with the same email exists, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
    });
    this.userRepository.save(user);

    // Generate JWT token for the registered user
    const token = this.jwtService.sign({
      userId: user.id,
    });
    return { token };
  }

  /**
   * Authenticates a user with the provided credentials.
   * @param loginDto DTO containing user login details.
   * @returns A promise that resolves to an object containing the JWT token.
   */
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token for the authenticated user
    const token = this.jwtService.sign({
      userId: user.id,
    });
    return { token };
  }

  /**
   * Validates a user's credentials.
   * @param username The username of the user.
   * @param password The password of the user.
   * @returns A promise that resolves to the user if the credentials are valid, otherwise null.
   */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }
}
