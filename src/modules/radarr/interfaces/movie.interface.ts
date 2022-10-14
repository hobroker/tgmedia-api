import { CoverType } from '../../media';

export interface IMovie {
  id: string;
  title: string;
  overview: string;
  youTubeTrailerId: string;
  genres: Array<string>;
  images: Array<{
    coverType: CoverType;
    remoteUrl: string;
  }>;
  credits: Array<{
    personName: string;
  }>;
  movieFile: {
    path: string;
  };
}
