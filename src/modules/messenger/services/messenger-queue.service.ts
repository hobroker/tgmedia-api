import { EventEmitter } from 'events';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { tail } from 'ramda';
import { QueueType } from '../messenger.constants';
import { delay } from '../../../util/promise';
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

  add({ type, args }: QueueItem) {
    this.logger.log('ADD to queue', type, args);
    this.queue = [...this.queue, { type, args }];

    if (this.isWorking) {
      return;
    }

    this.next();

    return this.queue.length;
  }

  private next() {
    if (!this.queue.length) {
      this.isWorking = false;

      return;
    }

    this.isWorking = true;

    const [{ type, args }] = this.queue;

    this.queue = tail(this.queue);

    this.emitter.emit(type, args);
  }

  private async handleMovieEvent({ movieId }: QueueMovieArgs) {
    this.logger.log('START executing', QueueType.Movie, { movieId });

    await this.messengerMovieService
      .send({ movieId })
      .catch(this.logger.error.bind(this.logger));

    this.logger.log('DONE', QueueType.Movie, { movieId });
    this.next();
  }

  private async handleEpisodeEvent({
    showId,
    episodeNumber,
    seasonNumber,
  }: QueueEpisodeArgs) {
    this.logger.log('EXECUTING', QueueType.Episode, {
      showId,
      episodeNumber,
      seasonNumber,
    });

    await delay(5000);

    this.logger.log('DONE', QueueType.Episode, {
      showId,
      episodeNumber,
      seasonNumber,
    });
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
