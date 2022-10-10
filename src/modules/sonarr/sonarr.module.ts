import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { sonarrConfig } from './sonarr.config';
import { SonarrService, SonarrHttpConfigService } from './services';

@Module({
  imports: [
    ConfigModule.forFeature(sonarrConfig),
    HttpModule.registerAsync({
      useClass: SonarrHttpConfigService,
      imports: [ConfigModule.forFeature(sonarrConfig)],
    }),
  ],
  providers: [SonarrService],
  exports: [SonarrService],
})
export class SonarrModule {}
