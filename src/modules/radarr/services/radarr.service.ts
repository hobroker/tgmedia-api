import { Injectable } from '@nestjs/common';
import { HttpService } from '../../http';

@Injectable()
export class RadarrService {
  constructor(private readonly httpService: HttpService) {}

  async list() {
    const { data } = await this.httpService.get('movie');

    return data;
  }

  async get(movieId: number) {
    const { data } = await this.httpService.get(`movie/${movieId}`);
    const { data: credits } = await this.httpService.get('credit', {
      params: { movieId },
    });

    return { ...data, credits: credits.splice(0, 2) };
  }
}
