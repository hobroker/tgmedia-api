import { Module } from '@nestjs/common';
import { SonarrModule } from '../sonarr';
import { RadarrModule } from '../radarr';
import { MediaController } from './controllers';

@Module({
  imports: [RadarrModule, SonarrModule],
  controllers: [MediaController],
})
export class MediaModule {}
