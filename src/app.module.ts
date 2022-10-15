import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './app.config';
import { HealthModule } from './modules/health';
import { MessengerModule } from './modules/messenger';
import { MediaModule } from './modules/media';
import { QueueModule } from './modules/queue';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.production'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    ConfigModule.forFeature(appConfig),
    HealthModule,
    MediaModule,
    QueueModule,
    MessengerModule,
  ],
})
export class AppModule {}
