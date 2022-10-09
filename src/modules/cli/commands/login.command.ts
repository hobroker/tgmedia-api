import { Command, CommandRunner } from 'nest-commander';
import { Logger } from '@nestjs/common';
import { WithDuration } from '../util';
import { TelegramAuthService } from '../../telegram';

@Command({
  name: 'login',
  description: 'Login to Telegram',
})
export class LoginCommand extends CommandRunner {
  private readonly logger = new Logger(this.constructor.name);
  constructor(private readonly telegramAuthService: TelegramAuthService) {
    super();
  }

  @WithDuration()
  async run() {
    await this.telegramAuthService.login();
    await this.telegramAuthService
      .getMe()
      .then(this.logger.log.bind(this.logger));
  }
}
