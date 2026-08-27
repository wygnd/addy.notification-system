export interface INotificationBatchRecipientError {
  user_id: number;
  message: string;
}

export interface INotificationBatchResponse {
  message: string;
  errors?: INotificationBatchRecipientError[];
}
