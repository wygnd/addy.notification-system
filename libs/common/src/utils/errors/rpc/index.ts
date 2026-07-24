import { IRpcError } from '@src/interfaces';

export function isRpcError(error: unknown): error is IRpcError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('statusCode' in error || 'message' in error)
  );
}
