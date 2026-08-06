import { Context } from 'grammy';

export interface ITelegramMessageHandler {
  pattern: string;
  handle(ctx: Context): Promise<void>;
}
