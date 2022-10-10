import type { IMovie as _IMovie } from '@jc21/radarr-api';
import type { IImage } from './image';
import type { ICredit } from './credit';

export interface IMovie extends _IMovie {
  images: IImage[];
  credits: ICredit[];
  movieFile: _IMovie['movieFile'] & {
    path: string;
  };
}
