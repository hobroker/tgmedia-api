import { propEq } from 'ramda';
import { CoverType } from '@jc21/radarr-api/lib/models/enums/CoverType';
import { IShow } from '../../sonarr/interfaces';
import { toTag } from '../utils/toTag';

export class Show {
  private readonly show: IShow;
  private readonly overrideMediaPath: string;

  constructor(
    show: IShow,
    { overrideMediaPath }: { overrideMediaPath?: string } = {},
  ) {
    this.show = show;
    this.overrideMediaPath = overrideMediaPath;
  }

  toString() {
    return this.show.title;
  }

  get title() {
    return `<b>${this.show.title}</b>`;
  }

  get searchString() {
    return `${this.show.title}\n\n`;
  }

  get raw() {
    return this.show;
  }

  get image() {
    return this.show.images.find(propEq('coverType', CoverType.Poster))
      .remoteUrl;
  }

  get caption() {
    return [
      this.title,
      this.show.overview,
      [this.show.genres.map(toTag).join(' '), toTag('TVSeries')].join('\n'),
    ].join('\n\n');
  }
}
