import { IEpisode } from '../../sonarr/interfaces';
import { Show } from './show';

export class Episode {
  private readonly episode: IEpisode;
  private readonly show: Show;
  private readonly overrideMediaPath: string;

  constructor(
    episode: IEpisode,
    show: Show,
    { overrideMediaPath }: { overrideMediaPath?: string } = {},
  ) {
    this.episode = episode;
    this.show = show;
    this.overrideMediaPath = overrideMediaPath;
  }

  get rawTitle() {
    return this.episode.title;
  }

  get caption() {
    return `${this.show.raw.title} S${this.episode.seasonNumber}E${this.episode.number} - ${this.episode.title}`;
  }

  get raw() {
    return this.episode;
  }

  get video() {
    return this.overrideMediaPath || this.episode.path;
  }
}
