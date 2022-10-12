import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramService } from '../../telegram';
import { messengerConfig } from '../messenger.config';
import { Show } from '../entities';
import { IShow } from '../../sonarr/interfaces';

@Injectable()
export class MessengerShowService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly telegramService: TelegramService,
  ) {}

  async findMessageWithTitle(title: string) {
    return this.telegramService.findChannelMessage({
      search: `${title}\n\n`,
    });
  }

  async sendMainMessageToTelegram(rawShow: IShow) {
    const show = new Show(rawShow, {
      overrideMediaPath: this.config.overrideMediaPath,
    });

    const message = await this.telegramService.upsertChannelMessage(
      { search: show.raw.title },
      { caption: show.caption, file: show.image },
    );

    await this.telegramService.commentMessageToChannel({
      message: 'hello',
      commentTo: message.id,
    });
  }
}
