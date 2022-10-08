import { Controller, Get, Param } from '@nestjs/common';
import { RadarrService } from '../services';
import { RADARR_MODULE_ID } from '../radarr.constants';

@Controller(RADARR_MODULE_ID)
export class RadarrController {
  constructor(private readonly radarrService: RadarrService) {}

  @Get()
  list() {
    return this.radarrService.list();
  }

  @Get(':movieId')
  async get(@Param() { movieId }: { movieId: number }) {
    return this.radarrService.get(movieId);
  }
}
