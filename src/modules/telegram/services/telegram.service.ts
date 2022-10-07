import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigType } from '@nestjs/config';
import { telegramConfig } from '../telegram.config';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private bot: TelegramBot;
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(telegramConfig.KEY)
    private config: ConfigType<typeof telegramConfig>,
  ) {
    this.bot = new TelegramBot(config.token, {
      polling: true,
    });
  }

  async sendPhoto({
    caption,
    image,
    match,
  }: {
    caption: string;
    image: string;
    match: string;
  }) {
    await this.bot.sendPhoto(this.config.chatId, image, {
      caption,
      parse_mode: 'HTML',
    });

    const message = await new Promise<TelegramBot.Message>((resolve) => {
      this.logger.log('listening...');
      const handler = (message: TelegramBot.Message) => {
        if (message.chat.id !== this.config.replyChatId) {
          return;
        }

        this.bot.removeListener('message', handler);
        resolve(message);
      };

      this.bot.on('message', handler);
    });

    this.logger.log('sending video...');

    // await this.bot.sendVideo(
    //   this.config.replyChatId,
    //   'path',
    //   {
    //     reply_to_message_id: message.message_id,
    //   },
    // );
  }

  onModuleInit() {
    //
  }

  onModuleDestroy() {
    //
  }
}
