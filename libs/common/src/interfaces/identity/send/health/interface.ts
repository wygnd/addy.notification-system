export interface IIdentityMessageHealthPayload {}

export interface IIdentityMessageHealthResponse {
  ok: boolean;
  redis: boolean;
  database: boolean;
}
