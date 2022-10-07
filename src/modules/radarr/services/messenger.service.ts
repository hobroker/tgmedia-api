import { Injectable } from '@nestjs/common';
import { compose, concat, prop, propEq, replace } from 'ramda';
import { TelegramService } from '../../telegram';
import { HandbrakeService } from '../../handbrake';
import { noop } from '../../../util/noop';

const toTag = compose(concat('#'), replace(/\s/g, ''));

@Injectable()
export class MessengerService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly handbrakeService: HandbrakeService,
  ) {}

  async sendToTelegram(movie) {
    const message = await this.sendMainMessage(movie);
    const discussionMessage =
      await this.telegramService.waitForDiscussionMessage(message.message_id);

    const video = await this.convertVideo(
      discussionMessage.message_id,
      movie.movieFile.path,
    );

    await this.telegramService.sendVideoToDiscussion(
      discussionMessage.message_id,
      {
        caption: `<b>${movie.title}</b>`,
        video,
      },
    );
  }

  private async sendMainMessage(movie) {
    const caption = [
      `<b>${movie.title}</b>`,
      movie.overview,
      `🎬<a href="https://youtube.com/watch?v=${movie.youTubeTrailerId}">Trailer</a>`,
      [movie.genres.map(toTag).join(' '), toTag('Movie')].join('\n'),
      `👥` + movie.credits.map(compose(toTag, prop('personName'))).join(' '),
    ].join('\n\n');
    const image = movie.images.find(propEq('coverType', 'poster')).remoteUrl;

    return this.telegramService.sendPhoto({
      caption,
      image,
    });
  }

  private async convertVideo(
    discussionMessageId: number,
    movieFilePath: string,
  ) {
    const updateMessage = await this.telegramService.sendMessageToDiscussion(
      'hell',
      discussionMessageId,
    );

    const onProgress = async (progress) => {
      return this.telegramService
        .updateDiscussionMessage(progress, updateMessage.message_id)
        .catch(noop);
    };

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
