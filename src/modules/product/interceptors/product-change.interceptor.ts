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

// Key to attach query manager with transaction to the request
export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';

/**
 * Interceptor responsible for managing transactions for product change operations.
 * It ensures that all operations related to product changes are executed within a transaction.
 */
@Injectable()
export class ProductChangeInterceptor implements NestInterceptor {
  constructor(
    private dataSource: DataSource, // Data source for managing transactions
    private userProvider: UserProvider, // Provider for accessing user information
  ) {}

  /**
   * Intercepts the incoming request and wraps the subsequent handler within a transaction.
   * @param context Execution context.
   * @param next Next call handler.
   * @returns Observable<any>
   */
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    try {
      const req = context.switchToHttp().getRequest<Request>();

      // Extract user information from the request
      // Log the user information
      // Start transaction
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Attach query manager with transaction to the request
      req[ENTITY_MANAGER_KEY] = queryRunner.manager;

      return next.handle().pipe(
        concatMap(async (data) => {
          await queryRunner.commitTransaction(); // Commit transaction if successful
          return data;
        }),
        catchError(async (e) => {
          await queryRunner.rollbackTransaction(); // Rollback transaction in case of error
          throw e;
        }),
        finalize(async () => {
          await queryRunner.release(); // Release the query runner after completing the transaction
        }),
      );
    } catch (error) {
      // Handle unexpected errors
      console.error('Error in ProductChangeInterceptor:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
