import { ApiErrorResponse } from './declarations';

export function getErrorResponse(
  message: string,
  code: string,
  status: number = 500,
): ApiErrorResponse {
  return {
    code,
    message,
    status,
  };
}
