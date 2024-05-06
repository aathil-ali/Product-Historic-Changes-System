import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Interceptor to handle response and error messages uniformly.
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * Intercepts the incoming observable stream and handles responses or errors.
   * @param context The execution context.
   * @param next The call handler.
   * @returns An observable stream with handled responses or errors.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)), // Handle successful response
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ), // Handle errors
    );
  }

  /**
   * Handles HTTP exceptions.
   * @param exception The HTTP exception.
   * @param context The execution context.
   */
  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Send error response with status code, message, and request path
    response.status(status).json({
      status: false,
      statusCode: status,
      path: request.url,
      message: exception.message,
    });
  }

  /**
   * Handles successful responses.
   * @param res The response data.
   * @param context The execution context.
   * @returns The response object with additional metadata.
   */
  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    // Send successful response with status code, request path, and result
    return {
      status: true,
      path: request.url,
      statusCode,
      result: res,
    };
  }
}
