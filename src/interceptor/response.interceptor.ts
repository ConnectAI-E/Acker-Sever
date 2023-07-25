/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponse, successResponse } from '../common/response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (isApiResponse(data)) {
          return data;
        }
        return successResponse(data);
      }),
    );
  }
}

function isApiResponse(data: any): data is ApiResponse<any> {
  return (
    data &&
    typeof data.code === 'number' &&
    typeof data.message === 'string' &&
    typeof data.data !== 'undefined'
  );
}
