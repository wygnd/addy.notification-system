import { TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS } from '@modules/telegram/constants';
import { Keyboard } from 'grammy';
import {
  ForceReply,
  InlineKeyboardMarkup,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
} from 'grammy/types';

export const buildMainKeyboard = (
  isConnected: boolean,
):
  | InlineKeyboardMarkup
  | ReplyKeyboardMarkup
  | ReplyKeyboardRemove
  | ForceReply
  | undefined => {
  if (!isConnected) {
    return { remove_keyboard: true };
  }

  return new Keyboard()
    .text(TELEGRAM_BOT_MESSAGE_HEAR_CONSTANTS.CLIENT_DISCONNECT)
    .resized();
};
