import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '../telegram';
import { RadarrModule } from '../radarr';
import { SonarrModule } from '../sonarr';
import { messengerConfig } from './messenger.config';
import { MessengerMovieService, MessengerShowService } from './services';
import { MessengerController } from './controllers';

@Module({
  imports: [
    ConfigModule.forFeature(messengerConfig),
    TelegramModule,
    RadarrModule,
    SonarrModule,
  ],
  providers: [MessengerMovieService, MessengerShowService],
  controllers: [MessengerController],
})
export class MessengerModule {}
