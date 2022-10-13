import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramHelperService, TelegramService } from '../../telegram';
import { messengerConfig } from '../messenger.config';
import { Episode, Show } from '../entities';
import { IEpisode, IShow } from '../../sonarr/interfaces';

@Injectable()
export class MessengerShowService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly telegramService: TelegramService,
    private readonly telegramHelperService: TelegramHelperService,
  ) {}

  async sendMainMessageToTelegram(rawShow: IShow) {
    const show = new Show(rawShow, {
      overrideMediaPath: this.config.overrideMediaPath,
    });

    await this.telegramHelperService.upsertChannelMessage(
      { search: `${show.raw.title}\n\n` },
      { caption: show.caption, file: show.image },
    );
  }

  async sendEpisodeToTelegram(rawShow: IShow, rawEpisode: IEpisode) {
    const { overrideMediaPath } = this.config;
    const show = new Show(rawShow, { overrideMediaPath });
    const episode = new Episode(rawEpisode, { overrideMediaPath });

    this.logger.debug('finding main message in the channel:', show.toString());
    const message = await this.telegramService.findChannelMessage({
      search: show.searchString,
    });

    this.logger.debug('converting video:', episode.toString());
    const file = await this.telegramHelperService.sendConvertVideoProgress(
      {
        commentTo: message.id,
      },
      { file: episode.video },
    );

    this.logger.debug('converting video done:', episode.toString());

    this.logger.debug('sending video:', episode.toString());
    await this.telegramHelperService.sendVideo({
      file,
      commentTo: message.id,
      caption: episode.caption,
    });
    this.logger.debug('sending video done:', episode.toString());
  }
}
