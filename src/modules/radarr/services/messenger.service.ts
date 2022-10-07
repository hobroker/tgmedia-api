import { Injectable } from '@nestjs/common';
import { compose, concat, prop, propEq, replace } from 'ramda';
import { TelegramService } from '../../telegram/services';
import { HandbrakeService } from '../../handbrake/services';
import { noop } from '../../../util/noop';

@Injectable()
export class MessengerService {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly handbrakeService: HandbrakeService,
  ) {}

  async sendToTelegram(movie) {
    const title = `<b>${movie.title}</b>`;

    const caption = [
      title,
      movie.overview,
      `🎬<a href="https://youtube.com/watch?v=${movie.youTubeTrailerId}">Trailer</a>`,
      [movie.genres.map(concat('#')).join(' '), '#Movie'].join('\n'),
      `👥` +
        movie.credits
          .map(compose(concat('#'), replace(/\s/g, ''), prop('personName')))
          .join(' '),
    ].join('\n\n');
    const image = movie.images.find(propEq('coverType', 'poster')).remoteUrl;

    const message = await this.telegramService.sendPhoto({
      caption,
      image,
    });
    const discussionMessage =
      await this.telegramService.waitForDiscussionMessage(message.message_id);

    const updateMessage = await this.telegramService.sendMessageToDiscussion(
      'hell',
      discussionMessage.message_id,
    );

    let prevMessage;
    const onProgress = async (progress) => {
      if (progress === prevMessage) {
        return;
      }
      prevMessage = progress;

      return this.telegramService
        .updateDiscussionMessage(progress, updateMessage.message_id)
        .catch(noop);
    };

    const video = await this.handbrakeService.convert(
      '/Users/ileahu/Documents/hb/original.mp4',
      onProgress,
      // movie.movieFile.path,
    );

    await this.telegramService.deleteDiscussionMessage(
      updateMessage.message_id,
    );

    await this.telegramService.sendVideoToDiscussion(
      discussionMessage.message_id,
      {
        caption: title,
        video,
      },
    );
  }
}
