import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

import { errorResponse, HttpStatus } from '../common/response';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers?.['access-token'] as string;
    if (!accessToken) {
      throw new HttpException(
        errorResponse(HttpStatus.TokenError),
        HttpStatus.Success,
      );
    }
    const userId = await this.supabaseService.getUserIdByJWT(accessToken);
    if (!userId) {
      throw new HttpException(
        errorResponse(HttpStatus.AuthError),
        HttpStatus.Success,
      );
    }
    request.headers['x-aios-user-id'] = userId;
    return true;
  }
}
