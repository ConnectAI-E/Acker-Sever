import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { SOURCE } from '../common/constant';
import { errorResponse, HttpStatus } from '../common/response';

@Injectable()
export class SourceGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = {
      ...request.body,
      ...request.query,
    };
    if (query?.source !== undefined && !SOURCE.includes(query.source)) {
      throw new HttpException(
        errorResponse(HttpStatus.Error, 'Invalid param: source'),
        HttpStatus.Success,
      );
    }

    return true;
  }
}
