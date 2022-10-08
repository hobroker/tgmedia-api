import { readFileSync } from 'fs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { ConfigType } from '@nestjs/config';
import { telegramConfig } from '../telegram.config';

@Injectable()
export class TelegramBotService {
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

  async sendMessageToDiscussion(text: string, discussionMessageId: number) {
    return this.bot.sendMessage(this.config.replyChatId, text, {
      parse_mode: 'HTML',
      reply_to_message_id: discussionMessageId,
    });
  }

  async updateDiscussionMessage(text: string, discussionMessageId: number) {
    return this.bot.editMessageText(text, {
      parse_mode: 'HTML',
      message_id: discussionMessageId,
      chat_id: this.config.replyChatId,
    });
  }

  async deleteDiscussionMessage(discussionMessageId: number) {
    console.log('discussionMessageId', discussionMessageId);

    return this.bot.deleteMessage(
      this.config.replyChatId,
      discussionMessageId.toString(),
    );
  }

  async sendPhoto({ caption, image }: { caption: string; image: string }) {
    return this.bot.sendPhoto(
      this.config.chatId,
      image,
      {
        caption,
        parse_mode: 'HTML',
      },
      {
        contentType: 'application/octet-stream',
      },
    );
  }

  async sendVideoToDiscussion(
    discussionMessageId: number,
    { caption, video }: { caption: string; video: string },
  ) {
    const buffer = readFileSync(video);

    return this.bot.sendVideo(
      this.config.replyChatId,
      buffer,
      {
        caption,
        parse_mode: 'HTML',
        reply_to_message_id: discussionMessageId,
      },
      {
        contentType: 'application/octet-stream',
      },
    );
  }

  async waitForDiscussionMessage(messageId: number) {
    return new Promise<TelegramBot.Message>((resolve) => {
      const handler = (message: TelegramBot.Message) => {
        if (
          message.chat.id !== this.config.replyChatId ||
          message.forward_from_message_id !== messageId
        ) {
          return;
        }

        this.bot.removeListener('message', handler);
        resolve(message);
      };

      this.bot.on('message', handler);
    });
  }
}
