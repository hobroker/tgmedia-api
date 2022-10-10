import { Controller, Get, Logger, Param } from '@nestjs/common';
import { MessengerService } from '../services';
import { MESSENGER_MODULE_ID } from '../messenger.constants';
import { RadarrService } from '../../radarr';

@Controller(MESSENGER_MODULE_ID)
export class MessengerController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly radarrService: RadarrService,
    private readonly messengerService: MessengerService,
  ) {}

  @Get('movie/:movieId')
  async uploadMovie(@Param() { movieId }: { movieId: number }) {
    const movie = await this.radarrService.get(movieId);

    this.messengerService
      .sendToTelegram(movie)
      .catch(this.logger.error.bind(this.logger));

    return movie;
  }
}
