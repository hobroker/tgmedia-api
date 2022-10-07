import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigType } from '@nestjs/config';
import { telegramConfig } from '../telegram.config';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: TelegramBot;

  constructor(
    @Inject(telegramConfig.KEY)
    private config: ConfigType<typeof telegramConfig>,
  ) {
    this.bot = new TelegramBot(config.token, {
      webHook: true,
    });
  }

  async sendPhoto({ caption, image }: { caption: string; image: string }) {
    return this.bot.sendPhoto(this.config.chatId, image, {
      caption,
      parse_mode: 'HTML',
    });
  }

  onModuleInit() {
    //
  }

  onModuleDestroy() {
    //
  }
}
