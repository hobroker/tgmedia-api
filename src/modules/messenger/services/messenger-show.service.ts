import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramHelperService, TelegramService } from '../../telegram';
import { messengerConfig } from '../messenger.config';
import { Episode, Show } from '../entities';
import { IEpisode, IShow } from '../../sonarr/interfaces';
import { HandbrakeService } from '../../handbrake';

@Injectable()
export class MessengerShowService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly telegramService: TelegramService,
    private readonly telegramHelperService: TelegramHelperService,
    private readonly handbrakeService: HandbrakeService,
  ) {}

  async sendMainMessageToTelegram(rawShow: IShow) {
    const { overrideMediaPath } = this.config;
    const show = new Show(rawShow, { overrideMediaPath });

    await this.upsertChannelMessage(show);
  }

  async sendEpisodeToTelegram(rawShow: IShow, rawEpisode: IEpisode) {
    const { overrideMediaPath } = this.config;
    const show = new Show(rawShow, { overrideMediaPath });
    const episode = new Episode(rawEpisode, show, { overrideMediaPath });

    this.logger.debug('finding main message in the channel:', show.toString());
    const message = await this.upsertChannelMessage(show);

    this.logger.debug('converting video:', episode.rawTitle);
    const file = await this.telegramHelperService.sendConvertVideoProgress(
      { commentTo: message.id },
      {
        input: episode.video,
        outputFilename: episode.raw.fileId,
      },
    );

    this.logger.debug('converting video done:', episode.rawTitle);

    this.logger.debug('sending video:', episode.rawTitle);
    await this.telegramHelperService.sendVideo({
      file,
      commentTo: message.id,
      caption: episode.caption,
    });
    this.logger.debug('sending video done:', episode.rawTitle);
    await this.handbrakeService.removeFileIfNeeded({ outputFilePath: file });
  }

  private upsertChannelMessage(show: Show) {
    return this.telegramHelperService.upsertChannelMessage(
      { search: show.searchString },
      { caption: show.caption, file: show.image },
    );
  }
}
