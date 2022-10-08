import { Controller, Get, Param } from '@nestjs/common';
import { RadarrService } from '../../radarr';
import { MessengerService } from '../services';
import { MESSENGER_MODULE_ID } from '../messenger.constants';

@Controller(MESSENGER_MODULE_ID)
export class MessengerController {
  constructor(
    private readonly radarrService: RadarrService,
    private readonly messengerService: MessengerService,
  ) {}

  @Get(':movieId')
  async upload(@Param() { movieId }: { movieId: number }) {
    const movie = await this.radarrService.get(movieId);

    this.messengerService.sendToTelegram(movie);

    return movie;
  }
}
