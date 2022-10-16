import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramClient } from 'telegram';
import { SendFileInterface } from 'telegram/client/uploads';
import {
  IterMessagesParams,
  SendMessageParams,
} from 'telegram/client/messages';
import { telegramConfig } from '../telegram.config';
import { throttle } from '../../../util/throttle';
import { noop } from '../../../util/noop';
import { HandbrakeService } from '../../handbrake';
import { HandbrakeConvertOptions } from '../../handbrake/services/handbrake.service';
import { TelegramAuthService } from './telegram-auth.service';
import { TelegramService } from './telegram.service';

@Injectable()
export class TelegramHelperService {
  private readonly logger = new Logger(this.constructor.name);
  private readonly client: TelegramClient;
  constructor(
    @Inject(telegramConfig.KEY)
    private config: ConfigType<typeof telegramConfig>,
    private readonly telegramAuthService: TelegramAuthService,
    private readonly telegramService: TelegramService,
    private readonly handbrakeService: HandbrakeService,
  ) {
    this.client = telegramAuthService.client;
  }

  async upsertChannelMessage(
    { search }: Pick<IterMessagesParams, 'search'>,
    { caption, file }: Pick<SendFileInterface, 'caption' | 'file'>,
  ) {
    const message = await this.telegramService.findChannelMessage({ search });

    if (message) {
      return message;
    }

    return this.telegramService.sendPhotoToChannel({ caption, file });
  }

  async sendVideo({
    commentTo,
    file,
    caption,
  }: Pick<SendFileInterface, 'caption' | 'file' | 'commentTo'>) {
    this.logger.debug('sending video to discussion', file);
    const [updateMessage, deleteMessage] =
      await this.createUpdatingCommentToChannel({
        commentTo,
        message: `uploading ${caption}...`,
      });

    const throttledLog = throttle(this.logger.debug.bind(this.logger));
    const progressCallback = (progress: number) => {
      const text = `uploading ${caption}... ${progress}%`;

      throttledLog(text);

      return updateMessage(text);
    };

    await this.telegramService.commentVideoToChannel({
      commentTo,
      caption,
      file,
      progressCallback,
    });

    await deleteMessage();
  }

  async sendConvertVideoProgress(
    { commentTo }: Pick<SendFileInterface, 'commentTo'>,
    handbrakeConvertOptions: HandbrakeConvertOptions,
  ) {
    this.logger.debug('encoding the video', handbrakeConvertOptions.input);
    const [updateMessage, deleteMessage] =
      await this.createUpdatingCommentToChannel({
        commentTo,
        message: 'encoding the video...',
      });
    const throttledLog = throttle(this.logger.debug.bind(this.logger));
    const progressCallback = (progress: string) => {
      throttledLog(progress);

      return updateMessage(progress);
    };

    const video = await this.handbrakeService.convert(
      handbrakeConvertOptions,
      progressCallback,
    );

    await deleteMessage();

    return video;
  }

  async createUpdatingCommentToChannel({
    message,
    commentTo,
  }: Pick<SendMessageParams, 'message' | 'commentTo'>): Promise<
    [(text: string) => Promise<void>, () => Promise<void>]
  > {
    const { chatId, id } = await this.telegramService.commentMessageToChannel({
      message,
      commentTo,
    });

    const updateProgressMessage = throttle(async (text) => {
      await this.client
        .editMessage(chatId, {
          text,
          parseMode: 'html',
          message: id,
        })
        .catch(noop);
    }, this.config.updateInterval);

    const deleteProgressMessage = async () => {
      await this.client.deleteMessages(chatId, [id], {});
    };

    return [updateProgressMessage, deleteProgressMessage];
  }
}
