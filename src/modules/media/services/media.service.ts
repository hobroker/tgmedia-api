import { Injectable, Logger } from '@nestjs/common';
import {
  applySpec,
  compose,
  filter,
  head,
  map,
  match,
  nth,
  prop,
  reduce,
  uniq,
} from 'ramda';
import { TelegramService } from '../../telegram';
import { Movie, Show } from '../../messenger';
import { SonarrService } from '../../sonarr';

const extractUniqTitles = compose(
  uniq,
  map(compose(head, match(/^(.*)$/m), prop('message'))),
);

const extractSeasonEpisodesMap = compose(
  reduce(
    (acc, { episodeNumber, seasonNumber }) => ({
      ...acc,
      [seasonNumber]: {
        ...acc[seasonNumber],
        [episodeNumber]: true,
      },
    }),
    {},
  ),
  map(
    applySpec({
      seasonNumber: compose(Number, nth(1)),
      episodeNumber: compose(Number, nth(2)),
    }),
  ),
  filter(prop('length')),
  map(compose(match(/S([0-9]+)E([0-9]+)/), prop('message'))),
);

@Injectable()
export class MediaService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly sonarrService: SonarrService,
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

  async getPublishedShowEpisodes(showId: number) {
    const show = new Show(await this.sonarrService.get(showId));

    return this.telegramService
      .findChannelMessageByTitle(
        { search: show.rawTitle },
        { includes: [Show.IdentityTag] },
      )
      .then((message) => {
        if (!message) {
          throw new Error('Show not found');
        }

        return message;
      })
      .then(({ id }) =>
        this.telegramService.getChannelMessageComments({ replyTo: id }),
      )
      .then(extractSeasonEpisodesMap);
  }
}
