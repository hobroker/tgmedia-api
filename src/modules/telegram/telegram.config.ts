import { registerAs } from '@nestjs/config';
import { TELEGRAM_MODULE_ID } from './telegram.constants';

export const telegramConfig = registerAs(TELEGRAM_MODULE_ID, () => ({
  token: process.env.TELEGRAM_TOKEN,
  chatId: process.env.TELEGRAM_CHAT_ID,
  replyChatId: process.env.REPLY_CHAT_ID,
}));
