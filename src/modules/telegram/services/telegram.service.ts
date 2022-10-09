import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Api, TelegramClient } from 'telegram';
import { SendFileInterface } from 'telegram/client/uploads';
import { SendMessageParams } from 'telegram/client/messages';
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { telegramConfig } from '../telegram.config';
import { throttle } from '../../../util/throttle';
import { noop } from '../../../util/noop';
import { TelegramAuthService } from './telegram-auth.service';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly client: TelegramClient;
  constructor(
    @Inject(telegramConfig.KEY)
    private config: ConfigType<typeof telegramConfig>,
    private readonly telegramAuthService: TelegramAuthService,
  ) {
    this.client = telegramAuthService.client;
  }

  async sendVideoToDiscussion({
    file,
    caption,
    replyTo,
    progressCallback,
  }: Pick<
    SendFileInterface,
    'caption' | 'file' | 'progressCallback' | 'replyTo'
  >) {
    return await this.client.sendFile(this.config.discussionChatId, {
      replyTo,
      file,
      caption,
      parseMode: 'html',
      videoNote: true,
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

  async sendMessageToDiscussion({
    message,
    replyTo,
  }: Pick<SendMessageParams, 'message' | 'replyTo'>) {
    return this.client.sendMessage(this.config.discussionChatId, {
      replyTo,
      message,
      parseMode: 'html',
    });
  }

  async waitForDiscussionMessage(messageId: number) {
    const messageEvent = new NewMessage({
      chats: [this.config.discussionChatId],
    });

    return new Promise<Api.Message>((resolve) => {
      const handler = (event: NewMessageEvent) => {
        if (event.message.fwdFrom.savedFromMsgId !== messageId) {
          return;
        }

        this.client.removeEventHandler(handler, messageEvent);
        resolve(event.message);
      };

      this.client.addEventHandler(handler, messageEvent);
    });
  }

  async createUpdatingMessageToDiscussion({
    message,
    replyTo,
  }: Pick<SendMessageParams, 'message' | 'replyTo'>): Promise<
    [(text: string) => Promise<void>, () => Promise<void>]
  > {
    const _message = await this.sendMessageToDiscussion({
      message,
      replyTo,
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

  private get channelEntity() {
    return this.client.getEntity(this.config.chatId);
  }

  private get discussionEntity() {
    return this.client.getEntity(this.config.discussionChatId);
  }
}
