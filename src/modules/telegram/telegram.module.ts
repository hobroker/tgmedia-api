import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HandbrakeModule } from '../handbrake';
import { telegramConfig } from './telegram.config';
import { TelegramBotService } from './services';

@Module({
  imports: [ConfigModule.forFeature(telegramConfig), HandbrakeModule],
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramModule {}
