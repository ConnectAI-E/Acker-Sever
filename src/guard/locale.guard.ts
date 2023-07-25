import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { MULTI_LOCALE } from '../common/constant';
import { errorResponse, HttpStatus } from '../common/response';

@Injectable()
export class LocaleGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = {
      ...request.body,
      ...request.query,
    };
    if (query?.locale !== undefined && !MULTI_LOCALE.includes(query.locale)) {
      throw new HttpException(
        errorResponse(HttpStatus.Error, 'Invalid locale'),
        HttpStatus.Success,
      );
    }

    return true;
  }
}
