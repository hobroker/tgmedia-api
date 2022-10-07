import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { TelegramModule } from '../telegram';
import { HandbrakeModule } from '../handbrake';
import { radarrConfig } from './radarr.config';
import { RadarrController } from './controllers';
import {
  RadarrService,
  RadarrHttpConfigService,
  MessengerService,
} from './services';

@Module({
  imports: [
    ConfigModule.forFeature(radarrConfig),
    HttpModule.registerAsync({
      useClass: RadarrHttpConfigService,
      imports: [ConfigModule.forFeature(radarrConfig)],
    }),
    TelegramModule,
    HandbrakeModule,
  ],
  providers: [RadarrService, MessengerService],
  controllers: [RadarrController],
})
export class RadarrModule {}
