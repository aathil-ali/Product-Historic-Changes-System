import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { UserProvider } from '../modules/user/providers/user.provider';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userProvider: UserProvider,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeaders(req.headers.authorization);
    if (token) {
      try {
        const decoded: JwtPayload = jwt.verify(
          token,
          process.env.JWT_KEY,
        ) as JwtPayload;
        console.log(decoded);
        const id = parseInt(decoded.userId); // Access userId property
        const user = await this.userRepository.findOne({ where: { id } }); // Use await since findOne is asynchronous
        if (user) {
          this.userProvider.setUser(user);
          next();
        } else {
          res.status(401).json({ message: 'User not found' });
        }
      } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      res.status(401).json({ message: 'Token is missing' });
    }
  }

  private extractTokenFromHeaders(
    authorizationHeader: string | undefined,
  ): string | null {
    if (!authorizationHeader) {
      return null;
    }
    const [type, token] = authorizationHeader.split(' ');
    if (type.toLowerCase() !== 'bearer' || !token) {
      return null;
    }
    return token;
  }
}
