import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TelegramModule } from '../telegram';
import { HandbrakeModule } from '../handbrake';
import { RadarrModule } from '../radarr';
import { messengerConfig } from './messenger.config';
import { MessengerService } from './services';
import { MessengerController } from './controllers';

@Module({
  imports: [
    ConfigModule.forFeature(messengerConfig),
    TelegramModule,
    HandbrakeModule,
    RadarrModule,
  ],
  providers: [MessengerService],
  controllers: [MessengerController],
})
export class MessengerModule {}
