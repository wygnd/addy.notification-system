export const ERRNO_CODE_MAP: Record<string, number> = {
  ENOENT: 404,
  EACCES: 403,
  EPERM: 403,
  ECONNREFUSED: 503,
  ECONNRESET: 503,
  ETIMEDOUT: 504,
  EADDRINUSE: 500,
  EMFILE: 500,
} as const;
