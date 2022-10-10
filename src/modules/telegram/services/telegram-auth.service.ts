import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { TelegramClient } from 'telegram';
import { StoreSession } from 'telegram/sessions';
import { text } from 'input';
import { telegramConfig } from '../telegram.config';

@Injectable()
export class TelegramAuthService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);
  private stringSession = new StoreSession('.telegram');
  readonly client: TelegramClient;

  constructor(
    @Inject(telegramConfig.KEY)
    private config: ConfigType<typeof telegramConfig>,
  ) {
    this.client = new TelegramClient(
      this.stringSession,
      config.apiId,
      config.apiHash,
      {
        connectionRetries: 5,
        useWSS: true,
      },
    );
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async login() {
    return this.client.start({
      phoneNumber: async () => await text('Please enter your number: '),
      password: async () => await text('Please enter your password: '),
      phoneCode: async () => await text('Please enter the code you received: '),
      onError: this.logger.error.bind(this.logger),
    });
  }

  async getMe() {
    return this.client.getMe();
  }
}
