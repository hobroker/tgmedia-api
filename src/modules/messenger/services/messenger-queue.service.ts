import { EventEmitter } from 'events';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QueueType } from '../messenger.constants';
import { MessengerMovieService } from './messenger-movie.service';
import { MessengerShowService } from './messenger-show.service';

@Injectable()
export class MessengerQueueService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);
  private emitter = new EventEmitter();
  private queue: QueueItem[] = [];
  private isWorking = false;

  constructor(
    private readonly messengerMovieService: MessengerMovieService,
    private readonly messengerShowService: MessengerShowService,
  ) {
    this.handleMovieEvent = this.handleMovieEvent.bind(this);
    this.handleEpisodeEvent = this.handleEpisodeEvent.bind(this);
  }

  add({ type, args }: QueueItem): number {
    this.logger.log('ADD to queue', type, args);
    this.queue = [...this.queue, { type, args }];

    if (!this.isWorking) {
      this.next();
    }

    return this.queue.length;
  }

  private next() {
    if (!this.queue.length) {
      this.isWorking = false;

      return;
    }

    this.isWorking = true;

    const [{ type, args }] = this.queue;

    this.queue = this.queue.slice(1);

    this.emitter.emit(type, args);
  }

  private async handleMovieEvent(args: QueueMovieArgs) {
    this.logger.log('START executing', QueueType.Movie, args);

    await this.messengerMovieService
      .send(args)
      .catch(this.logger.error.bind(this.logger));

    this.logger.log('DONE', QueueType.Movie, args);
    this.next();
  }

  private async handleEpisodeEvent(args: QueueEpisodeArgs) {
    this.logger.log('EXECUTING', QueueType.Episode, args);

    await this.messengerShowService
      .sendEpisode(args)
      .catch(this.logger.error.bind(this.logger));

    this.logger.log('DONE', QueueType.Episode, args);
    this.next();
  }

  async onModuleInit() {
    this.emitter.on(QueueType.Movie, this.handleMovieEvent);
    this.emitter.on(QueueType.Episode, this.handleEpisodeEvent);
  }
}

type QueueMovieArgs = {
  movieId: number;
};
type QueueEpisodeArgs = {
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
};
type QueueItem = { type: QueueType; args: QueueMovieArgs | QueueEpisodeArgs };
