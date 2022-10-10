import { Injectable } from '@nestjs/common';
import { HttpService } from '../../http';
import { IShow } from '../interfaces';

@Injectable()
export class SonarrService {
  constructor(private readonly httpService: HttpService) {}

  async list(): Promise<IShow[]> {
    const { data } = await this.httpService.get('series');

    return data;
  }

  async get(seriesId: number): Promise<IShow> {
    const { data } = await this.httpService.get(`series/${seriesId}`);

    return data;
  }
}
