import { EventEmitter } from 'events';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { tail } from 'ramda';
import { queueConfig } from '../queue.config';
import type { QueueEpisodeArgs, QueueMovieArgs } from '../queue.types';
import { QueueType } from '../queue.constants';
import { delay } from '../../../util/promise';

type QueueItem = { type: QueueType; args: QueueMovieArgs | QueueEpisodeArgs };

@Injectable()
export class QueueService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);
  private queue: QueueItem[] = [];
  private isWorking = false;

  private emitter = new EventEmitter();

  constructor(
    @Inject(queueConfig.KEY)
    private config: ConfigType<typeof queueConfig>,
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

    // await this.messengerMovieService
    //   .sendToTelegram(movie)
    //   .catch(this.logger.error.bind(this.logger));

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
