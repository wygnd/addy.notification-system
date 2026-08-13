import { IVkApiError } from '@src/interfaces';

export function isVkApiError(error: unknown): error is IVkApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'method' in error.response &&
    'error_code' in error.response &&
    'error_msg' in error.response
  );
}
