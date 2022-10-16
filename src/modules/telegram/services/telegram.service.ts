import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Api, TelegramClient } from 'telegram';
import { SendFileInterface } from 'telegram/client/uploads';
import {
  IterMessagesParams,
  SendMessageParams,
} from 'telegram/client/messages';
import { telegramConfig } from '../telegram.config';
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

  findChannelMessageByTitle(
    { search }: Pick<IterMessagesParams, 'search'>,
    { includes }: { includes: string[] } = { includes: [] },
  ): Promise<Api.Message | null> {
    const _includes = [`${search}\n\n`, ...includes];

    return this.findChannelMessages({
      search,
    }).then((messages) =>
      messages.find(({ message }) =>
        _includes.every((include) => message.includes(include)),
      ),
    );
  }

  findChannelMessages(
    args: Pick<IterMessagesParams, 'search'>,
  ): Promise<Api.Message[]> {
    return this.client.getMessages(this.config.chatId, {
      ...args,
      filter: new Api.InputMessagesFilterPhotos(),
    });
  }

  getChannelMessageComments(
    args: Pick<IterMessagesParams, 'replyTo'>,
  ): Promise<Api.Message[]> {
    return this.client.getMessages(this.config.chatId, args);
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
    silent,
  }: Pick<SendMessageParams, 'message' | 'commentTo' | 'silent'>) {
    return this.client.sendMessage(this.config.chatId, {
      commentTo,
      message,
      silent,
      parseMode: 'html',
    });
  }
}
