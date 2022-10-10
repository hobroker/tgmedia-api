import { Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { IMovie } from '../interfaces';

@Injectable()
export class RadarrService {
  constructor(private readonly httpService: HttpService) {}

  async list(): Promise<IMovie[]> {
    const { data } = await this.httpService.get('movie');

    return data;
  }

  async get(movieId: number): Promise<IMovie> {
    const { data } = await this.httpService.get(`movie/${movieId}`);
    const { data: credits } = await this.httpService.get('credit', {
      params: { movieId },
    });

    return { ...data, credits: credits.splice(0, 2) };
  }
}
