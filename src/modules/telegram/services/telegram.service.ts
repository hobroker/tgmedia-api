import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Api, TelegramClient } from 'telegram';
import { SendFileInterface } from 'telegram/client/uploads';
import {
  IterMessagesParams,
  SendMessageParams,
} from 'telegram/client/messages';
import { head } from 'ramda';
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

  findChannelMessage({
    search,
  }: Pick<IterMessagesParams, 'search'>): Promise<Api.Message | null> {
    return this.findChannelMessages({ search }).then((data) => data[0]);
  }

  findChannelMessages({
    search,
  }: Pick<IterMessagesParams, 'search'>): Promise<Api.Message[]> {
    return this.client.getMessages(this.config.chatId, {
      search,
      filter: new Api.InputMessagesFilterPhotos(),
    });
  }

  async upsertChannelMessage(
    { search }: Pick<IterMessagesParams, 'search'>,
    { caption, file }: Pick<SendFileInterface, 'caption' | 'file'>,
  ) {
    const message = await this.findChannelMessage({ search });

    if (message) {
      return message;
    }

    return this.sendPhotoToChannel({ caption, file });
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

  async createUpdatingCommentToChannel({
    message,
    commentTo,
  }: Pick<SendMessageParams, 'message' | 'commentTo'>): Promise<
    [(text: string) => Promise<void>, () => Promise<void>]
  > {
    const { chatId, id } = await this.commentMessageToChannel({
      message,
      commentTo,
      silent: true,
    });

    const updateProgressMessage = throttle(async (text) => {
      await this.client
        .editMessage(chatId, {
          text,
          parseMode: 'html',
          message: id,
        })
        .catch(noop);
    }, 1000);

    const deleteProgressMessage = async () => {
      await this.client.deleteMessages(chatId, [id], {});
    };

    return [updateProgressMessage, deleteProgressMessage];
  }
}
