import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { compose, concat, flip } from 'ramda';
import { WithDuration } from '../util';
import { TelegramService } from '../../telegram';

@Command({
  name: 'test',
  description: 'Test',
})
export class TestCommand extends CommandRunner {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly telegramService: TelegramService) {
    super();
  }

  @WithDuration()
  async run() {
    this.logger.log('Running test command');
    await this.telegramService
      .commentVideoToChannel({
        file: '/Users/ileahu/Documents/hb/original.mp4',
        caption: 'Test',
        progressCallback: compose(console.log, flip(concat('%')), String),
      })
      .then((message) => {
        console.log('message', message);
      });
  }
}
