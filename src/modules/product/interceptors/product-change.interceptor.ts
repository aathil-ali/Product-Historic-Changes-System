import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';
import { UserProvider } from 'src/modules/user/providers/user.provider';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

@Injectable()
export class ProductChangeInterceptor implements NestInterceptor {
  constructor(
    private dataSource: DataSource,
    private userProvider: UserProvider,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const req = context.switchToHttp().getRequest<Request>();

      // // Extract user information from the request
      const user = this.userProvider.getUser(); // Assuming user information is stored in the request

      // // Log the user information
      console.log('User:', user);

      // Start transaction
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Attach query manager with transaction to the request
      req[ENTITY_MANAGER_KEY] = queryRunner.manager;

      return next.handle().pipe(
        concatMap(async (data) => {
          await queryRunner.commitTransaction();
          return data;
        }),
        catchError(async (e) => {
          await queryRunner.rollbackTransaction();
          throw e;
        }),
        finalize(async () => {
          await queryRunner.release();
        }),
      );
    } catch (error) {
      // Handle unexpected errors
      console.error('Error in TransactionInterceptor:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
