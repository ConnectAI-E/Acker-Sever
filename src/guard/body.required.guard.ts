/* eslint-disable @typescript-eslint/no-explicit-any */
import {plainToClass} from 'class-transformer';
import {validate} from 'class-validator';
import {CanActivate, ExecutionContext, HttpException, Injectable} from '@nestjs/common';

import {errorResponse, HttpStatus} from '../common/response';

@Injectable()
export class BodyRequiredGuard implements CanActivate {
  constructor(private readonly dtoType: new () => any) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const body = request.body;

    const dtoInstance = plainToClass(this.dtoType, body);
    const errors = await validate(dtoInstance);
    if (errors.length > 0) {
      const errMeg = errors.map((item) => item.constraints);
      throw new HttpException(
        errorResponse(HttpStatus.BodyRequiredError),
        HttpStatus.Success,
      );
    }

    return true;
  }
}
