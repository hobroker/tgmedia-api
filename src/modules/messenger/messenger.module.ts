import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '../telegram';
import { RadarrModule } from '../radarr';
import { SonarrModule } from '../sonarr';
import { HandbrakeModule } from '../handbrake';
import { messengerConfig } from './messenger.config';
import {
  MessengerMovieService,
  MessengerQueueService,
  MessengerShowService,
} from './services';
import { MessengerController } from './controllers';

@Module({
  imports: [
    ConfigModule.forFeature(messengerConfig),
    TelegramModule,
    RadarrModule,
    SonarrModule,
    HandbrakeModule,
  ],
  providers: [
    MessengerMovieService,
    MessengerShowService,
    MessengerQueueService,
  ],
  controllers: [MessengerController],
})
export class MessengerModule {}
