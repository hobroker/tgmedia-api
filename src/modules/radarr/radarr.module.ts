import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { radarrConfig } from './radarr.config';
import { RadarrController } from './controllers';
import { RadarrService } from './services';

@Module({
  imports: [ConfigModule.forFeature(radarrConfig)],
  providers: [RadarrService],
  controllers: [RadarrController],
})
export class RadarrModule {}
