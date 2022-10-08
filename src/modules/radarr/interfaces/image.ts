import { IImage as _IImage } from '@jc21/radarr-api/lib/models';

export interface IImage extends _IImage {
  remoteUrl: string;
}
