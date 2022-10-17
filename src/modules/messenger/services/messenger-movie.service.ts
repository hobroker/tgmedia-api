import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramHelperService } from '../../telegram';
import { messengerConfig } from '../messenger.config';
import { Movie, Show } from '../entities';
import { RadarrService } from '../../radarr';

@Injectable()
export class MessengerMovieService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly radarrService: RadarrService,
    private readonly telegramHelperService: TelegramHelperService,
  ) {}

  async send({ movieId }: { movieId: number }) {
    const rawMovie = await this.radarrService.get(movieId);
    const movie = new Movie(rawMovie, {
      overrideMediaPath: this.config.overrideMediaPath,
    });

    this.logger.debug('sending main message to the channel:', movie.rawTitle);
    const message = await this.upsertChannelMessage(movie);

    this.logger.debug('encoding video:', movie.rawTitle);
    const file = await this.telegramHelperService.sendConvertVideoProgress(
      { commentTo: message.id },
      { input: movie.video, outputFilename: movie.id },
    );

    this.logger.debug('encoding video done:', movie.rawTitle);

    this.logger.debug('sending video:', movie.rawTitle);
    await this.telegramHelperService.sendVideo({
      file,
      commentTo: message.id,
      caption: movie.title,
    });
    this.logger.debug('sending video done:', movie.rawTitle);
  }

  private upsertChannelMessage(movie: Movie) {
    this.logger.debug('finding main message in the channel:', movie.rawTitle);

    return this.telegramHelperService.upsertChannelMessage(
      { search: movie.rawTitle },
      { caption: movie.caption, file: movie.image },
      { includes: [Show.IdentityTag] },
    );
  }
}
