export interface IVkApiError {
  response: {
    method: string;
    error_code: number;
    error_msg: string;
  };
}
