import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { page = 1, limit = 10 } = request.query;

    return next.handle().pipe(
      map((data) => {
        console.log('Pagination');
        // Ensure the data is an array
        if (!Array.isArray(data)) {
          throw new Error('PaginationInterceptor expects an array of data.');
        }

        // Calculate pagination parameters
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const totalItems = data.length;

        // Paginate the data
        const paginatedData = data.slice(startIndex, endIndex);

        // Return the paginated result along with pagination metadata
        return {
          totalItems,
          page,
          limit,
          totalPages: Math.ceil(totalItems / limit),
          data: paginatedData,
        };
      }),
    );
  }
}
