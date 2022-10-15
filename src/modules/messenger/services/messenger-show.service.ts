import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramHelperService, TelegramService } from '../../telegram';
import { messengerConfig } from '../messenger.config';
import { Episode, Show } from '../entities';
import { IShow } from '../../sonarr/interfaces';
import { HandbrakeService } from '../../handbrake';
import { SonarrService } from '../../sonarr';

@Injectable()
export class MessengerShowService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly telegramService: TelegramService,
    private readonly telegramHelperService: TelegramHelperService,
    private readonly handbrakeService: HandbrakeService,
    private readonly sonarrService: SonarrService,
  ) {}

  async sendMainMessage(rawShow: IShow) {
    const { overrideMediaPath } = this.config;
    const show = new Show(rawShow, { overrideMediaPath });

    await this.upsertChannelMessage(show);
  }

  async sendEpisode({
    showId,
    seasonNumber,
    episodeNumber,
  }: {
    showId: number;
    seasonNumber: number;
    episodeNumber: number;
  }) {
    const [rawShow, seasons] = await Promise.all([
      this.sonarrService.get(showId),
      this.sonarrService.getShowSeasons(showId),
    ]);
    const { overrideMediaPath } = this.config;
    const show = new Show(rawShow, { overrideMediaPath });
    const rawEpisode = seasons[seasonNumber][episodeNumber];

    const episode = new Episode(rawEpisode, show, { overrideMediaPath });

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
    this.logger.debug('finding main message in the channel:', show.rawTitle);

    return this.telegramHelperService.upsertChannelMessage(
      { search: show.searchString },
      { caption: show.caption, file: show.image },
    );
  }
}
