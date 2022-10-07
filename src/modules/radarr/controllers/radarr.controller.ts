import { Controller, Get, Param } from '@nestjs/common';
import { RadarrService } from '../services';
import { RADARR_MODULE_ID } from '../radarr.constants';
import { TelegramService } from '../../telegram/services';

@Controller(RADARR_MODULE_ID)
export class RadarrController {
  constructor(
    private readonly radarrService: RadarrService,
    private readonly telegramService: TelegramService,
  ) {}

  @Get()
  list() {
    return this.radarrService.list();
  }

  @Get(':movieId')
  async get(@Param() { movieId }: { movieId: number }) {
    const movie = await this.radarrService.get(movieId);

    await this.radarrService.sendToTelegram(movie);

    return movie;
  }
}
