import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '../http';
import { TelegramModule } from '../telegram';
import { radarrConfig } from './radarr.config';
import { RadarrController } from './controllers';
import { RadarrService } from './services';
import { RadarrHttpConfigService } from './services/radarr-http-config.service';

@Module({
  imports: [
    ConfigModule.forFeature(radarrConfig),
    HttpModule.registerAsync({
      useClass: RadarrHttpConfigService,
      imports: [ConfigModule.forFeature(radarrConfig)],
    }),
    TelegramModule,
  ],
  providers: [RadarrService],
  controllers: [RadarrController],
})
export class RadarrModule {}
