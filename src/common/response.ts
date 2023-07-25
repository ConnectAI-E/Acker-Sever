export enum HttpStatus {
  Success = 0,
  Error = 400,
  TokenError = 101,
  AuthError = 102,
  BodyRequiredError = 103,
  QueryRequiredError = 104,
}

export const HttpStatusMessage: Record<HttpStatus, string> = {
  [HttpStatus.Success]: 'OK',
  [HttpStatus.Error]: 'Bad Request',
  [HttpStatus.TokenError]: 'Access token is missing',
  [HttpStatus.AuthError]: 'Access token is invalid',
  [HttpStatus.BodyRequiredError]:
    'Missing required body parameters or incorrect parameter types',
  [HttpStatus.QueryRequiredError]: 'Missing required query parameter(s)',
};

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
}

export const successResponse = <T>(
  data: T,
  message?: string,
): ApiResponse<T> => {
  return {
    code: HttpStatus.Success,
    message: message ?? HttpStatusMessage[HttpStatus.Success] ?? 'OK',
    data,
  };
};

export const errorResponse = <T>(
  code = HttpStatus.Error,
  message?: string,
): ApiResponse<T> => {
  return {
    code,
    message: message ?? HttpStatusMessage[code] ?? 'Bad Request',
    data: null,
  };
};

export interface SupabaseError {
  code: string;
  details: string;
  hint: string;
  message: string;
}
