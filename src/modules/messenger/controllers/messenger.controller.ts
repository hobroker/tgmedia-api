import { Controller, Get, Logger, Param } from '@nestjs/common';
import { MessengerMovieService, MessengerShowService } from '../services';
import { MESSENGER_MODULE_ID } from '../messenger.constants';
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
  ) {}

  @Get('movie/:movieId')
  async uploadMovie(@Param() { movieId }: { movieId: number }) {
    const movie = await this.radarrService.get(movieId);

    this.messengerMovieService
      .sendToTelegram(movie)
      .catch(this.logger.error.bind(this.logger));

    return movie;
  }

  @Get('show/:showId')
  async uploadShow(@Param() { showId }: { showId: number }) {
    const show = await this.sonarrService.get(showId);

    this.messengerShowService
      .sendMainMessageToTelegram(show)
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
    const [show, seasons] = await Promise.all([
      this.sonarrService.get(showId),
      this.sonarrService.getShowSeasons(showId),
    ]);

    const episode = seasons[seasonNumber][episodeNumber];

    await this.messengerShowService.sendEpisodeToTelegram(show, episode);

    return episode;
  }
}
