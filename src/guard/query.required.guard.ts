/* eslint-disable @typescript-eslint/no-explicit-any */
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { errorResponse, HttpStatus } from '../common/response';

@Injectable()
export class QueryRequiredGuard implements CanActivate {
  constructor(private readonly dtoType: new () => any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const query = {
      ...request.body,
      ...request.query,
    };
    const dtoInstance = plainToClass(this.dtoType, query);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const errMeg = errors.map((item) => item.constraints);
      throw new HttpException(
        errorResponse(HttpStatus.QueryRequiredError),
        HttpStatus.Success,
      );
    }

    return true;
  }
}
