import { Injectable } from '@nestjs/common';
import { applySpec, compose, filter, map, prop } from 'ramda';
import { HttpService } from '../../http';
import { IEpisode, IShow } from '../interfaces';

const mapEpisodes = compose(
  map(
    applySpec<IEpisode>({
      number: prop('episodeNumber'),
      title: prop('title'),
      hasFile: prop('hasFile'),
      fileId: prop('episodeFileId'),
      seasonNumber: prop('seasonNumber'),
    }),
  ),
  filter(prop('seasonNumber')),
);

const groupEpisodeFiles = (episodeFiles) =>
  episodeFiles.reduce((acc, { id, path }) => ({ ...acc, [id]: path }), {});

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

  async getShowSeasons(
    seriesId: number,
  ): Promise<Record<string, Record<string, IEpisode>>> {
    const [{ data: episodes }, { data: episodeFiles }] = await Promise.all([
      this.httpService.get('episode', { params: { seriesId } }),
      this.httpService.get('episodeFile', { params: { seriesId } }),
    ]);

    const episodeFileMap: Record<string, string> =
      groupEpisodeFiles(episodeFiles);

    return mapEpisodes(episodes)
      .map((episode) => ({
        ...episode,
        path: episodeFileMap[episode.fileId] || null,
      }))
      .reduce(
        (acc, episode) => ({
          ...acc,
          [episode.seasonNumber]: {
            ...acc[episode.seasonNumber],
            [episode.number]: episode,
          },
        }),
        {},
      );
  }
}
