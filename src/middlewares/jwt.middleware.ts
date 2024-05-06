import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';
import { UserProvider } from '../modules/user/providers/user.provider';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * Middleware for JWT authentication and user authorization.
 */
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userProvider: UserProvider,
  ) {}

  /**
   * Middleware execution logic.
   * @param req Express request object.
   * @param res Express response object.
   * @param next Express next function.
   */
  async use(req: Request, res: Response, next: NextFunction) {
    // Chain of responsibility pattern for JWT handling
    const handlers: JwtHandler[] = [
      new ExtractTokenHandler(),
      new VerifyTokenHandler(),
      new FindUserHandler(this.userRepository, this.userProvider),
    ];

    const handlerChain = new JwtHandlerChain(handlers);
    await handlerChain.handle(req, res, next);
  }
}

/**
 * Interface defining a JWT handler.
 */
interface JwtHandler {
  handle(req: Request, res: Response, next: NextFunction): Promise<void>;
}

/**
 * Handler for extracting JWT token from the request headers.
 */
class ExtractTokenHandler implements JwtHandler {
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers.authorization;
    const token = this.extractTokenFromHeaders(authorizationHeader);
    if (token) {
      req['token'] = token;
      next();
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

/**
 * Handler for verifying the authenticity of the JWT token.
 */
class VerifyTokenHandler implements JwtHandler {
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req['token'];
    try {
      const decoded: JwtPayload = jwt.verify(
        token,
        process.env.JWT_KEY,
      ) as JwtPayload;
      req['decodedToken'] = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}

/**
 * Handler for finding and setting the user based on the decoded JWT token.
 */
class FindUserHandler implements JwtHandler {
  constructor(
    private readonly userRepository: Repository<User>,
    private readonly userProvider: UserProvider,
  ) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    const id = parseInt(req['decodedToken'].userId);
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      this.userProvider.setUser(user);
      next();
    } else {
      res.status(401).json({ message: 'User not found' });
    }
  }
}

/**
 * Class representing a chain of JWT handlers.
 */
class JwtHandlerChain {
  constructor(private readonly handlers: JwtHandler[]) {}

  /**
   * Executes the chain of handlers sequentially.
   * @param req Express request object.
   * @param res Express response object.
   * @param next Express next function.
   */
  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    let index = 0;
    const executeHandler = async () => {
      if (index < this.handlers.length) {
        await this.handlers[index].handle(req, res, async () => {
          index++;
          await executeHandler();
        });
      } else {
        next();
      }
    };
    await executeHandler();
  }
}
