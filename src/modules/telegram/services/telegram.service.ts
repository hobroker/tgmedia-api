import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import type { TelegramClient } from 'telegram';
import type { SendFileInterface } from 'telegram/client/uploads';
import type { SendMessageParams } from 'telegram/client/messages';
import { telegramConfig } from '../telegram.config';
import { throttle } from '../../../util/throttle';
import { noop } from '../../../util/noop';
import { TelegramAuthService } from './telegram-auth.service';

@Injectable()
export class TelegramService {
  private readonly client: TelegramClient;
  constructor(
    @Inject(telegramConfig.KEY)
    private config: ConfigType<typeof telegramConfig>,
    private readonly telegramAuthService: TelegramAuthService,
  ) {
    this.client = telegramAuthService.client;
  }

  async commentVideoToChannel({
    file,
    caption,
    commentTo,
    progressCallback,
  }: Pick<
    SendFileInterface,
    'caption' | 'file' | 'progressCallback' | 'commentTo'
  >) {
    return await this.client.sendFile(this.config.chatId, {
      commentTo,
      file,
      caption,
      parseMode: 'html',
      supportsStreaming: true,
      progressCallback: (progress: number) => {
        const percent = Math.round(progress * 10000) / 100;

        progressCallback?.(percent);
      },
    });
  }

  async sendPhotoToChannel({
    caption,
    file,
  }: Pick<SendFileInterface, 'caption' | 'file'>) {
    return this.client.sendFile(this.config.chatId, {
      caption,
      file,
      parseMode: 'html',
    });
  }

  async commentMessageToChannel({
    message,
    commentTo,
  }: Pick<SendMessageParams, 'message' | 'commentTo'>) {
    return this.client.sendMessage(this.config.chatId, {
      commentTo,
      message,
      parseMode: 'html',
    });
  }

  async createUpdatingCommentToChannel({
    message,
    commentTo,
  }: Pick<SendMessageParams, 'message' | 'commentTo'>): Promise<
    [(text: string) => Promise<void>, () => Promise<void>]
  > {
    const _message = await this.commentMessageToChannel({
      message,
      commentTo,
    });

    const updateProgressMessage = throttle(async (text) => {
      await this.client
        .editMessage(_message.chatId, {
          text,
          parseMode: 'html',
          message: _message.id,
        })
        .catch(noop);
    }, 1000);

    const deleteProgressMessage = async () => {
      await this.client.deleteMessages(_message.chatId, [_message.id], {});
    };

    return [updateProgressMessage, deleteProgressMessage];
  }
}
