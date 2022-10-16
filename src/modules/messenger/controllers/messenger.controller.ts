import { Controller, Get, Logger, Param } from '@nestjs/common';
import {
  MessengerMovieService,
  MessengerQueueService,
  MessengerShowService,
} from '../services';
import { MESSENGER_MODULE_ID, QueueType } from '../messenger.constants';
import { RadarrService } from '../../radarr';
import { SonarrService } from '../../sonarr';

@Controller(MESSENGER_MODULE_ID)
export class MessengerController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly radarrService: RadarrService,
    private readonly sonarrService: SonarrService,
    private readonly messengerMovieService: MessengerMovieService,
    private readonly messengerShowService: MessengerShowService,
    private readonly messengerQueueService: MessengerQueueService,
  ) {}

  @Get('movie/:movieId')
  async uploadMovie(@Param() { movieId }: { movieId: number }) {
    const queue = this.messengerQueueService.add({
      type: QueueType.Movie,
      args: { movieId },
    });

    return { queue };
  }

  @Get('show/:showId')
  async uploadShow(@Param() { showId }: { showId: number }) {
    const show = await this.sonarrService.get(showId);

    await this.messengerShowService
      .sendMainMessage(show)
      .catch(this.logger.error.bind(this.logger));

    return show;
  }

  @Get('show/:showId/season/:seasonNumber/episode/:episodeNumber')
  async uploadShowEpisode(
    @Param()
    {
      showId,
      seasonNumber,
      episodeNumber,
    }: {
      showId: number;
      seasonNumber: number;
      episodeNumber: number;
    },
  ) {
    const queue = this.messengerQueueService.add({
      type: QueueType.Episode,
      args: { showId, episodeNumber, seasonNumber },
    });

    return { queue };
  }
}
