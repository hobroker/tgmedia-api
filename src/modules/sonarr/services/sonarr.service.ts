import { Injectable } from '@nestjs/common';
import { applySpec, compose, filter, groupBy, map, prop } from 'ramda';
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

  async getShowSeasons(seriesId: number): Promise<Record<string, IEpisode[]>> {
    const { data: episodes } = await this.httpService.get('episode', {
      params: { seriesId },
    });
    const { data: episodeFiles } = await this.httpService.get('episodeFile', {
      params: { seriesId },
    });

    const episodeFileMap: Record<string, string | undefined> =
      groupEpisodeFiles(episodeFiles);
    const episodeMap: IEpisode[] = mapEpisodes(episodes).map((episode) => ({
      ...episode,
      path: episodeFileMap[episode.fileId] || null,
    }));

    return groupBy<IEpisode>(compose(String, prop('seasonNumber')), episodeMap);
  }
}
