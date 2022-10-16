import { Controller, Get, Param } from '@nestjs/common';
import { always } from 'ramda';
import { MEDIA_MODULE_ID } from '../media.constants';
import { RadarrService } from '../../radarr';
import { SonarrService } from '../../sonarr';
import { MediaService } from '../services';

@Controller(MEDIA_MODULE_ID)
export class MediaController {
  constructor(
    private readonly radarrService: RadarrService,
    private readonly sonarrService: SonarrService,
    private readonly mediaService: MediaService,
  ) {}

  @Get('movies')
  listMovies() {
    return this.radarrService.list();
  }

  @Get('movies/published')
  async listPublishedMovies() {
    return this.mediaService.getPublishedMovies();
  }

  @Get('shows/published')
  async listPublishedShows() {
    return this.mediaService.getPublishedShows();
  }

  @Get('shows/published/:showId')
  async listPublishedShowEpisodes(@Param() { showId }: { showId: number }) {
    return this.mediaService.getPublishedShowEpisodes(showId).catch(always({}));
  }

  @Get('shows')
  listShows() {
    return this.sonarrService.list();
  }

  @Get('movie/:movieId')
  async getMovie(@Param() { movieId }: { movieId: number }) {
    return this.radarrService.get(movieId);
  }

  @Get('show/:showId')
  async getShow(@Param() { showId }: { showId: number }) {
    return this.sonarrService.get(showId);
  }

  @Get('show/:showId/seasons')
  async getShowSeasons(@Param() { showId }: { showId: number }) {
    return this.sonarrService.getShowSeasons(showId);
  }
}
