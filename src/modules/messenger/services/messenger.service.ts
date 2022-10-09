import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramService } from '../../telegram';
import { HandbrakeService } from '../../handbrake';
import { messengerConfig } from '../messenger.config';
import { IMovie } from '../../radarr';
import { Movie } from '../entities';

@Injectable()
export class MessengerService {
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

    const message = await this.telegramService.sendPhotoToChannel({
      caption: movie.caption,
      file: movie.image,
    });
    const discussionMessage =
      await this.telegramService.waitForDiscussionMessage(message.id);

    movie.video = await this.convertVideo(discussionMessage.id, movie);
    await this.sendVideo(discussionMessage.id, movie);
  }

  private async sendVideo(replyTo: number, movie: Movie) {
    const [updateMessage, deleteMessage] =
      await this.telegramService.createUpdatingMessageToDiscussion({
        replyTo,
        message: 'uploading the video...',
      });

    const progressCallback = (progress: number) =>
      updateMessage(`uploading the video... ${progress}%`);

    await this.telegramService.sendVideoToDiscussion({
      replyTo,
      caption: movie.title,
      file: movie.video,
      progressCallback,
    });

    await deleteMessage();
  }

  private async convertVideo(replyTo: number, movie: Movie) {
    const [updateMessage, deleteMessage] =
      await this.telegramService.createUpdatingMessageToDiscussion({
        replyTo,
        message: 'encoding the video...',
      });

    const video = await this.handbrakeService.convert(
      movie.video,
      updateMessage,
    );

    await deleteMessage();

    return video;
  }
}
