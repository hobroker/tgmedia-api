import { IEpisode } from '../../sonarr/interfaces';

export class Episode {
  private readonly episode: IEpisode;
  private readonly overrideMediaPath: string;

  constructor(
    episode: IEpisode,
    { overrideMediaPath }: { overrideMediaPath?: string } = {},
  ) {
    this.episode = episode;
    this.overrideMediaPath = overrideMediaPath;
  }

  toString() {
    return this.episode.title;
  }

  get htmlTitle() {
    return `<b>${this.episode.title}</b>`;
  }

  get caption() {
    return `<b>${this.episode.title}</b>`;
  }

  get raw() {
    return this.episode;
  }

  get video() {
    return this.overrideMediaPath || this.episode.path;
  }
}
