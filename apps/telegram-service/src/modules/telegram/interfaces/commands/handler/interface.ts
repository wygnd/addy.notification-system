import { Context } from 'grammy';

export interface ITelegramCommandHandler {
  readonly command: string;
  handle(ctx: Context): Promise<void>;
}
