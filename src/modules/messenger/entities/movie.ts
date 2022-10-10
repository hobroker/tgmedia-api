import { compose, concat, prop, propEq, replace } from 'ramda';
import { CoverType } from '@jc21/radarr-api/lib/models/enums/CoverType';
import type { IMovie } from '../../radarr';

const toTag = compose(concat('#'), replace(/\s/g, ''));

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

  toString() {
    return this.movie.title;
  }

  get title() {
    return `<b>${this.movie.title}</b>`;
  }

  get image() {
    return this.movie.images.find(propEq('coverType', CoverType.Poster))
      .remoteUrl;
  }

  get caption() {
    return [
      this.title,
      this.movie.overview,
      `🎬<a href="https://youtube.com/watch?v=${this.movie.youTubeTrailerId}">Trailer</a>`,
      [this.movie.genres.map(toTag).join(' '), toTag('Movie')].join('\n'),
      `👥` +
        this.movie.credits.map(compose(toTag, prop('personName'))).join(' '),
    ].join('\n\n');
  }

  get video() {
    return this.overrideMediaPath || this.movie.movieFile.path;
  }

  set video(value: string) {
    this.movie.movieFile.path = value;
  }
}
