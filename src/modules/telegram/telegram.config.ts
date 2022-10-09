import { registerAs } from '@nestjs/config';
import { TELEGRAM_MODULE_ID } from './telegram.constants';

export const telegramConfig = registerAs(TELEGRAM_MODULE_ID, () => ({
  apiId: parseInt(process.env.TELEGRAM_APP_API_ID, 10),
  apiHash: process.env.TELEGRAM_APP_API_HASH,
  chatId: parseInt(process.env.TELEGRAM_CHAT_ID, 10),
}));
