import { Injectable, Logger } from '@nestjs/common';
import { compose, head, map, match, prop, uniq } from 'ramda';
import { TelegramService } from '../../telegram';
import { RadarrService } from '../../radarr';
import { Movie, Show } from '../../messenger';

const extractUniqTitles = compose(
  uniq,
  map(compose(head, match(/^(.*)$/m), prop('message'))),
);

@Injectable()
export class MediaService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly radarrService: RadarrService,
    private readonly telegramService: TelegramService,
  ) {}

  async getPublishedMovies() {
    return this.telegramService
      .findChannelMessages({ search: Movie.IdentityTag })
      .then(extractUniqTitles);
  }

  async getPublishedShows() {
    return this.telegramService
      .findChannelMessages({ search: Show.IdentityTag })
      .then(extractUniqTitles);
  }
}
