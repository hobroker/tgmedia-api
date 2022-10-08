import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TelegramService } from '../../telegram';
import { HandbrakeService } from '../../handbrake';
import { noop } from '../../../util/noop';
import { messengerConfig } from '../messenger.config';
import { IMovie } from '../../radarr';
import { Movie } from '../entities';
import { throttle } from '../../../util/throttle';

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

    const message = await this.sendMainMessage(movie);
    const discussionMessage =
      await this.telegramService.waitForDiscussionMessage(message.message_id);

    const video = await this.convertVideo(
      discussionMessage.message_id,
      movie.file,
    );

    await this.telegramService.sendVideoToDiscussion(
      discussionMessage.message_id,
      {
        caption: movie.title,
        video,
      },
    );
  }

  private async sendMainMessage(movie: Movie) {
    return this.telegramService.sendPhoto({
      caption: movie.caption,
      image: movie.image,
    });
  }

  private async convertVideo(
    discussionMessageId: number,
    movieFilePath: string,
  ) {
    const updateMessage = await this.telegramService.sendMessageToDiscussion(
      'starting to encode the video...',
      discussionMessageId,
    );

    const onProgress = throttle(async (progress) => {
      await this.telegramService
        .updateDiscussionMessage(progress, updateMessage.message_id)
        .catch(noop);
    }, 1000);

    const video = await this.handbrakeService.convert(
      movieFilePath,
      onProgress,
    );

    await this.telegramService.deleteDiscussionMessage(
      updateMessage.message_id,
    );

    return video;
  }
}
