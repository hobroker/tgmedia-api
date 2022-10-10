import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TelegramService } from '../../telegram';
import { HandbrakeService } from '../../handbrake';
import { messengerConfig } from '../messenger.config';
import type { IMovie } from '../../radarr';
import { Movie } from '../entities';

@Injectable()
export class MessengerService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(messengerConfig.KEY)
    private config: ConfigType<typeof messengerConfig>,
    private readonly telegramService: TelegramService,
    private readonly handbrakeService: HandbrakeService,
  ) {}

  async sendToTelegram(rawMovie: IMovie) {
    const movie = new Movie(rawMovie, {
      overrideMediaPath: this.config.overrideMediaPath,
    });

    this.logger.debug('sending main message to the channel', movie.toString());
    const message = await this.telegramService.sendPhotoToChannel({
      caption: movie.caption,
      file: movie.image,
    });

    movie.video = await this.convertVideo({ commentTo: message.id }, movie);

    await this.sendVideo({ commentTo: message.id }, movie);
  }

  private async sendVideo({ commentTo }: { commentTo: number }, movie: Movie) {
    this.logger.debug('sending video to discussion', movie.video);
    const [updateMessage, deleteMessage] =
      await this.telegramService.createUpdatingCommentToChannel({
        commentTo,
        message: '<code>starting to upload...</code>',
      });

    const progressCallback = (progress: number) => {
      const text = `uploading... ${progress}%`;

      this.logger.debug(text);

      return updateMessage(`<code>${text}</code>`);
    };

    await this.telegramService.commentVideoToChannel({
      commentTo,
      caption: movie.title,
      file: movie.video,
      progressCallback,
    });

    await deleteMessage();
  }

  private async convertVideo(
    { commentTo }: { commentTo: number },
    movie: Movie,
  ) {
    this.logger.debug('encoding the video', movie.video);
    const [updateMessage, deleteMessage] =
      await this.telegramService.createUpdatingCommentToChannel({
        commentTo,
        message: '<code>starting to encode...</code>',
      });
    const progressCallback = (progress: string) => {
      this.logger.debug(progress);

      return updateMessage(`<code>${progress}</code>`);
    };

    const video = await this.handbrakeService.convert(
      movie.video,
      progressCallback,
    );

    await deleteMessage();

    return video;
  }
}
