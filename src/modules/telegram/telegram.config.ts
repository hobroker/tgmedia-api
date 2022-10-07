import { registerAs } from '@nestjs/config';
import { TELEGRAM_MODULE_ID } from './telegram.constants';

export const telegramConfig = registerAs(TELEGRAM_MODULE_ID, () => ({
  token: process.env.TELEGRAM_TOKEN,
  chatId: parseInt(process.env.TELEGRAM_CHAT_ID, 10),
  replyChatId: parseInt(process.env.TELEGRAM_REPLY_CHAT_ID, 10),
}));
