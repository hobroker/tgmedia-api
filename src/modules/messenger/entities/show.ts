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

  get rawTitle() {
    return this.show.title;
  }

  get title() {
    return `<b>${this.show.title}</b>`;
  }

  get searchString() {
    return `${this.show.title}\n`;
  }

  get raw() {
    return this.show;
  }

  get image() {
    return this.show.images.find(propEq('coverType', CoverType.Poster))
      .remoteUrl;
  }

  get caption() {
    const { overview, genres } = this.show;

    return [
      this.title,
      overview,
      [genres.map(toTag).join(' '), Show.IdentityTag].join('\n'),
    ].join('\n\n');
  }

  static IdentityTag = '#TVSeries';
}
