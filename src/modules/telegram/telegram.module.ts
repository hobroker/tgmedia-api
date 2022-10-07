import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandbrakeModule } from '../handbrake';
import { telegramConfig } from './telegram.config';
import { TelegramService } from './services';

@Module({
  imports: [ConfigModule.forFeature(telegramConfig), HandbrakeModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
