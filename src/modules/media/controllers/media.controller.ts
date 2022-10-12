import { Controller, Get, Param } from '@nestjs/common';
import { MEDIA_MODULE_ID } from '../media.constants';
import { RadarrService } from '../../radarr';
import { SonarrService } from '../../sonarr';

@Controller(MEDIA_MODULE_ID)
export class MediaController {
  constructor(
    private readonly radarrService: RadarrService,
    private readonly sonarrService: SonarrService,
  ) {}

  @Get('movies')
  listMovies() {
    return this.radarrService.list();
  }

  @Get('shows')
  listShows() {
    return this.sonarrService.list();
  }

  @Get('movie/:movieId')
  async getMovie(@Param() { movieId }: { movieId: number }) {
    return this.radarrService.get(movieId);
  }

  @Get('show/:seriesId')
  async getShow(@Param() { seriesId }: { seriesId: number }) {
    return this.sonarrService.get(seriesId);
  }

  @Get('show/:seriesId/seasons')
  async getShowSeasons(@Param() { seriesId }: { seriesId: number }) {
    return this.sonarrService.getShowSeasons(seriesId);
  }
}
