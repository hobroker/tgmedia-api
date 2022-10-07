import { Controller, Get, Param } from '@nestjs/common';
import { MessengerService, RadarrService } from '../services';
import { RADARR_MODULE_ID } from '../radarr.constants';

@Controller(RADARR_MODULE_ID)
export class RadarrController {
  constructor(
    private readonly radarrService: RadarrService,
    private readonly messengerService: MessengerService,
  ) {}

  @Get()
  list() {
    return this.radarrService.list();
  }

  @Get(':movieId')
  async get(@Param() { movieId }: { movieId: number }) {
    const movie = await this.radarrService.get(movieId);

    this.messengerService.sendToTelegram(movie);

    return movie;
  }
}
