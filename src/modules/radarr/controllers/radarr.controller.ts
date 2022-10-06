import { Controller, Get } from '@nestjs/common';
import { RadarrService } from '../services';
import { RADARR_MODULE_ID } from '../radarr.constants';

@Controller(RADARR_MODULE_ID)
export class RadarrController {
  constructor(private readonly radarrService: RadarrService) {}

  @Get()
  list() {
    return {
      log: 1,
    };
  }
}
