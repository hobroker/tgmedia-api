import { Controller, Get, Logger, Param } from '@nestjs/common';
import { MessengerMovieService, MessengerShowService } from '../services';
import { MESSENGER_MODULE_ID } from '../messenger.constants';
import { RadarrService } from '../../radarr';
import { SonarrService } from '../../sonarr';
import { Show } from '../entities';

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

  @Get('test')
  async test() {
    const show = new Show(await this.sonarrService.get(28));

    return this.messengerShowService.findMessageWithTitle(show.raw.title);
  }
}
