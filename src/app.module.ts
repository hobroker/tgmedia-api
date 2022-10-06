import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { HealthModule } from './modules/health';
import { RadarrModule } from './modules/radarr';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
    }),
    ConfigModule.forFeature(appConfig),
    HealthModule,
    HealthModule,
    RadarrModule,
  ],
})
export class AppModule {}
