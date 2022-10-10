import { CoverType } from '../../media';

export interface IShow {
  title: string;
  overview: string;
  images: Array<{
    coverType: CoverType;
    remoteUrl: string;
  }>;
  seasons: Array<{
    seasonNumber: number;
    episodeCount: number;
    totalEpisodeCount: number;
  }>;
  genres: Array<string>;
}
