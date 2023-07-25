/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { errorResponse } from '../common/response';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((err) => throwError(() => errorResponse(err.message))));
  }
}
