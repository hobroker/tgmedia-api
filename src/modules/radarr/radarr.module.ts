import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { radarrConfig } from './radarr.config';
import { RadarrService, RadarrHttpConfigService } from './services';

@Module({
  imports: [
    ConfigModule.forFeature(radarrConfig),
    HttpModule.registerAsync({
      useClass: RadarrHttpConfigService,
      imports: [ConfigModule.forFeature(radarrConfig)],
    }),
  ],
  providers: [RadarrService],
  exports: [RadarrService],
})
export class RadarrModule {}
