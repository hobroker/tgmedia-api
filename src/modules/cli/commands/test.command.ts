import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { WithDuration } from '../util';

@Command({
  name: 'test',
  description: 'Test',
})
export class TestCommand extends CommandRunner {
  private readonly logger = new Logger(this.constructor.name);

  @WithDuration()
  async run() {
    this.logger.log('Running test command');
  }
}
