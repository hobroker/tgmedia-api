import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { HealthModule } from './modules/health';
import { MessengerModule } from './modules/messenger';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
    }),
    ConfigModule.forFeature(appConfig),
    HealthModule,
    HealthModule,
    MessengerModule,
  ],
})
export class AppModule {}
