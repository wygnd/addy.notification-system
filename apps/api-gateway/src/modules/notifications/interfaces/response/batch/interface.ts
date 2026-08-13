export interface INotificationBatchRecipientError {
  user_id: string;
  message: string;
}

export interface INotificationBatchResponse {
  errors: INotificationBatchRecipientError[];
}
