import { IRpcError } from '@shared/interfaces';

export function isRpcError(error: unknown): error is IRpcError {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('statusCode' in error || 'message' in error)
  );
}
