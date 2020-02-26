import { ApiErrorResponse } from './declarations';

export const getErrorResponse = (
  message: string,
  code: string,
  status: number = 500,
): ApiErrorResponse => {
  return {
    code,
    message,
    status,
  };
};
