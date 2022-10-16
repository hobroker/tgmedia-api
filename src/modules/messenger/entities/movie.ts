import { compose, prop, propEq } from 'ramda';
import { CoverType } from '@jc21/radarr-api/lib/models/enums/CoverType';
import { IMovie } from '../../radarr';
import { toTag } from '../utils/toTag';

export class Movie {
  private readonly movie: IMovie;
  private readonly overrideMediaPath: string;

  constructor(
    movie: IMovie,
    { overrideMediaPath }: { overrideMediaPath?: string },
  ) {
    this.movie = movie;
    this.overrideMediaPath = overrideMediaPath;
  }

  get rawTitle() {
    return this.movie.title;
  }

  get id() {
    return this.movie.id;
  }

  get title() {
    return `<b>${this.movie.title}</b>`;
  }

  get image() {
    return this.movie.images.find(propEq('coverType', CoverType.Poster))
      .remoteUrl;
  }

  get caption() {
    const { overview, genres, youTubeTrailerId, credits } = this.movie;

    return [
      this.title,
      overview,
      `🎬<a href="https://youtube.com/watch?v=${youTubeTrailerId}">Trailer</a>`,
      [genres.map(toTag).join(' '), Movie.IdentityTag].join('\n'),
      `👥` + credits.map(compose(toTag, prop('personName'))).join(' '),
    ].join('\n\n');
  }

  get video() {
    return this.overrideMediaPath || this.movie.movieFile.path;
  }

  static IdentityTag = '#Movie';
}
