import { Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { TelegramService } from '../../telegram/services';

@Injectable()
export class RadarrService {
  constructor(
    private readonly httpService: HttpService,
    private readonly telegramService: TelegramService,
  ) {}

  async list() {
    const { data } = await this.httpService.get('movie');

    return data;
  }

  async get(movieId: number) {
    const { data } = await this.httpService.get(`movie/${movieId}`);

    return data;
  }

  async sendToTelegram(movie) {
    const caption = [
      `<b>${movie.title}</b>`,
      `${movie.overview}`,
      `🎬<a href="https://youtube.com/watch?v=${movie.youTubeTrailerId}">Trailer</a>`,
      [movie.genres.map((tag) => `#${tag}`).join(' '), '#Movie'].join('\n'),
    ].join('\n\n');
    const image = movie.images.find(
      ({ coverType }) => coverType === 'poster',
    ).remoteUrl;

    await this.telegramService.sendPhoto({
      caption,
      image,
    });
  }
}
