import { Module } from '@nestjs/common';
import { SonarrModule } from '../sonarr';
import { RadarrModule } from '../radarr';
import { TelegramModule } from '../telegram';
import { MediaController } from './controllers';
import { MediaService } from './services';

@Module({
  imports: [RadarrModule, SonarrModule, TelegramModule],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
