import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandbrakeModule } from '../handbrake';
import { telegramConfig } from './telegram.config';
import {
  TelegramAuthService,
  TelegramHelperService,
  TelegramService,
} from './services';

@Module({
  imports: [ConfigModule.forFeature(telegramConfig), HandbrakeModule],
  providers: [TelegramService, TelegramAuthService, TelegramHelperService],
  exports: [TelegramService, TelegramAuthService, TelegramHelperService],
})
export class TelegramModule {}
