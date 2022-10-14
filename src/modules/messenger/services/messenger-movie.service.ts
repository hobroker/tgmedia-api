import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { compose, head, match, prop } from 'ramda';
import { TelegramHelperService, TelegramService } from '../../telegram';
import { messengerConfig } from '../messenger.config';
import { Movie } from '../entities';
import { IMovie } from '../../radarr';

@Injectable()
export class MessengerMovieService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly telegramService: TelegramService,
    private readonly telegramHelperService: TelegramHelperService,
  ) {}

  async sendToTelegram(rawMovie: IMovie) {
    const movie = new Movie(rawMovie, {
      overrideMediaPath: this.config.overrideMediaPath,
    });

    this.logger.debug('sending main message to the channel:', movie.toString());
    const message = await this.telegramService.sendPhotoToChannel({
      caption: movie.caption,
      file: movie.image,
    });

    this.logger.debug('converting video:', movie.toString());
    const file = await this.telegramHelperService.sendConvertVideoProgress(
      { commentTo: message.id },
      { input: movie.video, outputFilename: movie.id },
    );

    this.logger.debug('converting video done:', movie.toString());

    this.logger.debug('sending video:', movie.toString());
    await this.telegramHelperService.sendVideo({
      file,
      commentTo: message.id,
      caption: movie.caption,
    });
    this.logger.debug('sending video done:', movie.toString());
  }

  async getPublishedMovies() {
    const messages = await this.telegramService.findChannelMessages({
      search: '#Movie',
    });

    return messages.map(compose(head, match(/^(.*)$/m), prop('message')));
  }
}
